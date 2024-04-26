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

@Controller('users/:userId/paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('orders')
  async createOrder(
    @Body() body: createOrderRequest,
    @Res() res: any,
    @Param('userId') userId: string,
  ) {
    try {
      // use the cart information passed from the front-end to calculate the order amount detals
      const { jsonResponse } = await this.paypalService.createOrder(
        userId,
        body,
      );
      return res.status(HttpStatus.OK).json(jsonResponse);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to create order.');
    }
  }

  @Post('orders/:orderId/capture')
  async captureOrder(
    @Param('userId') userId: string,
    @Param('orderId') orderId: string,
    @Res() res: any,
  ) {
    try {
      const { jsonResponse, httpStatusCode } =
        await this.paypalService.captureOrder(userId, orderId);
      return res.status(httpStatusCode).json(jsonResponse);
    } catch (e) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to capture order.');
    }
  }
}
