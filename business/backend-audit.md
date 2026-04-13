# Backend Audit — Gaps, Mismatches & Bugs

> **Audited:** April 2026
> **Backend:** `/ridersturn_backend` (Next.js App Router, PostgreSQL, JWT)
> **Frontend contract:** `src/services/api.ts` + `AdminScreen.tsx`

---

## Quick Summary

| Severity | Count | Short description |
|---|---|---|
| 🔴 Critical | 5 | Endpoints broken / completely missing |
| 🟡 High | 5 | Core features silently non-functional |
| 🟠 Medium | 6 | Security / correctness flaws |
| ⚪ Low | 4 | Quality / nice-to-have |

---

## 🔴 CRITICAL — Blocking Features Right Now

### C1 — Social "Connect" always fails
**File:** `api.ts` vs `social/connections/route.ts`

Frontend sends:
```json
{ "targetUserId": 42, "action": "connect" }
```
Backend Zod schema expects:
```json
{ "targetUsername": "john_doe", "action": "connect" }
```
Schema validation rejects every request. The entire Connect/Invite flow in the Explore screen is **dead**.

**Fix:** Change backend schema to accept `targetUserId: number`, look up the user by ID internally.

---

### C2 — Social Mutuals endpoint uses wrong param type
**File:** `api.ts:204` vs `social/mutuals/[username]/route.ts`

Frontend calls: `GET /api/social/mutuals/42` (numeric userId)
Backend route expects a **username string** and does `WHERE username = $1`.

Querying `WHERE username = '42'` will return nothing for almost every user.

**Fix:** Add a `GET /api/social/mutuals/[userId]` variant that accepts numeric ID.

---

### C3 — Admin Metrics 404 every time
**File:** `api.ts:219`

Frontend calls: `GET /api/metrics`
Backend route is at: `GET /api/admin/metrics`

The health tab in the Admin panel will show a permanent error.

**Fix:** Either move the backend route to `/api/metrics` or update the frontend call to `/api/admin/metrics`.

---

### C4 — Admin cannot cancel or delete rides (endpoints don't exist)
**File:** `AdminScreen.tsx:38-41`

Frontend calls:
- `PUT /api/admin/rides/:id` — update ride status (e.g. cancel)
- `DELETE /api/admin/rides/:id` — delete a ride

Neither route file exists in the backend. The Admin "Rides" tab UI will throw errors on every action.

**Fix:** Create `app/api/admin/rides/[id]/route.ts` with PUT and DELETE handlers.

---

### C5 — Signup response missing `role` field
**File:** `auth/signup/route.ts`

Backend returns: `{ id, email, created_at }`
Frontend destructures: `{ id, email, role }` and stores in AuthContext.

`user.role` will be `undefined` after signup. `isAdmin` check breaks. Admin users who sign up fresh cannot access `/admin` without logging out and back in.

**Fix:** Add `role` to the signup response: `{ id, email, role, created_at }`.

---

## 🟡 HIGH — Features Silently Broken

### H1 — Trip code is accepted but never verified
**File:** `ride.service.ts` (join logic)

The join endpoint accepts a `trip_code` parameter and passes it to the service, but the service **never validates it against the hashed value** in the database. Any string (even an empty one) lets someone join a private/invite-only ride.

The `timingSafeEqual` import exists in the file but is not used.

**Fix:**
```typescript
if (ride.visibility === 'invite_only') {
  if (!tripCode) throw new ServiceError('Trip code required', 400, 'MISSING_CODE');
  const hash = createHash('sha256').update(String(tripCode)).digest('hex');
  if (!timingSafeEqual(Buffer.from(hash), Buffer.from(ride.trip_code))) {
    throw new ServiceError('Invalid trip code', 403, 'INVALID_CODE');
  }
}
```

---

### H2 — Forgot password does nothing (email never sent)
**File:** `auth/forgot-password/route.ts:18-19`

