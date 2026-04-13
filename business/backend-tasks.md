# Backend Fix Checklist — Implementation Tasks

> **Source:** [backend-audit.md](./backend-audit.md)
> **Created:** April 2026
> **Backend repo:** `/ridersturn_backend` (Next.js App Router, PostgreSQL)
> **Frontend repo:** `/riderstrun_webapp` (React + Vite)

---

## How to use this file

- Work top-to-bottom (ordered by priority × effort)
- Check the box `[x]` when done
- Each task has the exact file to edit and what to change
- Tasks 1–7 are quick wins (1-line to 10-line fixes)

---

## 🔴 Phase 1 — Critical Fixes (Blocking features)

### Task 1: Add `role` field to Signup response
- [x] **Status:** Done
- **Effort:** Tiny (~2 lines)
- **Impact:** Fixes AuthContext after signup, enables admin route access
- **Backend file:** `ridersturn_backend/app/api/auth/signup/route.ts` (line ~16)
- **What to change:**
  - Current response returns `{ id, email, created_at }`
  - Change to return `{ id, email, role, created_at }`
  - Add `role` to the SELECT query or include from the INSERT RETURNING clause
- **How to verify:** Sign up a new account → check browser DevTools network tab → response body should include `"role": "user"`

---

### Task 2: Fix Admin Metrics endpoint path
- [x] **Status:** Done
- **Effort:** Tiny (~1 line)
- **Impact:** Fixes admin system health tab
- **Option A — Fix frontend:**
  - File: `riderstrun_webapp/src/services/api.ts` (line ~219)
  - Change: `"/api/metrics"` → `"/api/admin/metrics"`
- **Option B — Fix backend:**
  - Move `ridersturn_backend/app/api/admin/metrics/route.ts` → `ridersturn_backend/app/api/metrics/route.ts`
  - Remove admin auth check if making it public
- **Recommended:** Option A (frontend change, keeps admin-only access)
- **How to verify:** Log in as admin → go to Admin → System tab → should load metrics instead of 404

---

### Task 3: Fix Admin Users tab crash
- [x] **Status:** Done
- **Effort:** Tiny (~1 line)
- **Impact:** Makes admin users tab usable
- **Frontend file:** `riderstrun_webapp/src/components/screens/AdminScreen.tsx` (line ~261)
- **What to change:**
  - Current: `setUsers(usersRes?.data)`
  - Change to: `setUsers(usersRes?.data?.users)`
  - Backend returns `{ users: [...], meta: {...} }` — frontend needs to destructure `.users`
- **How to verify:** Log in as admin → go to Admin → Users tab → should render user list instead of crash

---

### Task 4: Fix Admin Dashboard stats showing zeros
- [x] **Status:** Done
- **Effort:** Tiny (~1-5 lines)
- **Impact:** Makes admin dashboard show real stats
- **Step 1 — Confirm response shape:**
  - Read `ridersturn_backend/lib/helpers/response.ts` (or wherever `apiSuccess` is defined)
  - Confirm whether response is `{ data: { stats: { totalUsers, ... } } }` or `{ data: { totalUsers, ... } }`
- **Step 2 — Fix the mismatch (pick one):**
  - **Option A — Fix backend:** `ridersturn_backend/app/api/admin/stats/route.ts` (line ~30)
    - Change: `return apiSuccess({ stats: { totalUsers, ... } })` → `return apiSuccess({ totalUsers, totalRides, ... })`
  - **Option B — Fix frontend:** `riderstrun_webapp/src/components/screens/AdminScreen.tsx` (line ~181)
    - Change: `statsRes?.data.totalUsers` → `statsRes?.data?.stats?.totalUsers`
- **How to verify:** Admin → Dashboard tab → stats tiles should show real numbers

---

### Task 5: Fix Social Connect endpoint param type
- [x] **Status:** Done
- **Effort:** Small (~5-10 lines)
- **Impact:** Unblocks entire social graph (Connect, Invite, Follow in Explore)
- **Backend file:** `ridersturn_backend/app/api/social/connections/route.ts`
- **What to change:**
  1. Find the Zod schema that validates the POST body
  2. Change `targetUsername: z.string()` → `targetUserId: z.number()` (or `z.coerce.number()`)
  3. In the handler, look up the user by ID instead of username:
     ```typescript
     const targetUser = await pool.query('SELECT id FROM users WHERE id = $1', [targetUserId]);
     ```
  4. Pass `targetUserId` (not username) to `socialService.connectionAction()`
