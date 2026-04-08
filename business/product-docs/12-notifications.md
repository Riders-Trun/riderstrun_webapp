# 12 — Notifications Screen

## Overview

The Notifications Screen is the rider's **alert and update centre**. It surfaces
time-sensitive ride information — reminders, schedule changes, delays, new nearby
rides, and rider join alerts. Notifications are split into unread and read sections.

**Route:** `/notifications`
**File:** `src/components/screens/NotificationsScreen.tsx`
**Data:** `src/data/notifications.ts`
**Type:** `src/types/index.ts → Notification`

---

## Layout Structure

```
GlobalHeader ("Notifications")
"Mark all as read" button (top right, only if unread exist)

Section: Unread  (highlighted background)
  └── NotificationCard (per unread notification)

Section: Earlier / Read
  └── NotificationCard (per read notification)
```

---

## Notification Types

| Type | Icon | Colour | Trigger |
|---|---|---|---|
| `reminder` | Bell | Orange | Upcoming ride start reminder (e.g. 2 hours before) |
| `update` | Info circle | Blue | Ride location or schedule changed by organiser |
| `delay` | Clock | Yellow | Organiser has delayed the ride start time |
| `new_ride` | Map pin | Green | New ride posted near the user's city |
| `rider_joined` | User+ | Purple | A new rider has joined a ride you organised |

---

## Notification Card

Each card shows:
- Type icon (coloured circle)
- **Title** (e.g. "Ride Reminder")
- **Message** (e.g. "Nandi Hills Sunrise starts in 2 hours. Be at the meeting point by 5:45 AM.")
- **Timestamp** (relative: "2 hours ago", "Yesterday", or absolute date)
- Unread indicator dot (blue dot on left edge for unread)
- **Action button** (contextual, see below)

### Contextual Action Buttons

| Notification type | Button label | Action |
|---|---|---|
| `reminder` | View Ride | Navigate to `/ride/:id` |
| `update` | View Update | Navigate to `/ride/:id` |
| `delay` | Acknowledge | Marks delay as seen, removes button |
| `new_ride` | Join | Navigate to `/ride/:id` |
| `rider_joined` | View Ride | Navigate to `/ride/:id` |

---

## Actions

### Mark All as Read
- Button shown in header when ≥ 1 unread notification exists
- On tap → all notifications moved to "Earlier" section, unread dots removed
- Unread badge count on bottom nav bell icon resets to 0

### Individual Read on Tap
- Tapping any notification card marks it as read immediately
- Card moves from Unread to Earlier section visually

---

## Unread Badge (Bottom Nav)
- The bell icon in `MobileBottomNav` shows a red badge with the unread count
- Derived from the count of unread notifications in the data
- Defined in `src/data/notifications.ts`

---

## Data Model

```typescript
Notification {
  id: string
  type: "reminder" | "update" | "delay" | "new_ride" | "rider_joined"
  title: string
  message: string
  timestamp: string
  isRead: boolean
  rideId?: string          // linked ride for navigation
  actionLabel?: string     // override default button label
}
```

---

## Feature Score

| Feature | Status |
|---|---|
| Unread / read sections | Implemented |
| All 5 notification types | Implemented |
| Type-specific icons + colours | Implemented |
| Contextual action buttons | Implemented |
| Mark all as read | Implemented |
| Individual mark as read on tap | Implemented |
| Unread badge on bottom nav | Implemented |
| Relative timestamps | Implemented |
| Real-time push notifications | Not implemented |
| Notification preferences / settings | Not implemented |
| Smart grouping (same ride) | Not implemented |
| Mute specific ride notifications | Not implemented |
| Email digest fallback | Not implemented |
| In-app notification sound | Not implemented |
| Firebase / APNs integration | Not implemented |
