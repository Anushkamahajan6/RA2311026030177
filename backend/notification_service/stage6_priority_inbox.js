/**
 * stage6_priority_inbox.js
 * ------------------------
 * Implements a Priority Inbox system for college notifications.
 *
 * Priority Levels:
 *   - placement → 3 (Highest)
 *   - result    → 2 (Medium)
 *   - event     → 1 (Lowest)
 *
 * Within the same priority, newer notifications appear first.
 */

// ─── Notification Data ────────────────────────────────────────────────────────

const PRIORITY_MAP = {
  placement: 3,
  result: 2,
  event: 1
};

const now = new Date();

const sampleNotifications = [
  {
    id: "notif_001",
    userId: "RA2311026030177",
    message: "Tech Fest 2026 registrations are open!",
    type: "event",
    isRead: false,
    createdAt: new Date(now - 5 * 60 * 60 * 1000)   // 5 hours ago
  },
  {
    id: "notif_002",
    userId: "RA2311026030177",
    message: "Your Semester 6 result has been declared.",
    type: "result",
    isRead: false,
    createdAt: new Date(now - 2 * 60 * 60 * 1000)   // 2 hours ago
  },
  {
    id: "notif_003",
    userId: "RA2311026030177",
    message: "Cognizant placement drive starts tomorrow at 9 AM.",
    type: "placement",
    isRead: false,
    createdAt: new Date(now - 1 * 60 * 60 * 1000)   // 1 hour ago
  },
  {
    id: "notif_004",
    userId: "RA2311026030177",
    message: "TCS NQT result is out - check your portal.",
    type: "placement",
    isRead: false,
    createdAt: new Date(now - 30 * 60 * 1000)        // 30 minutes ago
  },
  {
    id: "notif_005",
    userId: "RA2311026030177",
    message: "Annual Sports Day - participation open for all.",
    type: "event",
    isRead: true,
    createdAt: new Date(now - 24 * 60 * 60 * 1000)  // 1 day ago
  }
];


// ─── Core Functions ───────────────────────────────────────────────────────────

/**
 * Attach a numeric priority score to each notification based on its type.
 * @param {Array} notifications
 * @returns {Array}
 */
function addPriorityScore(notifications) {
  return notifications.map(notif => ({
    ...notif,
    priority: PRIORITY_MAP[notif.type] ?? 1
  }));
}

/**
 * Sort notifications by priority (high → low), then by time (newest → oldest).
 * Optionally filter to show only unread notifications.
 * @param {Array} notifications
 * @param {boolean} unreadOnly
 * @returns {Array}
 */
function getPriorityInbox(notifications, unreadOnly = false) {
  let filtered = unreadOnly
    ? notifications.filter(n => !n.isRead)
    : [...notifications];

  const scored = addPriorityScore(filtered);

  // Sort: primary = priority descending, secondary = createdAt descending
  scored.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return scored;
}

/**
 * Format a Date object into a readable string: "02 May 2026, 11:51 AM"
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

/**
 * Print notifications in a clean, readable format.
 * @param {Array} notifications
 */
function displayInbox(notifications) {
  const priorityLabels = { 3: "[HIGH]", 2: "[MEDIUM]", 1: "[LOW]" };
  const statusLabels = { true: "[Read]", false: "[Unread]" };

  console.log("\n" + "=".repeat(60));
  console.log("       PRIORITY INBOX  --  RA2311026030177");
  console.log("=".repeat(60));

  if (notifications.length === 0) {
    console.log("  No notifications to display.");
    console.log("=".repeat(60));
    return;
  }

  notifications.forEach((notif, index) => {
    const priorityLabel = priorityLabels[notif.priority] || "[NORMAL]";
    const status = statusLabels[notif.isRead];
    const timeStr = formatDate(new Date(notif.createdAt));

    console.log(`\n  [${index + 1}] ${priorityLabel}  |  ${notif.type.toUpperCase()}`);
    console.log(`       ${notif.message}`);
    console.log(`       ${status}  -  ${timeStr}`);
    console.log("  " + "-".repeat(56));
  });

  console.log("=".repeat(60));
  console.log(`  Total: ${notifications.length} notification(s) shown\n`);
}


// ─── Main ─────────────────────────────────────────────────────────────────────

console.log("\n>>> Showing ALL notifications (sorted by priority):");
const allSorted = getPriorityInbox(sampleNotifications, false);
displayInbox(allSorted);

console.log("\n>>> Showing UNREAD ONLY notifications:");
const unreadSorted = getPriorityInbox(sampleNotifications, true);
displayInbox(unreadSorted);
