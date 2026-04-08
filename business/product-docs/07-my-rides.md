# 07 — My Rides Screen

## Overview

My Rides is the rider's **personal ride dashboard**. It shows every ride the user is
associated with, split across three tabs: upcoming rides they have joined, past rides
they attended, and rides they organised themselves.

**Route:** `/my-rides`
**File:** `src/components/screens/MyRidesScreen.tsx`
**Hooks:** `useUpcomingRides()`, `usePastRides()`, `useOrganizedRides()` in `src/hooks/useRides.ts`

---

## Layout Structure

```
GlobalHeader ("My Rides")

Tab bar
  ├── Upcoming  (badge: count)
  ├── Past Rides
  └── Organised  (badge: count)

Ride card list (per tab)

Empty state (per tab, when list is empty)
```

---

## Tabs

### Tab 1 — Upcoming
Rides the user has joined but not yet completed.

**Card shows:**
- Ride title and ride type badge
- Date + time
- Start point → destination
- Participant count and organiser avatar
- **"HOST" badge** if the user is also the organiser of this ride
- Status chip (e.g. "Confirmed", "Full")

**Action buttons per card:**
| Button | Action |
|---|---|
| Leave | Remove user from participants (with confirmation dialog) |
| View | Navigate to `/ride/:id` for full details |

### Tab 2 — Past Rides
Rides the user attended that have already occurred.

**Card shows:**
- Same as Upcoming card layout
- Date shown as elapsed (e.g. "3 days ago")
- Completion badge or rating if rated

**Action buttons per card:**
| Button | Action |
|---|---|
| Details | Navigate to `/ride/:id` (read-only view) |

### Tab 3 — Organised
Rides the user created (their role was Organiser or Planner).

**Card shows:**
- Same card layout
- Participant count is more prominent (they're managing capacity)
- Edit icon available

**Action buttons per card:**
| Button | Action |
|---|---|
| Edit | Navigate to edit ride form (or opens inline editor) |
| Share | Opens share sheet with trip code + link |

---

## Empty States

Each tab has a specific empty state with an illustration and a CTA:

| Tab | Empty message | CTA |
|---|---|---|
| Upcoming | "No upcoming rides — explore rides near you" | → Home |
| Past Rides | "Your ride history will appear here" | → Home |
| Organised | "You haven't organised any rides yet" | → Plan Ride |

---

## Data Hooks

```typescript
// src/hooks/useRides.ts
useUpcomingRides()   // TanStack Query → GET /api/rides/upcoming (or mock)
usePastRides()       // TanStack Query → GET /api/rides/past (or mock)
useOrganizedRides()  // TanStack Query → GET /api/rides/organised (or mock)
```

Mock data is defined in `src/data/rides.ts`:
- `UPCOMING_RIDES` array
- `PAST_RIDES` array
- `ORGANIZED_RIDES` array

---

## Feature Score

| Feature | Status |
|---|---|
| Upcoming rides tab | Implemented |
| Past rides tab | Implemented |
| Organised rides tab | Implemented |
| Leave ride action | Implemented |
| View ride detail | Implemented |
| Edit organised ride | Implemented (navigates away) |
| Share trip code | Implemented (share sheet) |
| Empty states with CTA | Implemented |
| Host badge on upcoming | Implemented |
| Ride status chips | Implemented |
| Advanced filtering within tabs | Not implemented |
| Calendar/timeline view | Not implemented |
| Export ride history | Not implemented |
| Analytics (distance total, etc.) | Not implemented (lives in Profile instead) |
| Rate completed ride | Not implemented |