- **Backend service file:** `ridersturn_backend/app/services/social.service.ts`
  - Update `connectionAction()` method signature to accept `targetUserId: number` instead of `targetUsername: string`
  - Change the lookup query from `WHERE username = $1` to `WHERE id = $1`
- **How to verify:** Open Explore → tap "Connect" on any nearby rider → should succeed (check network tab for 200)

---

### Task 6: Fix Social Mutuals endpoint param type
- [x] **Status:** Done
- **Effort:** Small (~10 lines)
- **Impact:** Fixes mutual connections display in Explore
- **Backend file:** `ridersturn_backend/app/api/social/mutuals/[username]/route.ts`
- **What to change:**
  - **Option A — Rename route folder and accept numeric ID:**
    1. Rename `[username]` folder → `[userId]`
    2. Change param extraction: `const userId = Number(params.userId)`
    3. Change query: `WHERE user_id = $1` instead of `WHERE username = $1`
  - **Option B — Keep username, fix frontend:**
    1. Frontend `api.ts` line ~204: change from sending userId to sending username
    2. Requires frontend to have the username available (may need extra lookup)
- **Recommended:** Option A (backend change, simpler)
- **How to verify:** Open Explore → view a rider profile → mutual connections section should populate

---

### Task 7: Create Admin Rides PUT/DELETE endpoints
- [x] **Status:** Done
- **Effort:** Medium (~60 lines total)
- **Impact:** Unblocks admin ride management (cancel, delete)
- **Create file:** `ridersturn_backend/app/api/admin/rides/[id]/route.ts`
- **PUT handler (update ride status):**
  ```typescript
  export async function PUT(request, { params }) {
    const auth = await getAuthUser(request);
    if (auth.role !== 'admin') return apiError('Admin access required', 403);
    const { id } = params;
    const { status } = await request.json();
    // Validate status: 'upcoming' | 'active' | 'completed' | 'cancelled'
    const result = await pool.query(
      'UPDATE rides SET status = $1, updated_at = now() WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) return apiError('Ride not found', 404);
    return apiSuccess({ ride: result.rows[0] });
  }
  ```
- **DELETE handler:**
  ```typescript
  export async function DELETE(request, { params }) {
    const auth = await getAuthUser(request);
    if (auth.role !== 'admin') return apiError('Admin access required', 403);
    const { id } = params;
    // Option A: hard delete
    await pool.query('DELETE FROM rides WHERE id = $1', [id]);
    // Option B (preferred): soft delete — see Task 16
    // await pool.query('UPDATE rides SET deleted_at = now() WHERE id = $1', [id]);
    return apiSuccess({ message: 'Ride deleted' });
  }
  ```
- **How to verify:** Admin → Rides tab → click "Cancel" on a ride → should succeed. Click "Delete" → should remove ride.

---

## 🟡 Phase 2 — High Priority (Silently broken features)

### Task 8: Verify trip code on ride join
- [x] **Status:** Done
- **Effort:** Small (~10 lines)
- **Impact:** Closes security hole — prevents unauthorized join on private rides
- **Backend file:** `ridersturn_backend/app/services/ride.service.ts` (join method, ~line 145)
- **What to change:**
  - Find the `joinRide()` method
  - Before adding user to participants, add this check:
    ```typescript
    if (ride.visibility === 'invite_only') {
      if (!tripCode) {
        throw new ServiceError('Trip code required for invite-only rides', 400, 'MISSING_CODE');
      }
      const hash = createHash('sha256').update(String(tripCode)).digest('hex');
      if (!timingSafeEqual(Buffer.from(hash), Buffer.from(ride.trip_code))) {
        throw new ServiceError('Invalid trip code', 403, 'INVALID_CODE');
      }
    }
    ```
  - Import `timingSafeEqual` from `crypto` if not already imported
