# Notification System Design

## Stage 1: API Design

We design RESTful APIs to manage notifications efficiently.

* **POST /notifications** → Create a new notification
* **GET /notifications/:userId** → Fetch all notifications of a user
* **PUT /notifications/:id/read** → Mark a notification as read
* **DELETE /notifications/:id** → Delete a notification

These APIs ensure proper CRUD operations and scalability.

---

## Stage 2: Database Design

I would use **MongoDB** for this system because it handles large-scale data and flexible schemas efficiently.

### Notification Schema:

* id (unique identifier)
* userId (to identify user)
* message (notification content)
* type (placement, result, event)
* isRead (boolean)
* createdAt (timestamp)

MongoDB is preferred due to its horizontal scalability and fast read/write operations.

---

## Stage 3: Query Optimization

Problem: Fetching unread notifications is slow.

### Solution:

* Create indexes on frequently queried fields

Example:
CREATE INDEX idx_notifications ON notifications(userId, isRead, createdAt DESC);

This improves query performance significantly.

---

## Stage 4: Reducing Database Load

To improve performance:

* Use **Redis caching** for frequently accessed notifications
* Implement **pagination** to limit results
* Use **lazy loading** for large datasets

This reduces unnecessary database calls.

---

## Stage 5: Handling Email Failures

Sending notifications via email can fail midway.

### Solution:

* Use a **message queue system** like Kafka or RabbitMQ
* Process notifications asynchronously
* Implement retry mechanism

This ensures reliability and fault tolerance.

---

## Stage 6: Priority Notifications

To show important notifications first:

### Priority System:

* Placement → High priority
* Results → Medium priority
* Events → Low priority

Sort notifications based on:
(priority score + timestamp)

This ensures important updates are always visible first.

---


## Bonus: Sample Implementation Idea

Example of creating a notification:

```js
function createNotification(userId, message, type) {
  return {
    id: generateUniqueId(),
    userId,
    message,
    type,
    isRead: false,
    createdAt: new Date()
  };
}
Example of prioritizing notifications:

```js
function sortNotifications(notifications) {
  return notifications.sort((a, b) => {
    return b.priority - a.priority || b.createdAt - a.createdAt;
  });
}
```

This demonstrates how the system can be implemented in practice.
```


