# Stage 4: Scaling the Notification System

## Problem Statement

As the system grows to handle thousands of users and millions of notifications, the database alone cannot handle the load efficiently. We need a multi-layer strategy.

---

## Strategy 1: Redis Caching

Cache frequently accessed notifications so we don't hit the database every time.

```js
const redis = require('redis');
const client = redis.createClient();

async function getNotifications(userId) {
  const cacheKey = `notifications:${userId}`;

  // Check Redis cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    console.log('Cache hit');
    return JSON.parse(cached);
  }

  // Cache miss — fetch from MongoDB
  const data = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);

  // Store in cache for 5 minutes
  await client.setEx(cacheKey, 300, JSON.stringify(data));
  return data;
}
```

**Cache Invalidation:** Whenever a new notification is created or marked as read, clear the user's cache entry:
```js
await client.del(`notifications:${userId}`);
```

---

## Strategy 2: Pagination

Never return all notifications at once. Paginate responses to keep payloads small.

```js
// GET /notifications/:userId?page=2&limit=10
async function getNotificationsPaged(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return await Notification.find({ userId })
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limit);
}
```

---

## Strategy 3: Horizontal Scaling with Load Balancer

```
         [ Users ]
             |
     [ Load Balancer ]  ← Nginx / AWS ALB
      /       |       \
 [Node 1] [Node 2] [Node 3]
      \       |       /
     [ MongoDB Replica Set ]
             |
         [ Redis ]
```

- Multiple Node.js instances run behind a load balancer
- MongoDB Replica Set handles read scaling
- Redis is shared across all instances (single source of truth for cache)

---

## Strategy 4: Lazy Loading on Frontend

Instead of fetching all notifications on page load:

```js
// Load first 10 on open
// Load more when user scrolls to bottom
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    loadMoreNotifications();
  }
});
```

---

## Summary Table

| Strategy | Problem Solved | Tech Used |
|----------|---------------|-----------|
| Redis Cache | Repeated DB reads | Redis |
| Pagination | Large payload | MongoDB `.skip().limit()` |
| Horizontal Scaling | Traffic spikes | Nginx + Node clusters |
| Lazy Loading | UI performance | Vanilla JS scroll events |