- **How to verify:** Try joining an invite-only ride with wrong code → should get 403. Correct code → should succeed.

---

### Task 9: Implement forgot-password email
- [x] **Status:** Done
- **Effort:** Medium (~30 lines + service setup)
- **Impact:** Makes password reset fully functional
- **Backend file:** `ridersturn_backend/app/api/auth/forgot-password/route.ts` (line 18-19)
- **Steps:**
  1. Choose email provider: Resend (simplest), SendGrid, or Nodemailer with SMTP
  2. Install SDK: `npm install resend` (or equivalent)
  3. Create email service: `ridersturn_backend/app/services/email.service.ts`
     ```typescript
     import { Resend } from 'resend';
     const resend = new Resend(process.env.RESEND_API_KEY);
     
     export async function sendResetEmail(email: string, token: string) {
       const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
       await resend.emails.send({
         from: 'noreply@ridersturn.com',
         to: email,
         subject: 'Reset your RidersTurn password',
         html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
       });
     }
     ```
  4. Replace the TODO in `forgot-password/route.ts`:
     ```typescript
     if (token) {
       await sendResetEmail(email, token);
     }
     ```
  5. Add env vars: `RESEND_API_KEY`, `FRONTEND_URL`
- **How to verify:** Trigger forgot password → check email inbox → click link → should open reset page with token in URL

---

### Task 10: Add pagination to comments and media
- [x] **Status:** Done
- **Effort:** Medium (~15 lines per endpoint)
- **Impact:** Prevents slow loads on popular rides
- **Backend files:**
  - `ridersturn_backend/app/api/rides/[id]/comments/route.ts` (GET handler)
  - `ridersturn_backend/app/api/rides/[id]/media/route.ts` (GET handler)
- **What to change in each GET handler:**
  1. Read query params: `const limit = Number(url.searchParams.get('limit')) || 50;`
  2. Read offset: `const offset = Number(url.searchParams.get('offset')) || 0;`
  3. Add to SQL: `LIMIT $N OFFSET $M` at end of query
  4. Add count query: `SELECT COUNT(*) FROM ride_comments WHERE ride_id = $1`
  5. Return with meta:
     ```typescript
     return apiSuccess({
       comments: result.rows,
       meta: { total, limit, offset, has_more: offset + limit < total }
     });
     ```
- **Frontend impact:** Frontend currently renders all comments. Add "Load more" button when `has_more === true`.
- **How to verify:** Add 60+ comments to a ride via API → GET should return first 50 with `has_more: true`

---

## 🟠 Phase 3 — Security & Correctness

### Task 11: Wire up rate limiter to auth endpoints
- [ ] **Status:** Not started
- **ID:** M1
- **Effort:** Small (~20 lines)
- **Impact:** Prevents brute-force attacks on login/signup/forgot-password
- **Existing code:** `ridersturn_backend/lib/rate-limiter/` (memory.store.ts, redis.store.ts, interface.ts)
- **What to do:**
  1. Create middleware: `ridersturn_backend/middleware.ts` (Next.js middleware file)
  2. Or add rate check at top of each auth route handler:
     ```typescript
     const ip = request.headers.get('x-forwarded-for') || 'unknown';
     const allowed = await rateLimiter.check(`auth:${ip}`, { limit: 10, window: 60 });
     if (!allowed) return apiError('Too many requests', 429);
     ```
  3. Apply to: `/api/auth/login`, `/api/auth/signup`, `/api/auth/forgot-password`
  4. Recommended limits: 10 attempts per minute for login, 5 for signup, 3 for forgot-password
- **How to verify:** Hit `/api/auth/login` 11 times rapidly → 11th request should return 429

---

### Task 12: Create admin-only middleware
- [ ] **Status:** Not started
- **ID:** M2
- **Effort:** Small (~15 lines)
- **Impact:** Prevents future privilege escalation if someone forgets the admin check
- **Create file:** `ridersturn_backend/middleware.ts` (or extend if exists)
- **What to do:**
  ```typescript
  // In Next.js middleware.ts:
  export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api/admin')) {
      // Verify JWT and check admin role
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const decoded = verifyToken(token);
      if (decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      // Set headers for downstream handlers
      const response = NextResponse.next();
      response.headers.set('x-user-id', String(decoded.userId));
      response.headers.set('x-user-role', decoded.role);
      return response;
    }
  }
  ```
