# 01 — Architecture Overview

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 with TypeScript |
| Build Tool | Vite |
| Styling | TailwindCSS + shadcn/ui component library |
| State / Data Fetching | TanStack Query (React Query v5) |
| Routing | React Router v6 |
| Form Toasts | Sonner + shadcn/ui Toaster |
| Package Manager | Bun (lockfile: `bun.lockb`) |
| Deployment | Vercel |
| CI/CD | GitHub Actions (`deploy-dev.yml`, `deploy-prod.yml`) |

---

## Folder Structure

```
src/
  App.tsx                  — Root: routes, providers, lazy loading
  main.tsx                 — Entry point
  components/
    screens/               — One file per full-page screen (13 screens)
    home/                  — Sub-components used only on HomeScreen
    ride-details/          — Sub-components for RideDetailsScreen
    ride-discovery/        — Tabs for RideDiscoveryScreen
    ride-planning/         — Form sections for PlanRideScreen
    explore/               — Cards, modals, sections, stories for ExploreScreen
    layout/                — AppLayout wrapper
    ui/                    — shadcn/ui primitives + custom FadeIn, LoadingProgress
  contexts/
    AuthContext.tsx         — Global auth state (user, login, logout, isAdmin)
  hooks/
    useRides.ts            — TanStack Query hooks for all ride operations
    useFilters.ts          — Filter/sort state for HomeScreen
    useLoading.ts          — Simulated loading for skeleton screens
    use-mobile.tsx         — Breakpoint detection hook
    use-toast.ts           — Toast notifications hook
  services/
    api.ts                 — All HTTP calls (authApi, ridesApi, profileApi, socialApi, healthApi)
  data/                    — Static mock data (rides, profile, explore, notifications)
  types/
    index.ts               — All TypeScript interfaces
    explore.ts             — Explore-specific types
  lib/
    rideUtils.ts           — Utility functions (difficulty colours, cost formatting)
    validations.ts         — Form validation (ride creation)
    utils.ts               — General helpers (cn classname merge)
  constants/
    index.ts               — Shared constants (ride types, trip codes, etc.)
  pages/
    NotFound.tsx           — 404 page
```

---

## Routing Table

| Path | Screen | Auth Required | Admin Only |
|---|---|---|---|
| `/auth` | AuthScreen | No | No |
| `/` | HomeScreen | Yes | No |
| `/join-ride` | JoinRideScreen | Yes | No |
| `/ride/:id` | RideDetailsScreen | Yes | No |
| `/my-rides` | MyRidesScreen | Yes | No |
| `/plan-ride` | PlanRideScreen | Yes | No |
| `/location-planner` | LocationPlannerScreen | Yes | No |
| `/travel-diary` | TravelDiaryScreen | Yes | No |
| `/explore` | ExploreScreen | Yes | No |
| `/route-discovery` | RideDiscoveryScreen | Yes | No |
| `/route-discovery/:id` | RideDiscoveryScreen | Yes | No |
| `/notifications` | NotificationsScreen | Yes | No |
| `/profile` | ProfileScreen | Yes | No |
| `/admin` | AdminScreen | Yes | Yes (admin role) |
| `*` | NotFound | No | No |

All protected routes use a `<ProtectedRoute>` component that checks `isAuthenticated`.
Admin routes use `<AdminRoute>` that additionally checks `isAdmin`.

---

## Data Flow

```
Component
  → useRides() / useFilters() hook
    → TanStack Query
      → fetchRides() (mock or real API based on VITE_USE_MOCK env var)
        → ridesApi.list() → /api/rides
          → Returns Ride[] → cached in QueryClient
```

**Mock mode:** `VITE_USE_MOCK !== "false"` → returns hardcoded data from `src/data/`.
**Live mode:** `VITE_USE_MOCK=false` → hits real REST API at `VITE_API_URL`.

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL (empty = Vite proxy to localhost:3000 in dev) |
| `VITE_USE_MOCK` | Set to `"false"` to disable mock data |

---

## Error Handling

- **ErrorBoundary** wraps the entire app — catches unhandled React render errors.
- **ErrorHandler** component displays user-friendly error messages.
- **API layer** throws `ApiError` (with `.status` and `.data`) on non-2xx responses.
- **Token refresh:** On any 401 response, the API client automatically calls `/api/auth/refresh`
  once and retries. If refresh fails, the request propagates the error.
- **QueryClient** is configured with `retry: 1` and `refetchOnWindowFocus: false`.
