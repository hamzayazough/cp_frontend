# Promoter Dashboard API Documentation

This document outlines the API endpoints that need to be implemented on the backend to support the Promoter Dashboard functionality.

## Base URL

All endpoints are relative to your API base URL (e.g., `http://localhost:3000/api` or `https://your-domain.com/api`)

## Wallet & Earnings Structure

The promoter wallet system handles two distinct earning types:

### View Earnings (Accumulated)

- **Accumulation**: Earnings from view-based campaigns accumulate in the wallet
- **Minimum Threshold**: $20 minimum required before withdrawal
- **Payout Schedule**: Monthly payouts at the end of each month
- **Status**: `currentBalance` (withdrawable) vs `pendingBalance` (under threshold)

### Direct Earnings (Immediate)

- **Payment Method**: Consultant and salesman earnings go directly to bank account
- **Timing**: Paid when campaign is completed
- **No Accumulation**: Bypasses the wallet system entirely

### Transaction Flow

1. **View Campaigns**: Earnings → Wallet → Monthly Payout → Bank
2. **Consultant/Salesman**: Earnings → Direct Bank Transfer

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <firebase_jwt_token>
```

## Endpoints

### 1. Get Complete Dashboard Data (Recommended)

**Endpoint:** `POST /promoter/dashboard`

**Description:** Optimized endpoint that returns all dashboard data in a single request to minimize API calls and ensure data consistency.

**Request Body:**

```json
{
  "includeStats": true,
  "includeCampaigns": true,
  "includeSuggestions": true,
  "includeTransactions": true,
  "includeMessages": true,
  "includeWallet": true,
  "activeCampaignLimit": 10,
  "suggestedCampaignLimit": 5,
  "transactionLimit": 5,
  "messageLimit": 5
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "stats": {
      "earningsThisWeek": 1250,
      "earningsLastWeek": 1100,
      "earningsPercentageChange": 13.6,
      "viewsToday": 375,
      "viewsYesterday": 350,
      "viewsPercentageChange": 7.1,
      "salesThisWeek": 12,
      "salesLastWeek": 8,
      "salesPercentageChange": 50.0,
      "activeCampaigns": 8,
      "pendingReviewCampaigns": 2
    },
    "activeCampaigns": [
      {
        "id": "1",
        "title": "KeepFit Health App",
        "type": "VISIBILITY",
        "status": "ONGOING",
        "views": 12700,
        "earnings": 635,
        "advertiser": "HealthTech Inc.",
        "deadline": "2025-07-15T00:00:00Z",
        "createdAt": "2025-06-01T00:00:00Z",
        "updatedAt": "2025-06-30T00:00:00Z"
      }
    ],
    "suggestedCampaigns": [
      {
        "id": "4",
        "title": "Finance Insights Blog",
        "type": "VISIBILITY",
        "cpv": 0.05,
        "budget": 5000,
        "advertiser": "FinanceHub",
        "tags": ["Finance", "Content"],
        "description": "Promote financial literacy content",
        "requirements": ["Finance background", "Active social media"],
        "estimatedEarnings": 250,
        "applicationDeadline": "2025-07-20T00:00:00Z"
      }
    ],
    "recentTransactions": [
      {
        "id": "txn_1",
        "amount": 15.5,
        "status": "COMPLETED",
        "date": "2025-06-30T00:00:00Z",
        "campaign": "KeepFit Health App",
        "campaignId": "1",
        "type": "VIEW_EARNING",
        "paymentMethod": "WALLET",
        "description": "Views generated: 310 at $0.05/view"
      },
      {
        "id": "txn_2",
        "amount": 500.0,
        "status": "PENDING",
        "date": "2025-06-29T00:00:00Z",
        "campaign": "Finance Consulting Project",
        "campaignId": "2",
        "type": "CAMPAIGN_FUNDING",
        "paymentMethod": "BANK_TRANSFER",
        "description": "Consultant project completion",
        "estimatedPaymentDate": "2025-07-03T00:00:00Z"
      },
      {
        "id": "txn_3",
        "amount": 45.5,
        "status": "COMPLETED",
        "date": "2025-06-30T23:59:59Z",
        "campaign": "Monthly Payout",
        "campaignId": null,
        "type": "MONTHLY_PAYOUT",
        "paymentMethod": "BANK_TRANSFER",
        "description": "End of month view earnings payout"
      }
    ],
    "recentMessages": [
      {
        "id": "msg_1",
        "name": "Tracy Brown",
        "message": "Looking forward to our meeting this Thursday!",
        "time": "2025-06-30T10:30:00Z",
        "avatar": "/api/placeholder/32/32",
        "isRead": false,
        "threadId": "thread_1",
        "senderType": "ADVERTISER",
        "campaignId": "1"
      }
    ],
    "wallet": {
      "viewEarnings": {
        "currentBalance": 45.5,
        "pendingBalance": 12.3,
        "totalEarned": 1250.0,
        "totalWithdrawn": 1200.0,
        "lastPayoutDate": "2025-06-30T00:00:00Z",
        "nextPayoutDate": "2025-07-31T00:00:00Z",
        "minimumThreshold": 20.0
      },
      "directEarnings": {
        "totalEarned": 2500.0,
        "totalPaid": 2200.0,
        "pendingPayments": 300.0,
        "lastPaymentDate": "2025-06-28T00:00:00Z"
      },
      "totalLifetimeEarnings": 3750.0,
      "totalAvailableBalance": 45.5
    }
  },
  "message": "Dashboard data retrieved successfully"
}
```

### 2. Individual Endpoints (Alternative)

#### Get Promoter Stats

**Endpoint:** `GET /promoter/stats`

**Response:**

```json
{
  "success": true,
  "data": {
    "earningsThisWeek": 1250,
    "earningsLastWeek": 1100,
    "earningsPercentageChange": 13.6,
    "viewsToday": 375,
    "viewsYesterday": 350,
    "viewsPercentageChange": 7.1,
    "salesThisWeek": 12,
    "salesLastWeek": 8,
    "salesPercentageChange": 50.0,
    "activeCampaigns": 8,
    "pendingReviewCampaigns": 2
  }
}
```

#### Get Active Campaigns

**Endpoint:** `GET /promoter/campaigns/active?limit=10`

**Response:**

```json
{
  "success": true,
  "data": {
    "activeCampaigns": [...],
    "totalActive": 8,
    "totalCompleted": 25,
    "totalPending": 2
  }
}
```

#### Get Suggested Campaigns

**Endpoint:** `GET /promoter/campaigns/suggested?limit=5`

**Response:**

```json
{
  "success": true,
  "data": {
    "campaigns": [...],
    "total": 15,
    "hasMore": true
  }
}
```

#### Get Recent Transactions

**Endpoint:** `GET /promoter/transactions?limit=5`

**Response:**

```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "total": 156,
    "hasMore": true
  }
}
```

#### Get Recent Messages

**Endpoint:** `GET /promoter/messages?limit=5`

**Response:**

```json
{
  "success": true,
  "data": {
    "messages": [...],
    "unreadCount": 3,
    "total": 47,
    "hasMore": true
  }
}
```

#### Get Wallet Information

**Endpoint:** `GET /promoter/wallet`

**Response:**

```json
{
  "success": true,
  "data": {
    "viewEarnings": {
      "currentBalance": 45.5,
      "pendingBalance": 12.3,
      "totalEarned": 1250.0,
      "totalWithdrawn": 1200.0,
      "lastPayoutDate": "2025-06-30T00:00:00Z",
      "nextPayoutDate": "2025-07-31T00:00:00Z",
      "minimumThreshold": 20.0
    },
    "directEarnings": {
      "totalEarned": 2500.0,
      "totalPaid": 2200.0,
      "pendingPayments": 300.0,
      "lastPaymentDate": "2025-06-28T00:00:00Z"
    },
    "totalLifetimeEarnings": 3750.0,
    "totalAvailableBalance": 45.5
  }
}
```

### 3. Action Endpoints

#### Request Payout

**Endpoint:** `POST /promoter/payout/request`

**Request Body:**

```json
{
  "amount": 1000 // Optional: specific amount, if not provided, request full balance
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payout request submitted successfully. Processing time: 3-5 business days."
}
```

#### Apply to Campaign

**Endpoint:** `POST /promoter/campaigns/{campaignId}/apply`

**Request Body:**

```json
{
  "message": "I'm interested in this campaign..." // Optional application message
}
```

**Response:**

```json
{
  "success": true,
  "message": "Application submitted successfully"
}
```

#### Get Campaign Details

**Endpoint:** `GET /promoter/campaigns/{campaignId}`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "KeepFit Health App"
    // ... full campaign details
  }
}
```

