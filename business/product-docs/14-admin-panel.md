# 14 — Admin Panel

## Overview

The Admin Panel is a **management dashboard** accessible only to users with
`role: "admin"` in their JWT. It provides visibility and control over all users,
all rides, and system health. Regular riders are redirected away from `/admin`.

**Route:** `/admin`
**File:** `src/components/screens/AdminScreen.tsx`
**Guard:** `<AdminRoute>` component — redirects non-admins to `/`

---

## Access Control

```
AdminRoute wrapper
  ├── isAdmin true  → render AdminScreen
  └── isAdmin false → <Navigate to="/" replace />
```

`isAdmin` is derived from `AuthContext` → `user.role === "admin"`.

---

## Layout Structure

```
GlobalHeader ("Admin Dashboard")

Tab bar
  ├── Dashboard
  ├── Users
  ├── Rides
  └── System

Tab content
```

---

## Tabs

### Tab 1 — Dashboard

**Stats cards (6 metrics):**

| Metric | API source |
|---|---|
| Total users | `GET /api/admin/stats` |
| Total rides | `GET /api/admin/stats` |
| Active rides (ongoing) | `GET /api/admin/stats` |
| Completed rides | `GET /api/admin/stats` |
| Total connections | `GET /api/admin/stats` |
| New users this week | `GET /api/admin/stats` |

Each metric shown as a card with icon, number, and label.
Numbers are live-fetched on tab load (TanStack Query).

---

### Tab 2 — Users

Full list of all registered users with:

| Column | Description |
|---|---|
| Avatar + name | User identity |
| Email | Account email |
| Role | "user" or "admin" |
| Status | Active / Blocked |
| Joined date | Account creation date |
| Actions | Block / Unblock button |

**Search:** text input filters users by name or email in real time (client-side).

**Block / Unblock:**
- Block → `POST /api/admin/users/:id/block` → status changes to Blocked
- Unblock → `POST /api/admin/users/:id/unblock` → status changes to Active
- Button label toggles based on current status
- Confirmation dialog before blocking

**Data source:** `GET /api/admin/users`

---

### Tab 3 — Rides

Full list of all rides in the system:

| Column | Description |
|---|---|
| Ride title | Name of the ride |
| Organiser | Name of ride creator |
| Status | upcoming / active / completed / cancelled |
| Participants | Current count |
| Date | Scheduled date |
| Actions | Status update + Delete |

**Search:** text input filters by ride title or organiser name.

**Update ride status:**
- Dropdown to change status: upcoming → active → completed / cancelled
- `PUT /api/admin/rides/:id` with new status

**Delete ride:**
- `DELETE /api/admin/rides/:id`
- Confirmation dialog before delete
- Ride removed from list on success

**Data source:** `GET /api/admin/rides`

---

### Tab 4 — System

System health monitoring dashboard:

**Health check cards:**

| Check | Endpoint | What it shows |
|---|---|---|
| API health | `GET /api/health` | overall status (ok/degraded/down) |
| Database | `GET /api/health/db` | connection status + response time |
| Dependencies | `GET /api/health/dependencies` | list of external services + their status |
| Metrics | `GET /api/health/metrics` | memory usage, uptime, request count |

Each card shows:
- Status badge: green (healthy) / yellow (degraded) / red (down)
- Last checked timestamp
- Key metric value (e.g. DB response time in ms, memory used in MB)
- "Refresh" icon to re-fetch

**Health API (`src/services/api.ts → healthApi`):**
```typescript
healthApi.check()          // GET /api/health
healthApi.dbCheck()        // GET /api/health/db
healthApi.dependencies()   // GET /api/health/dependencies
healthApi.metrics()        // GET /api/health/metrics
```

---

## Full API Reference (Admin)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | All users list |
| POST | `/api/admin/users/:id/block` | Block a user |
| POST | `/api/admin/users/:id/unblock` | Unblock a user |
| GET | `/api/admin/rides` | All rides list |
| PUT | `/api/admin/rides/:id` | Update ride status |
| DELETE | `/api/admin/rides/:id` | Delete a ride |
| GET | `/api/health` | API health check |
| GET | `/api/health/db` | Database health check |
| GET | `/api/health/dependencies` | Dependencies health |
| GET | `/api/health/metrics` | System metrics |

---

## Feature Score

| Feature | Status |
|---|---|
| Admin-only route guard | Implemented |
| Dashboard stats (6 metrics) | Implemented |
| User list with search | Implemented |
| Block / Unblock users | Implemented (API wired) |
| Rides list with search | Implemented |
| Update ride status | Implemented (API wired) |
| Delete rides | Implemented (API wired) |
| System health monitoring | Implemented |
| DB health check | Implemented |
| Metrics display | Implemented |
| Admin invite / create admin | Not implemented |
| Audit log of admin actions | Not implemented |
| User detail drill-down | Not implemented |
| Bulk actions on rides | Not implemented |
| Export data (CSV) | Not implemented |
| Announcement broadcast to users | Not implemented |
| Role management beyond user/admin | Not implemented |
