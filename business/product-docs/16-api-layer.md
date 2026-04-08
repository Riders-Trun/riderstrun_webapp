# 16 — API Layer

## Overview

All HTTP communication is centralised in **`src/services/api.ts`**. It exports
grouped API objects (`authApi`, `ridesApi`, `profileApi`, `socialApi`, `healthApi`)
and a shared `request()` function that handles JWT tokens, automatic refresh, and
error normalisation.

In development, `VITE_USE_MOCK=true` (default) causes hooks to return mock data
from `src/data/*.ts` instead of hitting the real API.

---

## Base Configuration

```typescript
// Vite dev proxy (vite.config.ts):
"/api" → proxy to "http://localhost:3000"

// Production:
VITE_API_URL environment variable sets base URL
```

---

## Core request() Function

```typescript
async function request<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean }
): Promise<T>
```

**Token flow:**
1. Read `accessToken` from module-level memory variable
2. Attach as `Authorization: Bearer <token>` header (unless `skipAuth: true`)
3. On `401` response → call `authApi.refresh()` to get new tokens
4. Retry original request once with new token
5. If refresh also fails → `logout()` + throw error

**Error handling:**
- Non-2xx responses throw `ApiError` with `{ message, status }`
- Network errors propagate as-is

**Cookies:**
- `credentials: "include"` on all requests so HTTP-only refresh token cookie is sent

---

## Auth API (`authApi`)

| Method | HTTP | Endpoint | Payload | Returns |
|---|---|---|---|---|
| `signup(email, password)` | POST | `/api/auth/signup` | `{ email, password }` | `{ user, accessToken }` |
| `login(email, password)` | POST | `/api/auth/login` | `{ email, password }` | `{ user, accessToken }` |
| `logout()` | POST | `/api/auth/logout` | — | `void` |
| `refresh()` | POST | `/api/auth/refresh` | — (cookie) | `{ accessToken }` |
| `forgotPassword(email)` | POST | `/api/auth/forgot-password` | `{ email }` | `{ message }` |
| `resetPassword(token, newPassword)` | POST | `/api/auth/reset-password` | `{ token, newPassword }` | `{ message }` |

All auth endpoints use `skipAuth: true` (no Bearer token needed).

---

## Profile API (`profileApi`)

| Method | HTTP | Endpoint | Payload | Returns |
|---|---|---|---|---|
| `getMyProfile()` | GET | `/api/profile/me` | — | `UserProfile` |
| `updateProfile(data)` | PUT | `/api/profile/me` | `Partial<UserProfile>` | `UserProfile` |
| `getPublicProfile(username)` | GET | `/api/profile/:username` | — | `PublicProfile` |

---

## Rides API (`ridesApi`)

| Method | HTTP | Endpoint | Payload | Returns |
|---|---|---|---|---|
| `list(params?)` | GET | `/api/rides` | query params (filters) | `Ride[]` |
| `create(data)` | POST | `/api/rides` | `CreateRidePayload` | `Ride` |
| `getById(id)` | GET | `/api/rides/:id` | — | `RideDetail` |
| `join(id)` | POST | `/api/rides/:id/join` | — | `{ message }` |
| `complete(id)` | POST | `/api/rides/:id/complete` | — | `{ message }` |
| `getComments(id)` | GET | `/api/rides/:id/comments` | — | `Comment[]` |
| `addComment(id, content, parentId?)` | POST | `/api/rides/:id/comments` | `{ content, parentId? }` | `Comment` |
| `getMedia(id)` | GET | `/api/rides/:id/media` | — | `Media[]` |
| `addMedia(id, mediaUrl, mediaType, caption?)` | POST | `/api/rides/:id/media` | `{ mediaUrl, mediaType, caption? }` | `Media` |

---

## Social API (`socialApi`)

| Method | HTTP | Endpoint | Payload | Returns |
|---|---|---|---|---|
| `getConnections(status?)` | GET | `/api/social/connections` | `?status=pending\|accepted` | `Connection[]` |
| `connectionAction(targetUserId, action)` | POST | `/api/social/connections` | `{ targetUserId, action }` | `{ message }` |
| `search(query)` | GET | `/api/social/search` | `?q=query` | `SearchResult[]` |
| `suggestions()` | GET | `/api/social/suggestions` | — | `NearbyRider[]` |
| `mutuals(userId)` | GET | `/api/social/mutuals/:userId` | — | `User[]` |