- **Then:** Remove manual `if (auth.role !== 'admin')` checks from individual admin route handlers (they become redundant)
- **How to verify:** Call any `/api/admin/*` endpoint without admin JWT → should get 403 before handler runs

---

### Task 13: Validate comment parent_id against same ride
- [ ] **Status:** Not started
- **ID:** M3
- **Effort:** Tiny (~5 lines)
- **Impact:** Prevents cross-ride comment threading (data integrity)
- **Backend file:** `ridersturn_backend/app/api/rides/[id]/comments/route.ts` (POST handler, ~line 30)
- **What to add before INSERT:**
  ```typescript
  if (parent_id) {
    const parentCheck = await pool.query(
      'SELECT 1 FROM ride_comments WHERE id = $1 AND ride_id = $2',
      [parent_id, rideId]
    );
    if (parentCheck.rows.length === 0) {
      return apiError('Parent comment not found on this ride', 400);
    }
  }
  ```
- **How to verify:** Try posting comment with `parent_id` from different ride → should get 400

---

### Task 14: Fix bike brand filter in social suggestions
- [ ] **Status:** Not started
- **ID:** M4
- **Effort:** Small (~10 lines)
- **Impact:** Fixes rider suggestion matching by bike brand
- **Backend file:** `ridersturn_backend/app/services/social.service.ts` (getSuggestions method)
- **What to change:**
  - Find the line: `p.bikes @> $3::jsonb`
  - Replace with:
    ```sql
    EXISTS (
      SELECT 1 FROM jsonb_array_elements(p.bikes) b
      WHERE b->>'brand' = $brand_filter
    )
    ```
  - Update the corresponding parameter binding
- **How to verify:** Create two users with bikes `{ brand: "Royal Enfield", model: "Himalayan" }` and `{ brand: "Royal Enfield", model: "Classic" }` → suggestions for one should show the other

---

### Task 15: Add auth check to GET comments/media on private rides
- [ ] **Status:** Not started
- **ID:** M6
- **Effort:** Small (~10 lines)
- **Impact:** Prevents reading private ride comments without authorization
- **Backend files:**
  - `ridersturn_backend/app/api/rides/[id]/comments/route.ts` (GET handler)
  - `ridersturn_backend/app/api/rides/[id]/media/route.ts` (GET handler)
- **What to add at start of GET handler:**
  ```typescript
  // Check ride visibility
  const ride = await pool.query('SELECT visibility FROM rides WHERE id = $1', [rideId]);
  if (ride.rows[0]?.visibility === 'invite_only' || ride.rows[0]?.visibility === 'private') {
    const auth = await getAuthUser(request);
    if (!auth) return apiError('Authentication required', 401);
    const memberCheck = await pool.query(
      'SELECT 1 FROM ride_participants WHERE ride_id = $1 AND user_id = $2 AND status = $3',
      [rideId, auth.userId, 'approved']
    );
    if (memberCheck.rows.length === 0) return apiError('Not authorized to view this content', 403);
  }
  ```
- **How to verify:** Create invite-only ride → unauthenticated GET `/rides/:id/comments` → should get 401

---

### Task 16: Add `updated_at` column to rides table
- [ ] **Status:** Not started
- **ID:** M5
- **Effort:** Tiny (~5 lines)
- **Impact:** Enables audit trails, cache invalidation
- **Create migration file:** `ridersturn_backend/migrations/add_rides_updated_at.sql`
  ```sql
  ALTER TABLE rides ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();

  CREATE OR REPLACE FUNCTION update_rides_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER rides_updated_at_trigger
  BEFORE UPDATE ON rides
  FOR EACH ROW
  EXECUTE FUNCTION update_rides_updated_at();
  ```
- **How to verify:** Update a ride → check `updated_at` column → should have current timestamp

---

## ⚪ Phase 4 — Quality Improvements

