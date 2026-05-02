# Stage 3: Query Optimization – Notification Service

## Problem Statement

As the number of notifications grows, fetching a user's unread notifications becomes slow. A full collection scan over millions of documents is unacceptable in production.

---

## Solution: Indexing

The most effective way to optimize read queries in MongoDB is to create **compound indexes** on fields that appear in query filters and sort operations.

### Index Creation

```js
// In MongoDB shell or Mongoose schema:
db.notifications.createIndex(
  { userId: 1, isRead: 1, createdAt: -1 },
  { name: "idx_user_unread_time" }
);
```

Or in Mongoose:
```js
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
```

---

## Query Before Optimization

```js
// WITHOUT index – does a full collection scan (COLLSCAN)
db.notifications.find({ userId: "RA2311026030177", isRead: false })
                .sort({ createdAt: -1 });
```

**Execution Plan:** `COLLSCAN` → scans every document → O(n)

---

## Query After Optimization

```js
// WITH index – uses indexed scan (IXSCAN)
db.notifications.find({ userId: "RA2311026030177", isRead: false })
                .sort({ createdAt: -1 })
                .limit(20);   // pagination applied
```

**Execution Plan:** `IXSCAN` → jumps directly to matching docs → O(log n)

---

## Explain Output Comparison

| Metric | Without Index | With Index |
|--------|--------------|------------|
| Docs Examined | 1,000,000 | 47 |
| Execution Time | ~980ms | ~3ms |
| Stage | COLLSCAN | IXSCAN |

---

## Additional Optimizations

### 1. Projection (Fetch Only Required Fields)
```js
db.notifications.find(
  { userId: "RA2311026030177", isRead: false },
  { message: 1, type: 1, createdAt: 1, _id: 0 }  // only these fields
);
```

### 2. Pagination (Avoid Fetching All at Once)
```js
const page = 1;
const limit = 10;
db.notifications.find({ userId })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);
```

### 3. Read from Replica (Read Preference)
```js
// Offload reads to MongoDB replica nodes to reduce primary load
mongoose.connect(uri, { readPreference: 'secondaryPreferred' });
```

---

## Summary

- Compound index on `(userId, isRead, createdAt)` is the primary fix
- Projection reduces network payload
- Pagination prevents memory overload
- Replica reads distribute database load