`action` values: `"connect"` | `"invite"` | `"follow"` | `"unfollow"` | `"accept"` | `"reject"`

---

## Admin API (called directly in AdminScreen)

| Method | HTTP | Endpoint | Returns |
|---|---|---|---|
| Get stats | GET | `/api/admin/stats` | `AdminStats` |
| Get users | GET | `/api/admin/users` | `AdminUser[]` |
| Block user | POST | `/api/admin/users/:id/block` | `{ message }` |
| Unblock user | POST | `/api/admin/users/:id/unblock` | `{ message }` |
| Get rides | GET | `/api/admin/rides` | `AdminRide[]` |
| Update ride | PUT | `/api/admin/rides/:id` | `AdminRide` |
| Delete ride | DELETE | `/api/admin/rides/:id` | `{ message }` |

---

## Health API (`healthApi`)

| Method | HTTP | Endpoint | Returns |
|---|---|---|---|
| `check()` | GET | `/api/health` | `{ status, timestamp }` |
| `dbCheck()` | GET | `/api/health/db` | `{ status, responseTime }` |
| `dependencies()` | GET | `/api/health/dependencies` | `Dependency[]` |
| `metrics()` | GET | `/api/health/metrics` | `{ memory, uptime, requests }` |

---

## TanStack Query Integration

All API calls are wrapped in custom hooks in `src/hooks/useRides.ts`:

```typescript
// Query hooks (read)
useRides()              // ridesApi.list()         — staleTime: 5 min
useRideById(id)         // ridesApi.getById(id)    — staleTime: 2 min
useUpcomingRides()      // ridesApi.list({upcoming: true})
usePastRides()          // ridesApi.list({past: true})
useOrganizedRides()     // ridesApi.list({organized: true})

// Mutation hooks (write)
useCreateRide()         // ridesApi.create(data)   → invalidates useRides
useJoinRide()           // ridesApi.join(id)        → invalidates useRideById
```

**Query client defaults (`src/App.tsx`):**
```typescript
defaultOptions: {
  queries: {
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,   // 5 minutes
  }
}
```

---

## Mock Data Toggle

When `VITE_USE_MOCK=true` (default in development):
- Hooks return data from `src/data/*.ts` files instead of calling the API
- No network requests are made
- Useful for frontend development without a running backend

Mock data files:

| File | Data provided |
|---|---|
| `src/data/rides.ts` | AVAILABLE_RIDES, UPCOMING_RIDES, PAST_RIDES, ORGANIZED_RIDES |
| `src/data/rideDetails.ts` | mockRideDetails (full RideDetail object) |
| `src/data/profile.ts` | mockProfile, mockStats, mockAchievements, mockStreaks, mockChallenges |
| `src/data/explore.ts` | nearbyRiders, crewIntents, mentors, rideMoments, initiatives |
| `src/data/notifications.ts` | notifications array |
| `src/data/rideDiscovery.ts` | routes, talkPosts, photos |

---

## Feature Score

| Feature | Status |
|---|---|
| Centralised request() with token injection | Implemented |
| Automatic 401 → refresh → retry | Implemented |
| Cookie-based refresh token | Implemented |
| ApiError class | Implemented |
| All auth endpoints | Implemented |
| Profile get/update | Implemented |
| Rides CRUD + join/complete | Implemented |
| Ride comments + media | Implemented |
| Social connections API | Implemented |
| Admin CRUD APIs | Implemented |
| Health check APIs | Implemented |
| TanStack Query hooks | Implemented |
| Mock data toggle | Implemented |
| Request deduplication | Via TanStack Query |
| Optimistic updates | Not implemented |
| WebSocket / real-time | Not implemented |
| File upload (multipart) | Not implemented |
| Rate limiting handling | Not implemented |
| Request cancellation | Not implemented |
