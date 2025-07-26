# Payment Management API Endpoints

This document outlines all the backend API endpoints required for the Stripe payment management system for advertisers.

## Base URL

All endpoints are prefixed with `/api` (e.g., `GET /api/advertiser/payment-setup/status`)

## Authentication

All endpoints require authentication. Include the user's JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Payment Setup Endpoints

### 1. GET /api/advertiser/payment-setup/status

**Description:** Check if payment setup is complete for the advertiser

**Request:**

- Headers: Authorization Bearer token
- Body: None
- Query params: None

**Response:**

```json
{
  "success": true,
  "data": {
    "hasStripeCustomer": true,
    "paymentMethodsCount": 2,
    "setupComplete": true,
    "stripeCustomerId": "cus_1234567890"
  },
  "message": "Payment setup status retrieved successfully"
}
```

**Data Types:**

- `hasStripeCustomer`: boolean - Whether user has a Stripe customer account
- `paymentMethodsCount`: number - Number of saved payment methods
- `setupComplete`: boolean - Whether payment setup is fully complete
- `stripeCustomerId`: string (optional) - Stripe customer ID if exists

---

### 2. POST /api/advertiser/payment-setup/complete

**Description:** Complete payment setup by creating Stripe customer

**Request:**

```json
{
  "companyName": "Acme Corp",
  "email": "billing@acme.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "stripe_customer_123",
    "customerId": "cus_1234567890",
    "userId": "user_123",
    "email": "billing@acme.com",
    "name": "Acme Corp",
    "defaultPaymentMethodId": null,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  },
  "message": "Payment setup completed successfully"
}
```

---

## Payment Methods Endpoints

### 3. GET /api/advertiser/payment-methods

**Description:** Get all saved payment methods for the advertiser

**Request:**

- Headers: Authorization Bearer token
- Body: None
- Query params: None

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "pm_1234567890",
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242",
        "expMonth": 12,
        "expYear": 2025,
        "funding": "credit"
      },
      "billingDetails": {
        "name": "John Doe",
        "email": "john@acme.com",
        "address": {
          "line1": "123 Main St",
          "line2": "Suite 100",
          "city": "San Francisco",
          "state": "CA",
          "postalCode": "94105",
          "country": "US"
        }
      },
      "isDefault": true,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "message": "Payment methods retrieved successfully"
}
```

---

### 4. POST /api/advertiser/payment-methods

**Description:** Add a new payment method

**Request:**

```json
{
  "paymentMethodId": "pm_1234567890",
  "setAsDefault": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment method added successfully"
}
```

---

### 5. DELETE /api/advertiser/payment-methods/{paymentMethodId}

**Description:** Remove a payment method

**Request:**

- Headers: Authorization Bearer token
- Path params: `paymentMethodId` (string)
- Body: None

**Response:**

```json
{
  "success": true,
  "message": "Payment method removed successfully"
}
```

---

### 6. PUT /api/advertiser/payment-methods/{paymentMethodId}/default

**Description:** Set a payment method as default

**Request:**

- Headers: Authorization Bearer token
- Path params: `paymentMethodId` (string)
- Body: `{}` (empty object)

**Response:**

```json
{
  "success": true,
  "message": "Default payment method updated successfully"
}
```

---

### 3A. POST /api/advertiser/payment-methods/setup-intent

**Description:** Create a setup intent for securely collecting payment methods (recommended approach)

**Request:**

- Headers: Authorization Bearer token
- Body: `{}` (empty object)

**Response:**

```json
{
  "success": true,
  "data": {
    "clientSecret": "seti_1234567890_secret_abc123",
    "setupIntentId": "seti_1234567890"
  },
  "message": "Setup intent created successfully"
}
```

**Usage Notes:**

- Use this endpoint to create a setup intent before showing the payment method form
- The `clientSecret` should be passed to Stripe's client-side libraries
- This enables 3D Secure authentication and other security features
- After the setup intent is confirmed, the payment method is automatically attached to the customer

---

## Wallet Management Endpoints

### 7. GET /api/advertiser/wallet/balance

**Description:** Get current wallet balance and statistics

**Request:**

- Headers: Authorization Bearer token
- Body: None
- Query params: None

**Response:**

```json
{
  "success": true,
  "data": {
    "currentBalance": 1500.0,
    "pendingCharges": 250.0,
    "totalDeposited": 2000.0,
    "totalSpent": 500.0,
    "availableForWithdrawal": 1250.0
  },
  "message": "Wallet balance retrieved successfully"
}
```

**Data Types:**

- All amounts are in dollars (USD) as decimal numbers
- `currentBalance`: Available balance in wallet
- `pendingCharges`: Amount tied up in pending transactions
- `totalDeposited`: Lifetime total deposited
- `totalSpent`: Lifetime total spent on campaigns
- `availableForWithdrawal`: Amount that can be withdrawn

---

### 8. POST /api/advertiser/wallet/add-funds

**Description:** Add funds to wallet using saved payment method

**Request:**

```json
{
  "amount": 10000,
  "paymentMethodId": "pm_1234567890",
  "description": "Add $100 to wallet"
}
```

**Notes:**

- `amount` is in cents (10000 = $100.00)
- `paymentMethodId` is optional if user has a default payment method

**Response:**

```json
{
  "success": true,
  "data": {
    "success": true,
    "paymentIntentId": "pi_1234567890",
    "clientSecret": "pi_1234567890_secret_abc123",
    "message": "Funds added successfully"
  },
  "message": "Add funds request processed successfully"
}
```

---

### 9. GET /api/advertiser/wallet/transactions

**Description:** Get wallet transaction history with pagination

**Request:**

- Headers: Authorization Bearer token
- Body: None
- Query params:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10, max: 100)
  - `type` (optional): Filter by transaction type (DEPOSIT, WITHDRAWAL, CAMPAIGN_FUNDING, REFUND)

**Example:** `GET /api/advertiser/wallet/transactions?limit=10&page=1&type=DEPOSIT`

**Response:**

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_1234567890",
        "type": "DEPOSIT",
        "amount": 100.0,
        "description": "Add $100 to wallet",
        "campaignId": null,
        "campaignTitle": null,
        "status": "COMPLETED",
        "createdAt": "2025-01-15T10:30:00Z",
        "paymentIntentId": "pi_1234567890"
      },
      {
        "id": "txn_0987654321",
        "type": "CAMPAIGN_FUNDING",
        "amount": -50.0,
        "description": "Campaign funding: Winter Sale Campaign",
        "campaignId": "camp_123",
        "campaignTitle": "Winter Sale Campaign",
        "status": "COMPLETED",
        "createdAt": "2025-01-14T15:20:00Z",
        "paymentIntentId": null
      }
    ],
    "total": 25,
    "page": 1,
    "totalPages": 3
  },
  "message": "Wallet transactions retrieved successfully"
}
```

