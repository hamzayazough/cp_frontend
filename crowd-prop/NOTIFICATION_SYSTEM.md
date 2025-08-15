# Notification System Documentation

A comprehensive in-app notification system for CrowdProp with real-time updates, categorization, and user interaction tracking.

## 📁 File Structure

```
src/
├── app/
│   ├── interfaces/
│   │   └── notification-system.ts      # Core notification interfaces
│   ├── enums/
│   │   └── notification.ts             # Notification enums
│   ├── const/
│   │   └── notification-constants.ts   # Configuration and constants
│   └── dashboard/
│       └── notifications/
│           └── page.tsx                 # Main notifications page
├── components/
│   └── ui/
│       ├── NotificationBadge.tsx        # Badge for unread count
│       ├── NotificationItem.tsx         # Individual notification component
│       ├── NotificationList.tsx         # List of notifications
│       └── NotificationDropdown.tsx     # Dropdown for header
├── hooks/
│   └── useNotificationSystem.ts         # Custom hook for notifications
└── services/
    └── notification-system.service.ts   # API service layer
```

## 🔧 Core Components

### 1. NotificationBadge

Shows unread count with customizable styling.

```tsx
<NotificationBadge
  count={unreadCount}
  size="sm"
  variant="danger"
  maxCount={99}
/>
```

### 2. NotificationItem

Individual notification with actions and click handling.

```tsx
<NotificationItem
  notification={notification}
  onRead={handleMarkAsRead}
  onDismiss={handleDismiss}
  onClick={handleClick}
  compact={false}
/>
```

### 3. NotificationList

List container with filtering and sorting.

```tsx
<NotificationList
  notifications={notifications}
  loading={loading}
  onNotificationClick={handleClick}
  onMarkAsRead={handleMarkAsRead}
  onDismiss={handleDismiss}
/>
```

### 4. NotificationDropdown

Header dropdown with recent notifications.

```tsx
<NotificationDropdown
  isOpen={isOpen}
  onClose={handleClose}
  onViewAll={handleViewAll}
  maxItems={5}
/>
```

## 🎣 Custom Hook Usage

```tsx
import useNotifications from "@/hooks/useNotificationSystem";

function MyComponent() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    // ... other methods
  } = useNotifications();

  // Hook automatically polls for new notifications
  // and manages state updates
}
```

## 📡 Service Layer

```tsx
import { notificationSystemService } from "@/services/notification-system.service";

// Get notifications with filtering
const response = await notificationSystemService.getNotifications({
  page: 1,
  limit: 20,
  unread: true,
  notificationType: "PAYOUT_PROCESSED",
});

// Mark as read
await notificationSystemService.markAsRead(notificationId);

// Get unread count
const count = await notificationSystemService.getUnreadCount();
```

## 🎯 Notification Types

### Payment Related

- `PAYOUT_PROCESSED` - Earnings processed and transferred
- `PAYMENT_REMINDER` - Payment action required

### Campaign Related

- `CAMPAIGN_APPROVED` - Campaign approved and live
- `CAMPAIGN_REJECTED` - Campaign needs attention
- `APPLICATION_APPROVED` - Campaign application accepted
- `APPLICATION_REJECTED` - Application not accepted
- `EARNINGS_UPDATE` - Earnings updated
- `CAMPAIGN_DEADLINE` - Deadline approaching

### Communication

- `MESSAGE_RECEIVED` - New message received

### System & Account

- `SYSTEM_ANNOUNCEMENT` - Platform announcements
- `PROFILE_UPDATE_REQUIRED` - Profile needs updates
- `SECURITY_ALERT` - Security notifications

## 🎨 Configuration

### Type Configuration

Each notification type has configurable properties:

```tsx
{
  type: "PAYOUT_PROCESSED",
  label: "Payment Processed",
  description: "Your earnings have been processed",
  icon: "💰",
  color: "text-green-600",
  priority: "high",
  showInDropdown: true,
  autoMarkAsRead: false
}
```

### Routing

Notifications automatically route to relevant pages:

```tsx
const route = getNotificationRoute(notification);
router.push(route); // Navigates to appropriate dashboard section
```

## 🚀 Features

### ✅ Core Features

- ✅ Real-time notification polling
- ✅ Read/unread tracking
- ✅ Click tracking
- ✅ Dismiss functionality
- ✅ Category filtering
- ✅ Type filtering
- ✅ Priority sorting
- ✅ Pagination
- ✅ Bulk mark as read
- ✅ Delete dismissed notifications
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling

