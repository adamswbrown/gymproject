export class PaymentMethodResponseDto {
  id: string;
  type: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;
  isDefault: boolean;
  createdAt: Date;
}

export class PendingPaymentResponseDto {
  id: string;
  amount: number;
  currency: string;
  description: string;
  dueDate: Date;
  status: string;
  createdAt: Date;
}

export class ReceiptResponseDto {
  id: string;
  amount: number;
  currency: string;
  description: string;
  paymentDate: Date;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: Date;
}