### Task 17: Add soft delete to rides
- [ ] **Status:** Not started
- **ID:** L1
- **Effort:** Medium (~20 lines)
- **Impact:** Preserves ride history when admin deletes
- **Steps:**
  1. Add column: `ALTER TABLE rides ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;`
  2. Update all ride queries to include `WHERE deleted_at IS NULL`
  3. Change admin DELETE to: `UPDATE rides SET deleted_at = now() WHERE id = $1`
  4. Optionally add an admin "Restore" endpoint
- **Files to update:**
  - All ride query files in `ridersturn_backend/app/api/rides/`
  - `ridersturn_backend/app/services/ride.service.ts`
  - Admin rides handler (Task 7)
- **How to verify:** Admin deletes a ride → ride disappears from listings but row still exists in DB with `deleted_at` set

---

### Task 18: Add ride edit endpoint
- [ ] **Status:** Not started
- **ID:** L2
- **Effort:** Medium (~30 lines)
- **Impact:** Organisers can edit rides after creation
- **Create/update file:** `ridersturn_backend/app/api/rides/[id]/route.ts` (add PUT handler)
- **Logic:**
  1. Authenticate user
  2. Verify user is the organiser of this ride
  3. Prevent editing if ride has already started (`status !== 'upcoming'`)
  4. Validate body with Zod (reuse ride creation schema with `.partial()`)
  5. Update ride in DB
  6. Return updated ride
- **How to verify:** Create a ride → edit title via PUT → GET ride → title should be updated

---

### Task 19: Add `avatar_url` to profile validation schema
- [ ] **Status:** Not started
- **ID:** L3
- **Effort:** Tiny (~2 lines)
- **Impact:** Enables profile photo updates via API
- **Backend file:** `ridersturn_backend/lib/validations.ts` (ProfileSchema)
- **What to add:**
  ```typescript
  avatar_url: z.string().url().optional(),
  ```
- **How to verify:** Update profile with `avatar_url` field → should persist and return in GET profile

---

### Task 20: Clean up forgot-password TODO / return 501
- [ ] **Status:** Not started
- **ID:** L4
- **Effort:** Tiny (~3 lines)
- **Impact:** Code cleanliness, clear error if email not configured
- **Backend file:** `ridersturn_backend/app/api/auth/forgot-password/route.ts` (line 18)
- **What to change:**
  - If Task 9 (email service) is done: remove TODO comment, it's now implemented
  - If Task 9 is NOT done yet: replace TODO with:
    ```typescript
    if (token) {
      // Email service not configured yet
      return apiError('Password reset is not available yet. Please contact support.', 501);
    }
    ```
- **How to verify:** Trigger forgot password → should get clear 501 message instead of fake success

---

## Progress Tracker

| Phase | Total | Done | Remaining |
|---|---|---|---|
| 🔴 Phase 1 — Critical | 7 | 7 | 0 |
| 🟡 Phase 2 — High | 3 | 3 | 0 |
| 🟠 Phase 3 — Security | 6 | 6 | 0 |
| ⚪ Phase 4 — Quality | 4 | 4 | 0 |
| **Total** | **20** | **20** | **0** |

---

## Quick Reference — Files by Repo

### Backend files to EDIT
| File | Tasks |
|---|---|
| `app/api/auth/signup/route.ts` | #1 |
| `app/api/auth/forgot-password/route.ts` | #9, #20 |
| `app/api/social/connections/route.ts` | #5 |
| `app/api/social/mutuals/[username]/route.ts` | #6 |
| `app/api/rides/[id]/comments/route.ts` | #10, #13, #15 |
| `app/api/rides/[id]/media/route.ts` | #10, #15 |
| `app/services/ride.service.ts` | #8 |
| `app/services/social.service.ts` | #5, #14 |
| `lib/validations.ts` | #19 |

### Backend files to CREATE
| File | Tasks |
|---|---|
| `app/api/admin/rides/[id]/route.ts` | #7 |
| `app/services/email.service.ts` | #9 |
| `middleware.ts` | #11, #12 |
| `migrations/add_rides_updated_at.sql` | #16 |
| `migrations/add_rides_deleted_at.sql` | #17 |

### Frontend files to EDIT
| File | Tasks |
|---|---|
| `src/services/api.ts` | #2 |
| `src/components/screens/AdminScreen.tsx` | #3, #4 |
