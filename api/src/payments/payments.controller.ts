import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, Res, Headers } from '@nestjs/common';
import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import { PaymentMethodResponseDto, PendingPaymentResponseDto, ReceiptResponseDto } from './dto/payment-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Controller('members/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MEMBER)
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {}

  @Get('methods')
  async getPaymentMethods(@CurrentUser() user: any): Promise<{ ok: true; data: PaymentMethodResponseDto[] }> {
    const methods = await this.paymentsService.getPaymentMethods(user.id);
    return { ok: true, data: methods };
  }

  @Post('methods')
  async addPaymentMethod(
    @CurrentUser() user: any,
    @Body() paymentMethodData: { paymentMethodId: string },
  ): Promise<{ ok: true; data: PaymentMethodResponseDto }> {
    const method = await this.paymentsService.addPaymentMethod(user.id, paymentMethodData);
    return { ok: true, data: method };
  }

  @Post('process')
  async processPayment(
    @CurrentUser() user: any,
    @Body() paymentData: { amount: number; currency?: string; paymentMethodId?: string; description?: string },
  ): Promise<{ ok: true; data: { clientSecret: string; paymentId: string } }> {
    const result = await this.paymentsService.processPayment(
      user.id,
      paymentData.amount,
      paymentData.currency || 'GBP',
      paymentData.paymentMethodId,
      paymentData.description,
    );
    return { ok: true, data: result };
  }

  @Post('checkout')
  async createCheckoutSession(
    @CurrentUser() user: any,
    @Body() checkoutData: {
      items: Array<{ name: string; amount: number; quantity: number }>;
      metadata?: Record<string, string>;
      successUrl?: string;
      cancelUrl?: string;
    },
  ): Promise<{ ok: true; data: { sessionId: string; clientSecret: string } }> {
    const result = await this.paymentsService.createCheckoutSession(
      user.id,
      checkoutData.items,
      checkoutData.metadata,
      checkoutData.successUrl,
      checkoutData.cancelUrl,
    );
    return { ok: true, data: result };
  }

  @Delete('methods/:id')
  async removePaymentMethod(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ): Promise<{ ok: true; data: { message: string } }> {
    const result = await this.paymentsService.removePaymentMethod(user.id, id);
    return { ok: true, data: result };
  }

  @Get('pending')
  async getPendingPayments(@CurrentUser() user: any): Promise<{ ok: true; data: PendingPaymentResponseDto[] }> {
    const payments = await this.paymentsService.getPendingPayments(user.id);
    return { ok: true, data: payments };
  }

  @Get('receipts')
  async getReceipts(@CurrentUser() user: any): Promise<{ ok: true; data: ReceiptResponseDto[] }> {
    const receipts = await this.paymentsService.getReceipts(user.id);
    return { ok: true, data: receipts };
  }

  @Public()
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
    @Res() res: Response,
  ): Promise<void> {
    const webhookSecret = this.configService.get<string>('stripe.webhookSecret');

    if (!webhookSecret) {
      res.status(400).send('Webhook secret not configured');
      return;
    }

    try {
      const stripe = new Stripe(this.configService.get<string>('stripe.secretKey') || '', {
        apiVersion: '2025-12-15.clover',
      });

      // Get raw body from request
      const rawBody = (req as any).rawBody || req.body;
      const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      await this.paymentsService.handleWebhook(event);
      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}