**Transaction Types:**

- `DEPOSIT`: Money added to wallet
- `WITHDRAWAL`: Money withdrawn from wallet
- `CAMPAIGN_FUNDING`: Money spent on campaign funding
- `REFUND`: Money refunded to wallet

**Transaction Status:**

- `PENDING`: Transaction is being processed
- `COMPLETED`: Transaction completed successfully
- `FAILED`: Transaction failed

---

## Campaign Funding Endpoints

### 10. POST /api/advertiser/campaigns/{campaignId}/fund

**Description:** Fund a specific campaign

**Request:**

```json
{
  "amount": 50000,
  "source": "wallet",
  "paymentMethodId": "pm_1234567890"
}
```

**Notes:**

- `amount` is in cents (50000 = $500.00)
- `source`: "wallet" (use wallet balance) or "direct" (charge payment method)
- `paymentMethodId` required only if source is "direct"

**Response:**

```json
{
  "success": true,
  "data": {
    "paymentIntentId": "pi_1234567890",
    "clientSecret": "pi_1234567890_secret_abc123"
  },
  "message": "Campaign funded successfully"
}
```

---

### 11. GET /api/advertiser/campaigns/{campaignId}/funding-status

**Description:** Get funding status for a specific campaign

**Request:**

- Headers: Authorization Bearer token
- Path params: `campaignId` (string)
- Body: None

**Response:**

```json
{
  "success": true,
  "data": {
    "campaignId": "camp_123",
    "totalBudget": 1000.0,
    "spentAmount": 350.0,
    "remainingBudget": 650.0,
    "pendingPayments": 50.0,
    "lastPaymentDate": "2025-01-14T15:20:00Z",
    "paymentHistory": [
      {
        "id": "txn_0987654321",
        "type": "CAMPAIGN_FUNDING",
        "amount": -350.0,
        "description": "Campaign funding: Winter Sale Campaign",
        "campaignId": "camp_123",
        "campaignTitle": "Winter Sale Campaign",
        "status": "COMPLETED",
        "createdAt": "2025-01-14T15:20:00Z",
        "paymentIntentId": null
      }
    ]
  },
  "message": "Campaign funding status retrieved successfully"
}
```

---

### 12. PUT /api/advertiser/campaigns/{campaignId}/budget

**Description:** Adjust campaign budget

**Request:**

```json
{
  "newBudget": 150000
}
```

**Notes:**

- `newBudget` is in cents (150000 = $1500.00)

**Response:**

```json
{
  "success": true,
  "data": {
    "requiresAdditionalFunding": true,
    "additionalFundingAmount": 50000
  },
  "message": "Campaign budget updated successfully"
}
```

**Notes:**

- If `requiresAdditionalFunding` is true, the frontend should prompt to add funds
- `additionalFundingAmount` is in cents

---

## Error Responses

All endpoints should return consistent error responses:

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Invalid request parameters",
  "error": "Validation failed for field 'amount': must be greater than 0"
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Authentication required",
  "error": "Invalid or missing JWT token"
}
```

**403 Forbidden:**

```json
{
  "success": false,
  "message": "Access denied",
  "error": "User does not have permission to access this resource"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Resource not found",
  "error": "Campaign with ID 'camp_123' not found"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Stripe API error: Your card was declined"
}
```

---

## Additional Notes

### Currency Handling

- All monetary amounts in request bodies are in **cents** (integer)
- All monetary amounts in responses are in **dollars** (decimal)
- Currency is assumed to be USD unless specified

### Rate Limiting

Consider implementing rate limiting for payment endpoints:

- Payment method operations: 10 requests/minute
- Wallet operations: 20 requests/minute
- Transaction queries: 100 requests/minute

### Webhooks

Consider implementing Stripe webhooks to handle:

- Payment confirmations
- Failed payments
- Dispute notifications
- Refund processing

### Security

- Validate all input parameters
- Sanitize user inputs
- Log all payment operations for audit
- Use HTTPS for all endpoints
- Implement proper error handling without exposing sensitive data
