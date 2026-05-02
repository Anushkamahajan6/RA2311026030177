# Stage 1: API Design – Notification Service

## Overview

This document outlines the REST API design for the Notification Service. The goal is to create clean, scalable endpoints that handle all core notification operations for college students.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notifications` | Create a new notification |
| GET | `/notifications/:userId` | Get all notifications for a user |
| GET | `/notifications/:userId/unread` | Get only unread notifications |
| PUT | `/notifications/:id/read` | Mark a notification as read |
| PUT | `/notifications/:userId/read-all` | Mark all notifications as read |
| DELETE | `/notifications/:id` | Delete a specific notification |

---

## Request & Response Examples

### POST /notifications

**Request Body:**
```json
{
  "userId": "RA2311026030177",
  "message": "Your placement result for TCS is out!",
  "type": "placement"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "notif_001",
    "userId": "RA2311026030177",
    "message": "Your placement result for TCS is out!",
    "type": "placement",
    "isRead": false,
    "createdAt": "2026-05-02T06:30:00Z"
  }
}
```

---

### GET /notifications/:userId

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "notif_001",
      "message": "Your placement result for TCS is out!",
      "type": "placement",
      "isRead": false,
      "createdAt": "2026-05-02T06:30:00Z"
    },
    {
      "id": "notif_002",
      "message": "Semester 6 results have been declared.",
      "type": "result",
      "isRead": true,
      "createdAt": "2026-05-01T10:00:00Z"
    }
  ]
}
```

---

## Notification Types

- `placement` → Job/internship related alerts
- `result` → Exam/semester result announcements
- `event` → Campus events, workshops, fests

---

## Design Principles

- All routes follow RESTful conventions
- Responses are always wrapped in `{ success, data }` format
- Errors return appropriate HTTP status codes (400, 404, 500)
- Pagination supported via `?page=1&limit=10` query params
