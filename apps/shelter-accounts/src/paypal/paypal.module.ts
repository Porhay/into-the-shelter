import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [DatabaseModule],
  providers: [PaypalService],
})
export class PaypalModule {}
