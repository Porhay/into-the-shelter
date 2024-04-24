import { Injectable } from '@nestjs/common';
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, sandboxUrl } from 'config';
import fetch from 'node-fetch';

@Injectable()
export class PaypalService {
  constructor() {}

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
  createOrder = async (cart) => {
    // use the cart information passed from the front-end to calculate the purchase unit details
    console.log(
      'shopping cart information passed from the frontend createOrder() callback:',
      cart,
    );

    const accessToken = await this.generateAccessToken();
    const url = `${sandboxUrl}/v2/checkout/orders`;
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '10.00',
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

    return this.handleResponse(response);
  };

  /**
   * Capture payment for the created order to complete the transaction.
   * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
   */
  captureOrder = async (orderID) => {
    const accessToken = await this.generateAccessToken();
    const url = `${sandboxUrl}/v2/checkout/orders/${orderID}/capture`;

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

    return this.handleResponse(response);
  };
}
