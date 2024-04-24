import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Module({
  providers: [PaypalService],
})
export class PaypalModule {}
