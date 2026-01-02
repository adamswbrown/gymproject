import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { PaymentsService } from '../payments/payments.service';
import { ProductResponseDto, OrderResponseDto } from './dto/product-response.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Public()
  @Get('products')
  async getProducts(): Promise<{ ok: true; data: ProductResponseDto[] }> {
    const products = await this.storeService.getActiveProducts();
    return { ok: true, data: products };
  }

  @Public()
  @Get('products/:id')
  async getProduct(@Param('id') id: string): Promise<{ ok: true; data: ProductResponseDto }> {
    const product = await this.storeService.getProductById(id);
    return { ok: true, data: product };
  }

  @Post('orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MEMBER)
  async createOrder(
    @CurrentUser() user: any,
    @Body() dto: CreateOrderDto,
  ): Promise<{ ok: true; data: OrderResponseDto }> {
    const order = await this.storeService.createOrder(user.id, dto);
    return { ok: true, data: order };
  }

  @Post('orders/:orderId/checkout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MEMBER)
  async createCheckoutForOrder(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
  ): Promise<{ ok: true; data: { sessionId: string; clientSecret: string } }> {
    const order = await this.storeService.getOrderById(user.id, orderId);

    if (order.status !== 'PENDING') {
      throw new Error('Order is not pending');
    }

    const checkoutItems = order.orderItems.map((item) => ({
      name: item.product.name,
      amount: item.price,
      quantity: item.quantity,
    }));

    const checkout = await this.paymentsService.createCheckoutSession(
      user.id,
      checkoutItems,
      { orderId: order.id },
    );

    return { ok: true, data: checkout };
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MEMBER)
  async getUserOrders(@CurrentUser() user: any): Promise<{ ok: true; data: OrderResponseDto[] }> {
    const orders = await this.storeService.getUserOrders(user.id);
    return { ok: true, data: orders };
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MEMBER)
  async getOrder(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ): Promise<{ ok: true; data: OrderResponseDto }> {
    const order = await this.storeService.getOrderById(user.id, id);
    return { ok: true, data: order };
  }
}

