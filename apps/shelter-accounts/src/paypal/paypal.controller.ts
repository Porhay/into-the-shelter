import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { createOrderRequest } from './dto/createOrder.request';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('orders')
  async createOrder(@Body() body: createOrderRequest, @Res() res: any) {
    try {
      // use the cart information passed from the front-end to calculate the order amount detals
      const { cart } = body;
      const { jsonResponse } = await this.paypalService.createOrder(cart);
      return jsonResponse;
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to create order.');
    }
  }

  @Post('orders/:orderId/capture')
  async captureOrder(@Param('orderId') orderId: string, @Res() res: any) {
    try {
      const { jsonResponse, httpStatusCode } =
        await this.paypalService.captureOrder(orderId);
      res.status(httpStatusCode).json(jsonResponse);
    } catch (e) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to capture order.');
    }
  }
}
