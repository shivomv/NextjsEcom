# Razorpay Integration Testing Guide

This document provides instructions on how to test the Razorpay payment gateway integration in your Next.js e-commerce application.

## Test Credentials

For testing purposes, Razorpay provides the following test credentials:

- **Test Key ID**: `rzp_test_1DP5mmOlF5G5ag`
- **Test Key Secret**: `thisShouldBeYourKeySecret`

These are already configured in your `.env.local` file.

## Test Cards

You can use the following test cards to simulate different payment scenarios:

### Successful Payment

- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3-digit number
- **Name**: Any name
- **3D Secure Password**: 1234

### Failed Payment

- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3-digit number
- **Name**: Any name
- **3D Secure Password**: Any password other than 1234

## Test UPI

For testing UPI payments:

- **UPI ID**: `success@razorpay`

This will simulate a successful UPI payment.

## Test Netbanking

For testing Netbanking:

1. Select any bank from the list
2. Click on "Pay Now"
3. On the test bank page, click on "Success"

## Testing Process

1. Create a new order with payment method set to "RazorPay"
2. Go to the order details page
3. Click on "Complete Online Payment"
4. In the Razorpay checkout form, select your preferred payment method
5. Complete the payment using the test credentials provided above
6. Verify that the order status is updated to "Paid" after successful payment

## Troubleshooting

If you encounter any issues during testing:

1. Check the browser console for error messages
2. Verify that the correct API keys are being used
3. Ensure that the Razorpay script is loading correctly
4. Check the server logs for any backend errors

## Additional Resources

- [Razorpay Test Mode Documentation](https://razorpay.com/docs/payments/payment-gateway/test-mode/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Razorpay Integration Guide](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)