```typescript
// TODO: if token !== null, send email with reset link containing the token
// e.g. emailService.sendResetEmail(result.data.email, token)
```

A reset token is generated and stored in the DB, but the email is never sent. Users will enter their email, get a success toast, and never receive a link. The reset-password flow is completely non-functional from the user's perspective.

**Fix:** Integrate an email service (Resend, SendGrid, Nodemailer) and wire it here.

---

### H3 — Admin Users tab crashes on load
**File:** `AdminScreen.tsx:261` vs `admin/users/route.ts:32-34`

Backend returns:
```json
{ "users": [...], "meta": { "total": 50, "limit": 20, "offset": 0 } }
```

Frontend does:
```typescript
setUsers(usersRes?.data)      // tries to use { users:[...], meta:{...} } as an array
users.map(u => ...)           // .map on an object → runtime crash
```

**Fix:** Frontend should use `usersRes?.data?.users`. Or backend should flatten the response to just the array (moving pagination meta to headers).

---

### H4 — Admin Stats numbers may be wrong
**File:** `AdminScreen.tsx:181` vs `admin/stats/route.ts:30`

Backend wraps stats: `{ stats: { totalUsers, totalRides, ... } }`
Frontend accesses: `statsRes?.data.totalUsers`

If `apiSuccess` wraps under a `data` key: response is `{ data: { stats: { totalUsers } } }`.
Frontend gets `undefined` for every metric — dashboard shows all zeros.

**Fix:** Confirm the exact `apiSuccess` wrapper shape and update either the backend to flatten `stats` to the top level of `data`, or the frontend to access `data.stats.totalUsers`.

---

### H5 — Comments and media have no pagination
**File:** `rides/[id]/comments/route.ts`, `rides/[id]/media/route.ts`

Both return all rows with no `LIMIT`. A ride with 500 comments sends all 500 in one response. This will cause slow loads and crashes on popular rides.

**Fix:** Add `LIMIT 50 OFFSET $n` and return `{ comments, meta: { total, has_more } }`.

---

## 🟠 MEDIUM — Security & Correctness

### M1 — Rate limiter is built but never applied
**Files:** `lib/rate-limiter/` (full implementation exists)

The rate limiter (memory + Redis stores) is implemented but **no middleware applies it to any route**. Auth endpoints (`/login`, `/signup`, `/forgot-password`) are wide open to brute-force.

**Fix:** Wire `rateLimiter.check()` in a middleware on at minimum the auth routes.

---

### M2 — Admin role checked per-handler, not in middleware
Every admin route manually does:
```typescript
if (auth.role !== 'admin') return apiError('Admin access required', 403);
```

If anyone forgets this check in a new admin route, it is publicly accessible. One missed line = privilege escalation.

**Fix:** Create an `adminMiddleware` that runs before all `/api/admin/*` routes and rejects non-admins at the routing layer.

---

### M3 — Reply comments not validated against parent ride
**File:** `rides/[id]/comments/route.ts`

