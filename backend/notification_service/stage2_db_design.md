# Stage 2: Database Design – Notification Service

## Database Choice: MongoDB

MongoDB is the ideal database for a notification system because:

- **Schema Flexibility** – Different notification types (placement, result, event) can carry different metadata without altering the schema
- **Horizontal Scalability** – MongoDB scales out easily as user base grows
- **Fast Read/Write** – Notifications are write-heavy (many inserts) and read-heavy (many fetches), and MongoDB handles both efficiently
- **TTL Indexes** – Automatically expire old notifications after a set time

---

## Notification Schema

```js
const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true          // frequently queried field
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['placement', 'result', 'event'],
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 1           // 3 = high, 2 = medium, 1 = low
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});
```

---

## Priority Mapping

| Notification Type | Priority Score |
|-------------------|---------------|
| `placement`       | 3 (High)      |
| `result`          | 2 (Medium)    |
| `event`           | 1 (Low)       |

---

## Indexes

```js
// Compound index to speed up user-specific unread notification queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

// TTL index: auto-delete notifications older than 90 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });
```

---

## Why Not SQL?

| Factor | MongoDB | PostgreSQL |
|--------|---------|------------|
| Schema flexibility | ✅ Yes | ❌ No (fixed schema) |
| Horizontal scaling | ✅ Easy | ⚠️ Complex |
| Notification volume | ✅ Handles millions | ⚠️ Can slow down |
| TTL support | ✅ Built-in | ❌ Manual cleanup needed |

MongoDB clearly wins for a high-volume, schema-flexible system like notifications.
