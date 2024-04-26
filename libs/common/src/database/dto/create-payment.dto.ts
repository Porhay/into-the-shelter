export class CreatePaymentDto {
  userId: string;
  externalId: string;
  productId: string;
  payment_system: string;
  data: string;
  status: string;
}
