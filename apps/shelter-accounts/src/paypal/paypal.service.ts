import { Injectable } from '@nestjs/common';
import {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  sandboxUrl,
  products,
} from 'config';
import fetch from 'node-fetch';
import { createOrderRequest } from './dto/createOrder.request';
import { DatabaseService } from '@app/common';

// -> captureOrder responce
// {
//   id: '83676217WL0516327',
//   status: 'COMPLETED',
//   payment_source: { paypal: [Object] },
//   purchase_units: [[Object]],
//   payer: {
//     name: [Object],
//     email_address: 'sb-iy7ue4025252@personal.example.com',
//     payer_id: 'BWWJPKKQZVUGU',
//     address: [Object]
//   },
//   links: [[Object]]
// }

// -> createOrder responce
// {
//   id: '9HW79657281628214',
//   status: 'CREATED',
//   links: [
//     {
//       href: 'https://api.sandbox.paypal.com/v2/checkout/orders/9HW79657281628214',
//       rel: 'self',
//       method: 'GET'
//     },
//     {
//       href: 'https://www.sandbox.paypal.com/checkoutnow?token=9HW79657281628214',
//       rel: 'approve',
//       method: 'GET'
//     },
//     {
//       href: 'https://api.sandbox.paypal.com/v2/checkout/orders/9HW79657281628214',
//       rel: 'update',
//       method: 'PATCH'
//     },
//     {
//       href: 'https://api.sandbox.paypal.com/v2/checkout/orders/9HW79657281628214/capture',
//       rel: 'capture',
//       method: 'POST'
//     }
//   ]
// }

@Injectable()
export class PaypalService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
   * @see https://developer.paypal.com/api/rest/authentication/
   */
  private generateAccessToken = async () => {
    try {
      if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error('MISSING_API_CREDENTIALS');
      }
      const auth = Buffer.from(
        PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET,
      ).toString('base64');
      const response = await fetch(`${sandboxUrl}/v1/oauth2/token`, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Failed to generate Access Token:', error);
    }
  };

  private handleResponse = async (response: any) => {
    try {
      const jsonResponse = await response.json();
      return {
        jsonResponse,
        httpStatusCode: response.status,
      };
    } catch (err) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  };

  /**
   * Create an order to start the transaction.
   * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
   */
  createOrder = async (userId: string, body: createOrderRequest) => {
    // use the cart information passed from the front-end to calculate the purchase unit details
    console.log(
      'shopping cart information passed from the frontend createOrder() callback:',
      body.cart,
    );

    const curProductId = body.cart[0].productId;
    const calcPrice = products[curProductId].price || '0.00';

    const accessToken = await this.generateAccessToken();
    const url = `${sandboxUrl}/v2/checkout/orders`;
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: calcPrice,
          },
        },
      ],
    };

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const handledResponse = await this.handleResponse(response);

    const res = handledResponse.jsonResponse;
    await this.databaseService.createPayment({
      userId: userId,
      externalId: res.id,
      productId: curProductId,
      payment_system: 'paypal',
      data: JSON.stringify(res),
      status: res.status,
    });

    return handledResponse;
  };

  /**
   * Capture payment for the created order to complete the transaction.
   * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
   */
  captureOrder = async (userId: string, orderId: string) => {
    const accessToken = await this.generateAccessToken();
    const url = `${sandboxUrl}/v2/checkout/orders/${orderId}/capture`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
    });
    const handledResponse = await this.handleResponse(response);

    const res = handledResponse.jsonResponse;
    if (res.status === 'COMPLETED') {
      const payment = await this.databaseService.getPaymentByExternalId(res.id);
      const user = await this.databaseService.getUserByIdOrNull(payment.userId);

      // add coins for user balance
      await this.databaseService.updateUser(user.id, {
        coins: user.coins + products[payment.productId].coins,
      });

      // update payment status
      await this.databaseService.updatePayment(payment.id, {
        status: res.status,
      });
    }

    return handledResponse;
  };
}
