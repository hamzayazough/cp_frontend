# Stripe Setup Intent Backend Implementation Guide

## The Issue

Your frontend is working correctly, but Stripe is returning a 400 error when trying to initialize the PaymentElement. This usually means the setup intent was created with incorrect parameters.

## Backend Setup Intent Requirements

Your backend endpoint should create the setup intent like this:

```javascript
// POST /api/advertiser/payment-methods/setup-intent
const setupIntent = await stripe.setupIntents.create({
  // REQUIRED: Specify payment method types
  payment_method_types: ["card"],

  // REQUIRED: Usage should be 'off_session' for storing payment methods
  usage: "off_session",

  // OPTIONAL: Attach to customer (recommended)
  customer: stripeCustomerId,

  // IMPORTANT: Make sure you're using the correct Stripe API version
  // The frontend expects the latest API version
});
```

## Common Issues and Solutions

### 1. API Version Mismatch

Make sure your backend Stripe SDK is up to date:

```bash
npm install stripe@latest
```

### 2. Missing payment_method_types

The setup intent MUST specify which payment methods are allowed:

```javascript
payment_method_types: ["card"]; // This is required
```

### 3. Wrong usage parameter

For saving payment methods for future use:

```javascript
usage: "off_session"; // Not 'on_session'
```

### 4. Key Mismatch

Verify that:

- Backend uses the SECRET key: `sk_test_...`
- Frontend uses the PUBLISHABLE key: `pk_test_...`
- Both keys are from the SAME Stripe account

## Debugging Steps

1. **Check your backend logs** for the exact setup intent creation parameters
2. **Verify API keys match** - both should be from the same Stripe account
3. **Update Stripe SDK** to the latest version
4. **Test with curl** to verify the endpoint works correctly

## Test Your Backend Endpoint

You can test if your backend is creating valid setup intents:

```bash
curl -X POST http://localhost:3000/api/advertiser/payment-methods/setup-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

The response should look exactly like what you're getting:

```json
{
  "success": true,
  "data": {
    "clientSecret": "seti_..._secret_...",
    "setupIntentId": "seti_..."
  }
}
```

## Next Steps

1. Check your backend setup intent creation code
2. Ensure you're using `payment_method_types: ['card']`
3. Ensure you're using `usage: 'off_session'`
4. Update your Stripe SDK if needed
5. Verify your API keys are from the same Stripe account
