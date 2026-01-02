import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethodResponseDto, PendingPaymentResponseDto, ReceiptResponseDto } from './dto/payment-response.dto';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const secretKey = this.configService.get<string>('stripe.secretKey');
    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-12-15.clover',
      });
    }
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethodResponseDto[]> {
    const methods = await this.prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return methods.map((method) => ({
      id: method.id,
      type: method.type,
      last4: method.last4,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      cardholderName: method.cardholderName,
      isDefault: method.isDefault,
      createdAt: method.createdAt,
    }));
  }

  async addPaymentMethod(userId: string, paymentMethodData: { paymentMethodId: string }): Promise<PaymentMethodResponseDto> {
    if (!this.stripe) {
      throw new BadRequestException({
        code: 'STRIPE_NOT_CONFIGURED',
        message: 'Stripe is not configured',
      });
    }

    // Retrieve payment method from Stripe
    const stripePaymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodData.paymentMethodId);

    if (!stripePaymentMethod || stripePaymentMethod.type !== 'card') {
      throw new BadRequestException({
        code: 'INVALID_PAYMENT_METHOD',
        message: 'Invalid payment method',
      });
    }

    // Attach to customer (create customer if needed)
    let customerId: string;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    // For now, we'll use a simple approach - in production you'd store Stripe customer IDs in a separate field
    // Create or retrieve Stripe customer
    const customers = await this.stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await this.stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;
    }

    await this.stripe.paymentMethods.attach(paymentMethodData.paymentMethodId, {
      customer: customerId,
    });

    // Save to database
    const card = stripePaymentMethod.card;
    const paymentMethod = await this.prisma.paymentMethod.create({
      data: {
        userId,
        stripeId: paymentMethodData.paymentMethodId,
        type: stripePaymentMethod.type,
        last4: card?.last4,
        expiryMonth: card?.exp_month,
        expiryYear: card?.exp_year,
        cardholderName: stripePaymentMethod.billing_details?.name,
        isDefault: false, // Set first one as default if none exist
      },
    });

    // Set as default if it's the first one
    const methodCount = await this.prisma.paymentMethod.count({ where: { userId } });
    if (methodCount === 1) {
      await this.prisma.paymentMethod.update({
        where: { id: paymentMethod.id },
        data: { isDefault: true },
      });
      paymentMethod.isDefault = true;
    }

    return {
      id: paymentMethod.id,
      type: paymentMethod.type,
      last4: paymentMethod.last4,
      expiryMonth: paymentMethod.expiryMonth,
      expiryYear: paymentMethod.expiryYear,
      cardholderName: paymentMethod.cardholderName,
      isDefault: paymentMethod.isDefault,
      createdAt: paymentMethod.createdAt,
    };
  }

  async removePaymentMethod(userId: string, paymentMethodId: string): Promise<{ message: string }> {
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId,
      },
    });

    if (!paymentMethod) {
      throw new NotFoundException({
        code: 'PAYMENT_METHOD_NOT_FOUND',
        message: 'Payment method not found',
      });
    }

    if (this.stripe) {
      try {
        await this.stripe.paymentMethods.detach(paymentMethod.stripeId);
      } catch (error) {
        // Log error but continue with database deletion
        console.error('Error detaching payment method from Stripe:', error);
      }
    }

    await this.prisma.paymentMethod.delete({
      where: { id: paymentMethodId },
    });

    return { message: 'Payment method removed' };
  }

  async getPendingPayments(userId: string): Promise<PendingPaymentResponseDto[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        userId,
        status: 'PENDING',
      },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map((payment) => ({
      id: payment.id,
      amount: Number(payment.amount),
      currency: payment.currency,
      description: payment.description || 'Payment',
      dueDate: payment.createdAt, // Use createdAt as due date for now
      status: payment.status,
      createdAt: payment.createdAt,
    }));
  }

  async getReceipts(userId: string): Promise<ReceiptResponseDto[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        userId,
        status: 'COMPLETED',
      },
      include: {
        receipt: true,
        paymentMethod: true,
      },
      orderBy: { completedAt: 'desc' },
    });

    return payments.map((payment) => ({
      id: payment.id,
      amount: Number(payment.amount),
      currency: payment.currency,
      description: payment.description || 'Payment',
      paymentDate: payment.completedAt || payment.createdAt,
      paymentMethod: payment.paymentMethod?.last4 ? `****${payment.paymentMethod.last4}` : undefined,
      transactionId: payment.receipt?.transactionId || payment.stripePaymentIntentId,
      createdAt: payment.createdAt,
    }));
  }

  async processPayment(
    userId: string,
    amount: number,
    currency: string,
    paymentMethodId?: string,
    description?: string,
  ): Promise<{ clientSecret: string; paymentId: string }> {
    if (!this.stripe) {
      throw new BadRequestException({
        code: 'STRIPE_NOT_CONFIGURED',
        message: 'Stripe is not configured',
      });
    }

    // Get or create default payment method
    let paymentMethod: any;
    if (paymentMethodId) {
      paymentMethod = await this.prisma.paymentMethod.findFirst({
        where: {
          id: paymentMethodId,
          userId,
        },
      });
    } else {
      paymentMethod = await this.prisma.paymentMethod.findFirst({
        where: {
          userId,
          isDefault: true,
        },
      });
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        paymentMethodId: paymentMethod?.id,
        amount,
        currency,
        description,
        status: 'PENDING',
      },
    });

    // Create Stripe PaymentIntent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      description,
      payment_method: paymentMethod?.stripeId,
      confirm: paymentMethod ? true : false,
      metadata: {
        paymentId: payment.id,
        userId,
      },
    });

    // Update payment with Stripe payment intent ID
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret || '',
      paymentId: payment.id,
    };
  }

  async createCheckoutSession(
    userId: string,
    items: Array<{ name: string; amount: number; quantity: number }>,
    metadata?: Record<string, string>,
    successUrl?: string,
    cancelUrl?: string,
  ): Promise<{ sessionId: string; clientSecret: string }> {
    if (!this.stripe) {
      throw new BadRequestException({
        code: 'STRIPE_NOT_CONFIGURED',
        message: 'Stripe is not configured',
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    // Get or create Stripe customer
    let customerId: string;
    const customers = await this.stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await this.stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;
    }

    // Create Checkout Session
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.amount * 100), // Convert to pence
        },
        quantity: item.quantity,
      })),
      success_url: successUrl || `${process.env.FRONTEND_URL || 'http://localhost:3001'}/store/orders?success=true`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:3001'}/store?canceled=true`,
      metadata: {
        userId,
        ...metadata,
      },
    });

    return {
      sessionId: session.id,
      clientSecret: session.client_secret || '',
    };
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Handle order payment
      if (session.metadata?.orderId) {
        const order = await this.prisma.order.findUnique({
          where: { id: session.metadata.orderId },
        });

        if (order) {
          await this.prisma.$transaction(async (tx) => {
            // Update order status
            await tx.order.update({
              where: { id: order.id },
              data: {
                status: 'COMPLETED',
              },
            });

            // Create payment record
            const payment = await tx.payment.create({
              data: {
                userId: order.userId,
                amount: order.totalAmount,
                currency: 'GBP',
                description: `Order #${order.id}`,
                status: 'COMPLETED',
                completedAt: new Date(),
                stripePaymentIntentId: session.payment_intent as string,
              },
            });

            // Create receipt
            await tx.receipt.create({
              data: {
                paymentId: payment.id,
                transactionId: session.payment_intent as string,
              },
            });
          });
        }
      } else if (session.metadata?.paymentId) {
        // Handle direct payment
        const payment = await this.prisma.payment.findUnique({
          where: { id: session.metadata.paymentId },
        });

        if (payment) {
          await this.prisma.$transaction(async (tx) => {
            await tx.payment.update({
              where: { id: payment.id },
              data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                stripePaymentIntentId: session.payment_intent as string,
              },
            });

            await tx.receipt.create({
              data: {
                paymentId: payment.id,
                transactionId: session.payment_intent as string,
              },
            });
          });
        }
      }
    } else if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const payment = await this.prisma.payment.findUnique({
        where: { stripePaymentIntentId: paymentIntent.id },
      });

      if (payment) {
        await this.prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: payment.id },
            data: {
              status: 'COMPLETED',
              completedAt: new Date(),
            },
          });

          await tx.receipt.create({
            data: {
              paymentId: payment.id,
              transactionId: paymentIntent.id,
            },
          });
        });
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const payment = await this.prisma.payment.findUnique({
        where: { stripePaymentIntentId: paymentIntent.id },
      });

      if (payment) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
          },
        });
      }
    }
  }
}

