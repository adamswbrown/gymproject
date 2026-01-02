export class ProductResponseDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderResponseDto {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItemResponseDto[];
}

export class OrderItemResponseDto {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: ProductResponseDto;
}