### 🔄 Automatic Behaviors

- **Auto-polling**: Fetches new notifications every 30 seconds
- **Auto-read**: Some notification types auto-mark as read on click
- **Smart routing**: Clicks navigate to relevant dashboard sections
- **Priority sorting**: High-priority notifications appear first
- **Dropdown filtering**: Only relevant types show in dropdown

### 📱 Responsive Design

- Mobile-optimized layouts
- Touch-friendly interactions
- Responsive breakpoints
- Compact mode for small screens

## 🔌 Integration

### Dashboard Header

```tsx
import NotificationBadge from "@/components/ui/NotificationBadge";
import NotificationDropdown from "@/components/ui/NotificationDropdown";

// In your dashboard header
<div className="relative">
  <button onClick={() => setNotificationsOpen(!notificationsOpen)}>
    <BellIcon className="h-6 w-6" />
    {unreadCount > 0 && (
      <NotificationBadge count={unreadCount} size="sm" variant="danger" />
    )}
  </button>

  <NotificationDropdown
    isOpen={notificationsOpen}
    onClose={() => setNotificationsOpen(false)}
    onViewAll={() => router.push("/dashboard/notifications")}
  />
</div>;
```

### Navigation

Add to your router configuration:

```tsx
dashboardNotifications: "/dashboard/notifications";
```

## 🎛️ Customization

### Styling

All components use Tailwind CSS with customizable classes:

```tsx
// Custom badge styling
<NotificationBadge
  count={count}
  className="custom-badge-class"
/>

// Custom notification item
<NotificationItem
  notification={notification}
  className="custom-item-class"
  compact={true}
/>
```

### Filtering

Add custom filters:

```tsx
const customFilters = {
  page: 1,
  limit: 10,
  unread: true,
  notificationType: "CAMPAIGN_APPROVED",
  campaignId: "specific-campaign-id",
};

fetchNotifications(customFilters);
```

## 🐛 Error Handling

The system includes comprehensive error handling:

```tsx
const { error, clearError } = useNotifications();

// Display errors
{
  error && (
    <div className="error-banner">
      {error}
      <button onClick={clearError}>×</button>
    </div>
  );
}
```

## 🔄 Real-time Updates

Notifications automatically poll for updates and merge new notifications:

```tsx
// Automatic polling (every 30 seconds)
useEffect(() => {
  startPolling();
  return () => stopPolling();
}, []);

// Manual refresh
const handleRefresh = () => {
  fetchNotifications(filters);
};
```

## 📊 Performance

### Optimization Features

- **Pagination**: Large lists are paginated
- **Lazy loading**: Components load on demand
- **Debounced polling**: Prevents excessive API calls
- **Optimistic updates**: UI updates immediately
- **Memoized components**: Prevent unnecessary re-renders

### Best Practices

- Use `compact` mode for dropdowns
- Implement virtual scrolling for very large lists
- Cache notification data appropriately
- Monitor polling frequency based on user activity

## 🔒 Security

### Authentication

All API calls require Firebase authentication:

```tsx
// Automatic token handling in service
const response = await httpService.get(endpoint, true); // requiresAuth: true
```

### Data Validation

- Type-safe interfaces throughout
- Runtime validation for API responses
- Error boundaries for component failures

## 📈 Analytics Integration

Track notification interactions:

```tsx
// Track clicks
const handleNotificationClick = async (notification) => {
  await markAsClicked(notification.id);
  // Add analytics tracking here
  analytics.track("notification_clicked", {
    type: notification.notificationType,
    id: notification.id,
  });
};
```

## 🧪 Testing

### Unit Tests

```bash
# Test notification components
npm test -- --testPathPattern=notification

# Test notification service
npm test -- --testPathPattern=notification-system.service
```

### Integration Tests

```bash
# Test full notification flow
npm test -- --testPathPattern=notification.integration
```

## 🚀 Deployment

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.crowdprop.com
```

### Build Optimization

The notification system is fully tree-shakeable and optimized for production builds.

---

## 🤝 Contributing

When adding new notification types:

1. Add to `NotificationSystemType` in interfaces
2. Add to `NotificationTypes` enum
3. Configure in `NOTIFICATION_TYPE_CONFIGS`
4. Add routing in `NOTIFICATION_ROUTES`
5. Update category mappings
6. Add tests for new functionality

---

This notification system provides a complete, production-ready solution for in-app notifications with excellent user experience and developer experience.