#### Mark Message as Read

**Endpoint:** `PATCH /promoter/messages/{messageId}/read`

**Request Body:**

```json
{}
```

**Response:**

```json
{
  "success": true,
  "message": "Message marked as read"
}
```

#### Get Unread Message Count

**Endpoint:** `GET /promoter/messages/unread-count`

**Response:**

```json
{
  "success": true,
  "data": {
    "count": 3
  }
}
```

## Data Types

### Campaign Types

- `VISIBILITY`: Pay per view campaigns
- `SALESMAN`: Commission-based sales campaigns
- `CONSULTANT`: Fixed fee consulting campaigns

### Campaign Status

- `ONGOING`: Currently active campaign
- `AWAITING_REVIEW`: Pending approval/review
- `COMPLETED`: Successfully completed
- `PAUSED`: Temporarily paused

### Transaction Status

- `COMPLETED`: Successfully processed
- `PENDING`: Awaiting processing
- `FAILED`: Processing failed
- `CANCELLED`: Transaction cancelled

### Transaction Types

- `VIEW_EARNING`: Individual view-based earnings (accumulated in wallet)
- `CAMPAIGN_FUNDING`: Fixed fee consultant payments (direct to bank)
- `SALESMAN_COMMISSION`: Commission from sales (direct to bank)
- `MONTHLY_PAYOUT`: End-of-month view earnings withdrawal
- `DIRECT_PAYMENT`: Direct bank transfers for consultant/seller work

### Payment Methods

- `WALLET`: For view earnings (accumulated until monthly payout)
- `BANK_TRANSFER`: For direct payments and monthly payouts

### Message Sender Types

- `ADVERTISER`: Message from campaign advertiser
- `ADMIN`: Message from platform admin
- `SYSTEM`: Automated system message

## Error Handling

All endpoints should return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

Error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional: detailed validation errors
}
```

## Performance Recommendations

1. **Use the combined dashboard endpoint** (`POST /promoter/dashboard`) for the main dashboard view to minimize API calls
2. **Implement proper caching** for frequently accessed data like stats and campaigns
3. **Use pagination** for large datasets (transactions, messages, campaigns)
4. **Add database indexing** on frequently queried fields (userId, campaignId, dates)
5. **Consider real-time updates** for critical data like earnings and messages using WebSockets or Server-Sent Events

## Security Considerations

1. **Validate all user inputs** to prevent injection attacks
2. **Implement rate limiting** to prevent abuse
3. **Use proper authorization** to ensure promoters can only access their own data
4. **Log all financial transactions** for audit purposes
5. **Encrypt sensitive data** in transit and at rest