When posting a reply with `parent_id`, the backend inserts it without verifying:
1. That `parent_id` exists at all
2. That `parent_id` belongs to **this ride** (not a different ride's comment)

A user can link their reply to an arbitrary comment from any ride.

**Fix:**
```sql
-- Before INSERT, verify parent:
SELECT 1 FROM ride_comments WHERE id = $parent_id AND ride_id = $rideId
```

---

### M4 — Bike brand filter in suggestions is too strict
**File:** `social.service.ts` (`getSuggestions()`)

```typescript
p.bikes @> $3::jsonb  -- where $3 = '[{"brand":"Royal Enfield"}]'
```

`@>` (contains) requires an **exact partial match**. A user with bike `{ brand: "Royal Enfield", model: "Himalayan", cc: 450 }` will NOT match the filter `[{ "brand": "Royal Enfield" }]` because the array element objects don't match exactly.

**Fix:** Use a GIN index with `jsonb_path_exists` or unnest the bikes array:
```sql
EXISTS (
  SELECT 1 FROM jsonb_array_elements(p.bikes) b
  WHERE b->>'brand' = $brandFilter
)
```

---

### M5 — No `updated_at` on rides table
All other tables have `updated_at`. Rides don't. This makes it impossible to know when a ride was last edited, breaks cache invalidation logic, and makes audit trails incomplete.

**Fix:** Add `updated_at TIMESTAMPTZ DEFAULT now()` and a trigger to keep it current.

---

### M6 — GET comments/media visible to public even on private rides
**File:** `rides/[id]/comments/route.ts` (GET handler)

Posting comments requires being an approved participant. But the GET handler has no auth check — anyone can read all comments on any ride, including private/invite-only rides.

**Fix:** On GET, check if ride is private/invite-only; if so, require the user to be an approved participant.

---

## ⚪ LOW — Quality Improvements

### L1 — No soft delete on rides
The admin DELETE endpoint (once built) will hard-delete rides and cascade. Ride history, comments, media, and participant records will be permanently lost.

**Fix:** Add `deleted_at TIMESTAMPTZ` to rides. Filter `WHERE deleted_at IS NULL` in all queries.

---

### L2 — No ride edit endpoint
There is no `PUT /api/rides/:id`. Organisers cannot edit a ride after creating it from the frontend.

**Fix:** Add `PUT /api/rides/[id]/route.ts` with organiser-only auth check.

---

### L3 — Profile schema missing `avatar_url` for updates
The Zod `ProfileSchema` in `lib/validations.ts` does not include `avatar_url`. Users cannot update their profile photo through the API even though the DB column exists.

**Fix:** Add `avatar_url: z.string().url().optional()` to the schema.

---

### L4 — TODO left in production code
`auth/forgot-password/route.ts` has an active TODO comment that signals an incomplete feature to anyone reading logs or the codebase.

**Fix:** Either implement the email or throw a `501 Not Implemented` response so the frontend can handle it gracefully.

---

## What is Working Correctly

- JWT auth (access token + httpOnly refresh cookie) — correct
- Auto token refresh on 401 — correct
- All 6 auth endpoints exist and match frontend expectations
- Profile get/update paths match
- All ride read/join/complete/comment/media endpoints exist
- Admin block/unblock endpoints exist and match
- All health check endpoints exist
- Password hashing (bcrypt) — correct
- Parameterised SQL queries throughout — no SQL injection risk
- Trip code hashing in the schema — correct (just not enforced on join)
- Admin role guard (though per-handler, logic itself is correct)
- Service layer separation from route handlers — clean architecture

---

## Fix Priority Order

| # | Issue | Effort | Impact |
|---|---|---|---|
| 1 | C1 — Social connection param | Small | Unblocks entire social graph |
| 2 | C4 — Admin ride PUT/DELETE | Small | Unblocks admin rides tab |
| 3 | C5 — Signup missing role | Tiny | Fixes auth state after signup |
| 4 | H3 — Admin users crash | Tiny | Fixes admin users tab |
| 5 | H4 — Admin stats zeros | Tiny | Fixes admin dashboard |
| 6 | C3 — Metrics 404 | Tiny | Fixes admin system tab |
| 7 | C2 — Mutuals param type | Small | Fixes mutuals in Explore |
| 8 | H1 — Trip code not verified | Medium | Closes security hole |
| 9 | H2 — Email not sent | Medium | Makes forgot-password work |
| 10 | M1 — Rate limiter not wired | Small | Brute-force protection |
| 11 | M2 — Admin middleware | Small | Prevents future privilege escalation |
| 12 | H5 — Pagination on comments | Medium | Prevents slow load on busy rides |
| 13 | M3 — Reply parent validation | Tiny | Data integrity |
| 14 | M4 — Bike brand filter bug | Small | Fixes suggestions matching |
| 15 | M6 — Private ride comment leak | Small | Privacy fix |
| 16 | L1–L4 | Various | Quality improvements |
