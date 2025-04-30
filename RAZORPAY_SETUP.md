# Razorpay Integration Setup

This document provides instructions on how to set up Razorpay payment gateway integration in your Next.js e-commerce application.

## Prerequisites

1. A Razorpay account (you can sign up at [Razorpay](https://razorpay.com/))
2. API keys from your Razorpay dashboard

## Setup Steps

### 1. Get Your API Keys

1. Log in to your Razorpay Dashboard
2. Go to Settings > API Keys
3. Generate a new pair of API keys (or use existing ones)
4. Copy the Key ID and Key Secret

### 2. Update Environment Variables

Add your Razorpay API keys to your `.env.local` file:

```
RAZORPAY_KEY_ID=rzp_test_your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
```

Replace `rzp_test_your_test_key_id` and `your_test_key_secret` with your actual API keys.

### 3. Test the Integration

1. Create a test order with the payment method set to "Razorpay"
2. Go to the order details page
3. Click on the "Pay with Razorpay" button
4. Complete the payment using Razorpay's test mode

For testing, you can use the following test card details:
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3-digit number
- Name: Any name
- 3D Secure Password: 1234

## Customization

You can customize the Razorpay integration by modifying the following files:

1. `src/config/razorpay.js` - Configure Razorpay settings
2. `src/components/payment/RazorpayButton.js` - Customize the payment button
3. `src/app/api/payment/razorpay/route.js` - Modify the order creation API
4. `src/app/api/payment/razorpay/verify/route.js` - Customize payment verification

## Production Deployment

Before deploying to production:

1. Replace test API keys with production API keys
2. Update the webhook URL in your Razorpay dashboard to point to your production server
3. Test the complete payment flow in production mode

## Troubleshooting

If you encounter any issues:

1. Check the browser console for errors
2. Verify that your API keys are correctly set in the environment variables
3. Ensure that your server can communicate with Razorpay's servers
4. Check the Razorpay dashboard for payment status and logs

## Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Razorpay Test Mode Guide](https://razorpay.com/docs/payments/payments/test-mode/)
