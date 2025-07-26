# Payment System Development Setup Guide

This guide will help you set up the payment system for development and resolve Stripe-related errors.

## Quick Fix for Current Error

The "Stripe Payment Element error" occurs because Stripe is not properly configured. Here's how to fix it:

### 1. Get Stripe Test Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Create a free account if you don't have one
3. Copy your **Publishable key** (starts with `pk_test_`)

### 2. Configure Environment Variables

1. Update your `.env.local` file:

```bash
# Replace with your actual Stripe test key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_key_here

# Backend API URL (update if different)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

2. Restart your development server:

```bash
npm run dev
```

### 3. Development Mode (No Stripe Required)

If you want to develop without Stripe, the system includes a development mode:

- Keep the demo key: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_demo_key`
- The payment forms will work in demo mode
- All payment operations will be simulated

## Backend Requirements

### Required API Endpoints

The frontend expects these backend endpoints to be implemented:

#### Payment Setup

- `GET /api/advertiser/payment-setup/status` - Get payment setup status
- `POST /api/advertiser/payment-setup/complete` - Complete initial setup

#### Payment Methods

- `GET /api/advertiser/payment-methods` - List payment methods
- `POST /api/advertiser/payment-methods/setup-intent` - Create Stripe Setup Intent
- `DELETE /api/advertiser/payment-methods/{id}` - Remove payment method
- `PUT /api/advertiser/payment-methods/{id}/default` - Set default payment method

#### Wallet Management

- `GET /api/advertiser/wallet/balance` - Get wallet balance
- `POST /api/advertiser/wallet/add-funds` - Add funds to wallet
- `GET /api/advertiser/wallet/transactions` - Get transaction history

### Sample Backend Response Formats

#### Payment Status Response

```json
{
  "setupComplete": false,
  "hasStripeCustomer": false,
  "paymentMethodsCount": 0,
  "defaultPaymentMethodId": null
}
```

#### Setup Intent Response

```json
{
  "clientSecret": "seti_1234567890_secret_xyz"
}
```

#### Wallet Balance Response

```json
{
  "balance": 1500.0,
  "currency": "USD",
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

## Development Workflow

### 1. Without Backend (Frontend Only)

- Use demo Stripe key or development mode
- All API calls will be simulated
- Payment forms work but don't process real payments

### 2. With Backend but No Stripe

- Implement API endpoints that return mock data
- Frontend will work with your mock responses
- No need for actual Stripe integration initially

### 3. Full Integration

- Set up Stripe account and get real test keys
- Implement backend with actual Stripe API calls
- Test with Stripe test payment methods

## Testing Payment Methods

When Stripe is properly configured, you can use these test cards:

- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Insufficient Funds**: 4000 0000 0000 9995

Any future expiry date and any 3-digit CVC will work.

## Common Issues and Solutions

### Issue: "Stripe Payment Element error"

**Cause**: Invalid or missing Stripe publishable key
**Solution**: Set a valid Stripe test key in `.env.local`

### Issue: "Setup intent endpoint not implemented"

**Cause**: Backend endpoint missing
**Solution**: The frontend falls back to development mode automatically

### Issue: Payment methods not loading

**Cause**: Backend API endpoints not implemented
**Solution**: Check browser console for 404 errors and implement missing endpoints

### Issue: Environment variables not loading

**Cause**: Server not restarted after changing `.env.local`
**Solution**: Restart the development server

## File Structure

```
src/
├── components/payment/
│   ├── PaymentStatusCard.tsx          # Shows payment setup status
│   ├── PaymentMethodsCard.tsx         # Manages payment methods
│   ├── AddFundsModal.tsx              # Wallet funding interface
│   ├── AddPaymentMethodModal.tsx      # Stripe payment collection
│   ├── DevelopmentPaymentForm.tsx     # Fallback for no Stripe
│   └── SimpleAddPaymentMethodModal.tsx # Fallback modal
├── hooks/
│   └── usePaymentManagement.ts        # Payment state management
├── services/
│   └── advertiser-payment.service.ts  # API calls
└── app/const/
    └── payment-constants.ts           # Configuration constants
```

## Next Steps

1. **Immediate**: Set up Stripe test keys to resolve the current error
2. **Short term**: Implement backend API endpoints
3. **Long term**: Add real Stripe webhook handling and production setup

For more details, see `PAYMENT_API_ENDPOINTS.md` for complete API documentation.
