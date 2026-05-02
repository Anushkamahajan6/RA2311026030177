# Stage 5: Building a Reliable Notification System

## Problem Statement

Email and push notifications can fail due to:
- Network timeouts
- Third-party provider outages (SendGrid, Firebase, etc.)
- Server crashes mid-send

Without a retry mechanism, users miss critical notifications (placement alerts, result announcements).

---

## Solution: Message Queue with Kafka / RabbitMQ

Instead of sending notifications synchronously (immediately), we push them to a queue and process asynchronously.

```
[ API Request ]
      |
[ Producer ] → Pushes to [ Message Queue (Kafka / RabbitMQ) ]
                                  |
                          [ Consumer Worker ]
                                  |
                    ┌─────────────┴──────────────┐
                    |                            |
             [ Email Service ]        [ Push Notification ]
               (SendGrid)                (Firebase FCM)
```

---

## Implementation with Bull Queue (Node.js)

**Producer – Add to queue when notification is created:**
```js
const Queue = require('bull');
const notificationQueue = new Queue('notifications', { redis: { port: 6379 } });

async function queueNotification(payload) {
  await notificationQueue.add(payload, {
    attempts: 3,           // retry up to 3 times on failure
    backoff: {
      type: 'exponential',
      delay: 2000          // wait 2s, 4s, 8s between retries
    },
    removeOnComplete: true
  });
  console.log('Notification queued:', payload.userId);
}
```

**Consumer – Process and send notifications:**
```js
notificationQueue.process(async (job) => {
  const { userId, message, type } = job.data;

  try {
    await sendEmail(userId, message);
    console.log(`Notification sent to ${userId}`);
  } catch (err) {
    console.error(`Failed attempt ${job.attemptsMade} for ${userId}`);
    throw err;  // triggers retry
  }
});
```

---

## Retry & Backoff Strategy

| Attempt | Wait Time | Action |
|---------|-----------|--------|
| 1st try | 0s | Send immediately |
| 2nd try | 2s | Retry after 2 seconds |
| 3rd try | 4s | Retry after 4 seconds |
| Failed | — | Move to Dead Letter Queue (DLQ) |

---

## Dead Letter Queue (DLQ)

If all retries fail, the message moves to a DLQ for manual inspection:

```js
notificationQueue.on('failed', async (job, err) => {
  console.error(`Job permanently failed for user ${job.data.userId}:`, err.message);
  await DeadLetterLog.create({ jobData: job.data, error: err.message });
});
```

---

## Benefits of This Approach

| Problem | Solution |
|---------|----------|
| Network failure | Automatic retry with backoff |
| Server crash | Job survives in queue (persistent) |
| High notification volume | Async processing prevents API blocking |
| Permanent failure tracking | Dead Letter Queue for audit |

---

## Summary

By decoupling notification **creation** from **delivery** using a message queue:
- The API responds instantly (non-blocking)
- Failed sends are retried automatically
- No notifications are lost even during server restarts
