# RidersTurn Webapp — Pending Issues Audit

> **Generated:** 2026-06-26  
> **Scope:** `riderstrun_webapp` (Vite + React 18 + TypeScript + Tailwind + shadcn/ui)  
> **Method:** 12 finder agents swept the codebase by module → 108 candidate issues → each adversarially verified against current source (real *and* still present?) → **101 confirmed**, 7 rejected. 121 agents total.

## ✅ Fix Progress

_Updated 2026-06-26 — working through issues in priority order._

| # | Item | Status |
|---|------|--------|
| P1a | Delete 3 corrupt orphan files (PostDetailModal, RouteDetailsModal, screens/RouteDiscoveryScreen) | ✅ **Done** — `tsc` parse errors 29→0; build passes |
| P2 | Clear the 5 real type errors hidden behind the parse failures | ✅ **Done** — `tsc --noEmit` now **0 errors**; build passes |
| P1b | Wire `tsc` into build (`build` = `tsc -b && vite build`) + add `typecheck` script | ✅ **Done** — build now type-checks first; both pass |
| P3a | Fix `npm run lint` crash (bump `typescript-eslint` 8.11→8.62) + clear 5 lint errors | ✅ **Done** — lint exits 0 (80 non-blocking warnings remain) |
| P3b | Add CI job (typecheck + lint + test + build on push/PR) | ✅ **Done** — new `.github/workflows/ci.yml`; all 4 gates pass locally |

**✅ Priority 1 (type-safety gate) COMPLETE** — corrupt files gone, `tsc` at 0 errors, gate wired into build.
**✅ Priority 2 (lint + CI) COMPLETE** — `npm run lint` fixed (exits 0), CI validates typecheck/lint/test/build on every push & PR.

**Working quality gate is now in place** — regressions from here on are catchable. Remaining audit work is feature-wiring & correctness (Priorities 3–8).

**P2 detail — 5 `tsc` errors cleared:**
1. ✅ `CommunityPostCard.tsx:3` — removed unused `SwipeUp` import (TS2305)
2. ✅ `QuickChatModal.tsx` — typed `Message.metadata` concretely + added `&& msg.metadata` guard (TS18048, TS2322)
3. ✅ `StoryContent` — rewrote central type to real shape `{type,content,caption?}`, removed StoryCreator's duplicate, typed `handlePublishStory` as `StoryContent` (TS2322) — also closes the "StoryContent duplicated" finding
4. ✅ Bike CC filter (**Path A**) — added `minimumCC?: string` to `Ride`, populated all 5 rides (RE 350 / Kawasaki 250 / Honda 250 / Bajaj 150 / Yamaha 150), removed the `!ride.minimumCC` escape hatch so the filter actually narrows (TS2339 + fixes the HIGH functional bug)
5. ✅ `useFilters` — typed `DEFAULT_FILTERS` as `FilterOptions`, dropped `as const` (TS2345)

## Summary

**Confirmed pending: 101 issues** — 🔴 0 critical · 🟠 21 high · 🟡 25 medium · ⚪ 55 low

| # | Area | Issues |
|---|------|--------|
| 1 | Tooling, Build & Tests (broken quality gates) | 11 |
| 2 | Incomplete Features & Mock Data (not wired to backend) | 24 |
| 3 | API / Backend Contract Mismatches | 8 |
| 4 | Home / Discovery Filters & Sorting (silently non-functional) | 9 |
| 5 | Auth & Security | 7 |
| 6 | Types & Type Safety | 8 |
| 7 | Performance & Quality (dead code, duplication, stale audit claims) | 15 |

### The headline

The ridersturn webapp looks far more functional than it is: a large fraction of the UI is wired to hardcoded mock data with action handlers that only console.log or flip local state, so core flows (joining a ride, the entire Explore social graph, profile, notifications, travel diary, location planner) never touch the backend. Two prior audits claim many of these issues "resolved," but verification against current source shows the claims are stale — TypeScript strict mode, type centralization, memoization, security headers, and React Query migration were only partially done. The single most dangerous theme is that there is NO working quality gate: `tsc --noEmit` is broken by three corrupt/truncated orphan files, `npm run lint` crashes on the first file due to an eslint/typescript-eslint version mismatch, the build script runs `vite build` with no typecheck, and CI runs no tests/lint/typecheck and only deploys on manual trigger. A second major theme is frontend↔backend contract drift: API responses are typed as `Record<string,unknown>` and force-cast with `as unknown as`, the admin health/db cards always show "unreachable" due to a `.data` unwrap bug, and join-by-code navigates using a trip code as a numeric ride id. Security gaps remain in production (no CSP/security headers — vite headers are dev-only, vercel.json has none) and there is no in-app logout despite a working `logout()`. Several Home filters (Distance, Bike CC, Group Size, Earliest-date sort) are silently non-functional. The bulk of pending work is incomplete-feature wiring and mock-to-API integration, sitting on top of a broken tooling foundation that must be restored first so regressions can actually be caught.

## 🥇 Top priorities (fix in this order)

1. Restore the type-safety gate: delete/fix the 3 corrupt orphan files (PostDetailModal, RouteDetailsModal, RouteDiscoveryScreen) so `tsc --noEmit` parses, then add `tsc -b && vite build` to the build script and a typecheck step to CI
2. Fix the broken lint: bump typescript-eslint to a version compatible with eslint 9.39 so `npm run lint` runs at all, and add lint/test/typecheck jobs to CI on pull_request/push
3. Wire the Join-a-ride flow to the backend — RideDetailsScreen 'Join Ride' and JoinRideScreen by-code only fake it (local state + setTimeout); call useJoinRide/ridesApi.join and resolve trip codes to real ride ids
4. Replace the all-mock Explore module and Profile/Notifications screens with real socialApi/profileApi calls — every Explore handler is a console.log stub and Profile/Notifications never fetch the backend
5. Fix silently non-functional Home filters: Distance Range slider, Bike CC (reads ride.minimumCC which doesn't exist on Ride), Group Size (filters joinedCount), and Earliest-date sort (Invalid Date on Today/Tomorrow labels)
6. Fix the Admin System tab health/db cards that always show 'unreachable' because they read `.data` on flat (unwrapped) health responses
7. Add production security headers + CSP via vercel.json (vite headers are dev-server only) and add an in-app logout control (logout() exists but is never called)
8. Add a backend response-mapping layer (snake_case → camelCase) and concrete API types; remove the `as unknown as Ride[]` casts so real-API mode doesn't render undefined everywhere

## ⚡ Quick wins (small, high payoff)

- Remove the invalid `SwipeUp` import from CommunityPostCard.tsx:3 (not a lucide-react export)
- Change useToast effect dep array from [state] to [] (use-toast.ts:174) to stop re-subscribing the listener on every toast
- Delete the unused `useQueryClient()` call in AdminScreen.tsx:94
- Replace local FilterOptions re-declarations in DrawableFilters/ActiveFilters/SearchFilters with `import type { FilterOptions } from '@/types'`
- Read flat health fields in AdminScreen (healthRes.status/uptime, dbRes.connected/pool) instead of `.data` to fix the always-'unreachable' cards
- Delete dead files: SearchFilters.tsx, RouteDiscoveryScreen.tsx, the 15 orphaned explore components, and unused shadcn primitives (chart/carousel/table/etc.)
- Reconcile the duplicated ride-type emoji maps (RideFilters.getFilterEmoji vs rideUtils.getRideTypeEmoji) into one source
- Document VITE_USE_MOCK in .env.example (or flip the default) so deploys don't silently run on mock data
- Remove the 14 console.log stubs in ExploreScreen and the StoryViewer/InviteSystem logs
- Delete the stale bun.lockb (CI uses npm/package-lock.json) and add it to .gitignore

---

## Full findings by area

### 1. Tooling, Build & Tests (broken quality gates) (11)

#### 🟠 `HIGH` — tsc --noEmit is fully broken by 3 corrupt/truncated orphan files, disabling the only type-safety gate

**Files:** `src/components/explore/modals/PostDetailModal.tsx:1`, `src/components/explore/modals/RouteDetailsModal.tsx:1`, `src/components/screens/RouteDiscoveryScreen.tsx:227`, `package.json:8`  
**What's pending:** PostDetailModal and RouteDetailsModal are truncated at the TOP (start mid-JSX/mid-object-literal, no imports/component decl); RouteDiscoveryScreen has a parse error near 227. `tsc --noEmit -p tsconfig.app.json` aborts with 29 parse errors. All three are orphaned so `vite build` tree-shakes them, but typecheck is dead and masks real errors elsewhere.  
**Suggested fix:** Delete the three orphaned corrupt files (or restore their full content), then add `tsc --noEmit` to build/CI so type errors block merges.

#### 🟠 `HIGH` — npm run lint crashes on every file (eslint 9.39 vs typescript-eslint 8.11 mismatch)

**Files:** `eslint.config.js:1`, `package.json:79`, `package.json:89`  
**What's pending:** ESLint 9.39 changed the no-unused-expressions rule schema; typescript-eslint 8.11 reads allowShortCircuit off undefined and crashes on the first file. Zero lint coverage locally or in CI.  
**Suggested fix:** Bump typescript-eslint / @typescript-eslint/* to a version compatible with eslint 9.39 (>=8.16), then verify `npm run lint` actually lints.

#### 🟡 `MEDIUM` — `npm run build` runs only `vite build` (no tsc); root tsconfig has files:[], so type errors pass CI silently

**Files:** `package.json:8`, `tsconfig.json:2`  
**What's pending:** Build never type-checks, so corrupted files and type errors ship. Reintroducing any import of the corrupt modals would break the build with no prior warning.  
**Suggested fix:** Change build to `tsc -b && vite build` (or add a typecheck script run in CI).

#### 🟡 `MEDIUM` — CI workflows run no tests, no lint, no typecheck — deploy-only and manual-trigger-only

**Files:** `.github/workflows/deploy-dev.yml:17`, `.github/workflows/deploy-prod.yml:17`  
**What's pending:** Both workflows go checkout→npm ci→vercel build→deploy with no validation, and trigger only on workflow_dispatch, so PRs get zero automated checks.  
**Suggested fix:** Add a CI job on pull_request/push running `npm ci && npm run lint && npm run test && npx tsc --noEmit -p tsconfig.app.json`, required before deploy.

#### 🟡 `MEDIUM` — Only one test file (one util); 147 source files, 0 component/hook/service tests, no coverage tooling

**Files:** `src/lib/rideUtils.test.ts:1`, `src/test/setup.ts:1`  
**What's pending:** Entire suite is rideUtils.test.ts (16 tests on pure helpers). api.ts, useRides, validations, AdminScreen, ErrorBoundary all untested; no coverage dep/script.  
**Suggested fix:** Add tests for token-refresh, useRides mock/real switch, zod schemas, AdminScreen response unwrapping; add @vitest/coverage-v8 + a coverage threshold.

#### 🟡 `MEDIUM` — Root tsconfig.json disables strictNullChecks/noImplicitAny/noUnused* — contradicts 'strict mode enabled' claim

**Files:** `tsconfig.json:12`, `tsconfig.json:17`  
**What's pending:** tsconfig.app.json sets strict:true but root tsconfig overrides with noImplicitAny:false, strictNullChecks:false, noUnusedLocals/Params:false. Tooling that resolves the root config gets strictness off; no typecheck script enforces it.  
**Suggested fix:** Remove the strictness overrides from root tsconfig.json, enable noUnusedLocals/Params in tsconfig.app.json, and add a typecheck script to CI.

#### 🟡 `MEDIUM` — deploy-dev workflow deploys to production (--prod) and pulls the production env

**Files:** `.github/workflows/deploy-dev.yml:34`, `.github/workflows/deploy-dev.yml:37`, `.github/workflows/deploy-dev.yml:40`  
**What's pending:** Dev workflow uses `vercel pull --environment=production`, `vercel build --prod`, `vercel deploy --prod` — identical prod semantics, so the dev project builds with prod env vars and creates a prod deployment.  
**Suggested fix:** Use `--environment=preview` on pull and drop `--prod` from build/deploy for the dev workflow.

#### 🟡 `MEDIUM` — VITE_USE_MOCK undocumented and defaults ON — real deploys silently run on mock data

**Files:** `src/hooks/useRides.ts:7`, `.env.example:1`  
**What's pending:** Mock is on unless VITE_USE_MOCK === 'false'; .env.example never mentions it and CI deploy workflows never set it. Following the example config ships an app that never hits the API.  
**Suggested fix:** Document VITE_USE_MOCK in .env.example (or flip the default to real API), and set it explicitly in deploy environments.

#### ⚪ `LOW` — Both bun.lockb and package-lock.json tracked; bun lockfile stale (2025) while CI uses npm

**Files:** `bun.lockb:1`, `package-lock.json:1`, `.github/workflows/deploy-prod.yml:28`  
**What's pending:** CI uses `npm ci`; bun.lockb last touched 2025-06 and has drifted, so `bun install` resolves a different graph than CI.  
**Suggested fix:** Delete bun.lockb and add it to .gitignore (or switch CI to bun and remove package-lock.json) — keep one lockfile.

#### ⚪ `LOW` — Makefile deploy-dev uses --prod and rewrites project.json back to PROD after deploy

**Files:** `Makefile:13`, `Makefile:17`, `Makefile:18`  
**What's pending:** deploy-dev runs `vercel --prod --yes` then overwrites .vercel/project.json back to the prod project, so the dev target produces a prod deployment and leaves prod config staged.  
**Suggested fix:** Drop --prod from deploy-dev (preview deploy) and remove the trailing project.json rewrite, or delete the Makefile if GitHub workflows are canonical.

#### ⚪ `LOW` — vite.config.ts adds a vitest `test` block but imports defineConfig from 'vite' (untyped test config)

**Files:** `vite.config.ts:1`, `vite.config.ts:49`  
**What's pending:** The `test` key isn't part of Vite's UserConfig, so it's unchecked; typos in test config won't be caught.  
**Suggested fix:** Import defineConfig from 'vitest/config' (or add the vitest/config reference), or move test config into vitest.config.ts.

### 2. Incomplete Features & Mock Data (not wired to backend) (24)

#### 🟠 `HIGH` — RideDetailsScreen 'Join Ride' only flips local state — never calls the backend; useJoinRide has zero consumers

**Files:** `src/components/screens/RideDetailsScreen.tsx:24`, `src/components/screens/RideDetailsScreen.tsx:34`, `src/components/screens/RideDetailsScreen.tsx:319`, `src/hooks/useRides.ts:82`  
**What's pending:** handleJoinRide just does setIsJoined(true); the useJoinRide mutation (wraps ridesApi.join, invalidates rides) is exported but used nowhere. Joining never persists and is lost on reload.  
**Suggested fix:** Call useJoinRide().mutate(id) in handleJoinRide; gate isJoined on mutation success, disable while pending, surface errors via toast.

#### 🟠 `HIGH` — Join-by-trip-code is a setTimeout stub: accepts any 6-char string, fakes 'Ride Found', navigates without verifying

**Files:** `src/components/screens/JoinRideScreen.tsx:18`, `src/components/screens/JoinRideScreen.tsx:25`, `src/components/screens/JoinRideScreen.tsx:26`, `src/components/screens/JoinRideScreen.tsx:32`  
**What's pending:** handleJoinRideWithCode shows a fake 'Searching' toast, waits 1500ms, then unconditionally navigates to /ride/<code> with a '🎉 Ride Found!' toast for any non-empty input. No API call, no validation. Self-documented as a placeholder.  
**Suggested fix:** Resolve the code via the rides API, only navigate on a real match, call ridesApi.join on success, and show an error for invalid codes.

#### 🟠 `HIGH` — Ride Details always renders the same hardcoded mock ride regardless of :id (mock mode is default)

**Files:** `src/components/screens/RideDetailsScreen.tsx:28`, `src/hooks/useRides.ts:7`, `src/hooks/useRides.ts:40`, `src/hooks/useRides.ts:44`, `src/data/rideDetails.ts:1`  
**What's pending:** USE_MOCK defaults true and useRideById returns null in mock mode, so the screen falls back to a single static mockRideDetails ('Nandi Sunrise Sprint') for every route param. Comments/media (getComments/getMedia) are never fetched.  
**Suggested fix:** In mock mode look up the ride by id from a keyed map; in real mode fetch and map the backend ride DTO, and load comments/media.

#### 🟠 `HIGH` — Entire Explore module is mock-only — every action handler is a console.log stub; socialApi never called

**Files:** `src/components/screens/ExploreScreen.tsx:26`, `src/components/screens/ExploreScreen.tsx:157-209`, `src/data/explore.ts:4`, `src/services/api.ts:188`  
**What's pending:** Connect/Invite/Follow/Join Crew/Create Crew/Register/Publish Story/Filter etc. only console.log (14 stubs). Data comes from hardcoded src/data/explore.ts and inline arrays; socialApi.suggestions/connectionAction/etc. are called by zero screens.  
**Suggested fix:** Replace stubs with real socialApi calls (connectionAction, suggestions, getConnections), load data via React Query, surface success/error via toast, and remove the console.logs.

#### 🟠 `HIGH` — ProfileScreen shows hardcoded 'Alex Kumar' mock; never fetches the logged-in user (read path mocked)

**Files:** `src/components/screens/ProfileScreen.tsx:13`, `src/components/screens/ProfileScreen.tsx:16-23`, `src/components/screens/ProfileScreen.tsx:27-42`, `src/services/api.ts:125`  
**What's pending:** State is seeded from DEFAULT_PROFILE/STATS/STREAKS/ACHIEVEMENTS/RECENT_RIDES/CHALLENGES; profileApi.getMyProfile() is never called. Only updateProfile (Save) is wired, so edits don't reflect on reload and every user sees the same fake profile.  
**Suggested fix:** Fetch profileApi.getMyProfile() on mount via React Query, seed form state from it, and source stats/achievements/streaks from the API (or hide unsupported sections).

#### 🟠 `HIGH` — Notifications screen and header badge use hardcoded mock; no notifications API exists

**Files:** `src/components/screens/NotificationsScreen.tsx:7`, `src/components/screens/NotificationsScreen.tsx:10`, `src/components/GlobalHeader.tsx:2`, `src/components/GlobalHeader.tsx:56`  
**What's pending:** State seeded from MOCK_NOTIFICATIONS; mark-read/mark-all only mutate local state (no persistence). The header unread badge is derived from the same mock, so it's a fixed fake number. No notifications endpoint exists in api.ts.  
**Suggested fix:** Add notifications endpoints (list + mark-read), fetch via React Query, and pass real unread count into GlobalHeader.

#### 🟠 `HIGH` — Route/Ride Discovery screen uses getMockRideData with a fake 1s setTimeout, no API

**Files:** `src/components/screens/RideDiscoveryScreen.tsx:21`, `src/components/screens/RideDiscoveryScreen.tsx:30`, `src/components/screens/RideDiscoveryScreen.tsx:36`, `src/components/screens/RideDiscoveryScreen.tsx:175-181`  
**What's pending:** Routed at /route-discovery and /route-discovery/:id; loads header/stops/talks/photos/groups/tips from getMockRideData(id) with a hardcoded 1000ms setTimeout instead of ridesApi.getById/getComments/getMedia. Share Route button is a no-op; Plan This Route drops the route id.  
**Suggested fix:** Fetch via ridesApi.getById/getComments/getMedia, drive loading from query state, and implement/remove Share Route.

#### 🟡 `MEDIUM` — All MyRidesScreen action buttons are no-ops (Leave, View, Details, Edit, Share, empty-state CTAs)

**Files:** `src/components/screens/MyRidesScreen.tsx:66`, `src/components/screens/MyRidesScreen.tsx:71`, `src/components/screens/MyRidesScreen.tsx:75`, `src/components/screens/MyRidesScreen.tsx:113`, `src/components/screens/MyRidesScreen.tsx:136`  
**What's pending:** Zero onClick handlers in the entire file; the screen looks interactive but is read-only. Users can't leave/view/edit/share rides or use the Discover/Plan CTAs.  
**Suggested fix:** Wire View/Details→navigate(`/ride/${id}`), Edit→plan-ride prefilled, Share→copy link, Leave→leave-ride mutation, CTAs→navigate('/') and '/plan-ride'.

#### 🟡 `MEDIUM` — LocationPlannerScreen search box and route-type filter do nothing; planner buttons dead

**Files:** `src/components/screens/LocationPlannerScreen.tsx:13-14`, `src/components/screens/LocationPlannerScreen.tsx:77-97`, `src/components/screens/LocationPlannerScreen.tsx:119`  
**What's pending:** searchQuery/selectedFilter are never used to filter popularDestinations — all 3 hardcoded destinations always render. Plan Route, View Details, Custom Route Builder, Nearby Attractions, Difficulty Calculator have no handlers. Fully inline mock, no API.  
**Suggested fix:** Filter popularDestinations by search/category before mapping; wire or remove dead buttons; back with a real endpoint.

#### 🟡 `MEDIUM` — NotificationsScreen per-notification action buttons are dead (no handler/navigation)

**Files:** `src/components/screens/NotificationsScreen.tsx:95-100`, `src/components/screens/NotificationsScreen.tsx:141-147`  
**What's pending:** Each 'View Ride'/'View Details'/'Join Now' button has no onClick; only the row marks itself read. The read-section action button is also a no-op.  
**Suggested fix:** Attach onClick navigating by notification type/payload (e.g. navigate(`/ride/${id}`)); back with a real notifications API.

#### 🟡 `MEDIUM` — PlanRideScreen doesn't reset the form or navigate after a successful publish (double-submit risk)

**Files:** `src/components/screens/PlanRideScreen.tsx:165`, `src/components/screens/PlanRideScreen.tsx:168`, `src/hooks/useRides.ts:72`  
**What's pending:** onSuccess only fires a toast; it doesn't reset formData/pitStops/rules, clear formErrors, or navigate. User stays on a filled form and can resubmit (button only disabled during isPending). New ride's detail cache isn't seeded.  
**Suggested fix:** In onSuccess reset form state and navigate to the new ride / My Rides; optionally setQueryData for the new ride.

#### 🟡 `MEDIUM` — PlanRideScreen validation errors are computed but never shown inline (formErrors prop is dead)

**Files:** `src/components/screens/PlanRideScreen.tsx:34`, `src/components/screens/PlanRideScreen.tsx:155`, `src/components/ride-planning/BasicInfo.tsx:17`  
**What's pending:** setFormErrors(result.errors) populates a map never passed to any child (BasicInfo/RouteDetails don't accept an errors prop). Only the first error shows as a transient toast; per-field feedback is invisible.  
**Suggested fix:** Pass formErrors into the field components and render per-field messages, or remove the dead state.

#### 🟡 `MEDIUM` — Plan-a-Ride screen shows inline mock user stats and 'from database' popular routes

**Files:** `src/components/screens/PlanRideScreen.tsx:38`, `src/components/screens/PlanRideScreen.tsx:46`  
**What's pending:** Write path (useCreateRide) is real, but the UserStats widget and the 'Pre-planned popular routes from database' list are hardcoded inline objects — the comment claims a DB source that doesn't exist.  
**Suggested fix:** Source userStats from profileApi.getMyProfile() and popularRoutes from a backend endpoint; remove the misleading comment.

#### 🟡 `MEDIUM` — No in-app logout — logout() is defined but never called or rendered anywhere

**Files:** `src/contexts/AuthContext.tsx:78`, `src/components/app-sidebar.tsx:17`, `src/components/screens/ProfileScreen.tsx`, `src/components/GlobalHeader.tsx`  
**What's pending:** AuthContext exposes a working logout() (authApi.logout, clears token+user) but no sidebar/header/profile control calls it; grep for `.logout(` only matches the definition. Once signed in there is no in-app way to sign out.  
**Suggested fix:** Add a logout button (sidebar footer/ProfileScreen/header) that calls useAuth().logout() then navigate('/auth').

#### 🟡 `MEDIUM` — /admin route is guarded but has no UI entry point

**Files:** `src/App.tsx:67`, `src/components/app-sidebar.tsx:17`, `src/components/MobileBottomNav.tsx:6`  
**What's pending:** Nothing navigates to /admin; sidebar menuItems and MobileBottomNav have no admin link and no navigate('/admin') exists. Admins must type the URL, and /admin renders outside AppLayout (no chrome).  
**Suggested fix:** Conditionally render an 'Admin' nav entry when isAdmin is true, linking to /admin.

#### 🟡 `MEDIUM` — LocationPlanner and TravelDiary screens are routed but fully inline-mock with no API

**Files:** `src/components/screens/LocationPlannerScreen.tsx:16`, `src/components/screens/TravelDiaryScreen.tsx:15`, `src/App.tsx:77`, `src/App.tsx:78`  
**What's pending:** Both render entirely from inline hardcoded arrays and never touch services/api.ts; no diary/destinations endpoints exist.  
**Suggested fix:** Wire to real endpoints or mark not-yet-implemented; at minimum move inline data to src/data and add a fetch path.

#### ⚪ `LOW` — useCreateRide success leaves stale form and stranded user; no cache seeded for new ride

**Files:** `src/components/screens/PlanRideScreen.tsx:165`, `src/components/screens/PlanRideScreen.tsx:168`, `src/hooks/useRides.ts:72`  
**What's pending:** Mutation invalidates ['rides'] but onSuccess only toasts — no form reset, no navigation, no setQueryData for the new ride. Invites accidental duplicate submissions.  
**Suggested fix:** Reset form state and navigate in onSuccess; optionally seed the new ride's detail cache.

#### ⚪ `LOW` — PlanRideScreen 'Preview' button does nothing

**Files:** `src/components/screens/PlanRideScreen.tsx:236`  
**What's pending:** The Preview button in the fixed bottom bar has no onClick — a dead control beside the working Publish.  
**Suggested fix:** Implement a preview modal/route or hide the button until the feature exists.

#### ⚪ `LOW` — RideDetails 'Group Chat' button is a no-op after joining

**Files:** `src/components/screens/RideDetailsScreen.tsx:346`  
**What's pending:** Post-join action row's 'Group Chat' has no onClick (Contact Organizer works via tel: link, Group Chat doesn't).  
**Suggested fix:** Wire to a chat route/feature or remove until implemented.

#### ⚪ `LOW` — TravelDiaryScreen is fully mock; New Entry button and photo grid non-functional

**Files:** `src/components/screens/TravelDiaryScreen.tsx:79-82`, `src/components/screens/TravelDiaryScreen.tsx:192-197`  
**What's pending:** Renders hardcoded diaryEntries/stats; New Entry has no onClick; Photos tab always renders 12 placeholder squares unrelated to real counts; like/comment/share non-interactive; no API.  
**Suggested fix:** Wire New Entry to a creation flow, render photos from real data, load entries/stats from the backend.

#### ⚪ `LOW` — RideDiscoveryScreen Share Route button is a no-op; Plan This Route drops the route id

**Files:** `src/components/screens/RideDiscoveryScreen.tsx:21`, `src/components/screens/RideDiscoveryScreen.tsx:36`, `src/components/screens/RideDiscoveryScreen.tsx:175-181`  
**What's pending:** All tabs fed getMockRideData; Share Route has no onClick; Plan This Route navigates to /plan-ride without the route id.  
**Suggested fix:** Fetch real ride via ridesApi.getById(id); implement/remove Share Route; pass the route id to plan-ride.

#### ⚪ `LOW` — AllRidersPage 'Connect' button has an empty handler; NearbyRiderCard Quick Chat & InviteSystem QR are dead

**Files:** `src/components/explore/sections/AllRidersPage.tsx:302`, `src/components/explore/cards/NearbyRiderCard.tsx:260`, `src/components/screens/ExploreScreen.tsx:339`, `src/components/explore/sections/InviteSystem.tsx:162`  
**What's pending:** AllRidersPage Connect onClick only stopsPropagation with a `// Handle connect` comment (no onConnect prop). NearbyRiderCard's Quick Chat calls onQuickChat?.() but ExploreScreen never passes onQuickChat/onViewProfile, so it silently does nothing for active/looking riders. InviteSystem 'Generate QR Code' only console.logs — no QR is produced.  
**Suggested fix:** Add onConnect/onQuickChat/onViewProfile wiring from ExploreScreen (to socialApi/modals); render a real QR for inviteLink or hide the button.

#### ⚪ `LOW` — forgotPassword/resetPassword API methods exist but have no UI — reset flow unreachable

**Files:** `src/services/api.ts:111-120`, `src/components/screens/AuthScreen.tsx:105-114`  
**What's pending:** authApi.forgotPassword/resetPassword are defined but never called; AuthScreen has no 'Forgot password?' link and App.tsx has no /reset-password route. A user cannot initiate or complete a reset.  
**Suggested fix:** Add a 'Forgot password?' link + screen and a /reset-password route reading the token from query, or remove the unused methods.

#### ⚪ `LOW` — adminApi.deleteRide is defined but never wired to any UI control

**Files:** `src/components/screens/AdminScreen.tsx:40`  
**What's pending:** deleteRide is defined but never referenced; RidesTab only wires a Cancel button. The backend-audit 'admin cannot delete rides' is still unaddressed on the FE; the DELETE call is dead code.  
**Suggested fix:** Add a Delete button wired to a deleteRide mutation, or remove the unused definition.

### 3. API / Backend Contract Mismatches (8)

#### 🟠 `HIGH` — useRideById API data force-cast to the deeply-nested mock shape will crash on a real backend response

**Files:** `src/hooks/useRides.ts:40`, `src/hooks/useRides.ts:45`, `src/components/screens/RideDetailsScreen.tsx:23`, `src/components/screens/RideDetailsScreen.tsx:28`, `src/components/screens/RideDetailsScreen.tsx:31`  
**What's pending:** useRideById returns raw res.data (Record<string,unknown>) with no transform; RideDetailsScreen does `(apiRide as typeof mockRideDetails) ?? mockRideDetails` then accesses ride.reviews.reduce, ride.costs.total, ride.weather.*, ride.safetyGear, ride.schedule, ride.route.roadConditions. With VITE_USE_MOCK=false and a truthy apiRide, line 31 throws 'cannot read properties of undefined'.  
**Suggested fix:** Map the backend ride DTO to the RideDetail view model before use; drop the `as typeof mockRideDetails` assertion.

#### 🟠 `HIGH` — Admin System tab API Server health card always shows 'unreachable' (reads .data on a flat response)

**Files:** `src/components/screens/AdminScreen.tsx:508`, `src/components/screens/AdminScreen.tsx:514`, `src/components/screens/AdminScreen.tsx:537-559`  
**What's pending:** /api/health returns a flat object ({status, uptime, memory, database}) with no data wrapper, but the System tab reads healthRes.data, which is always undefined — the API card permanently renders the red 'API server unreachable' state.  
**Suggested fix:** Read flat fields (healthRes.status/uptime/memory) and fix the HealthData type, or wrap the backend payload in sendSuccess.

#### 🟠 `HIGH` — Admin System tab Database health card always shows 'unreachable' (same .data unwrap bug)

**Files:** `src/components/screens/AdminScreen.tsx:515`, `src/components/screens/AdminScreen.tsx:573-597`  
**What's pending:** /api/health/db returns flat {status, connected, latency_ms, pool}; the component reads dbRes.data (undefined), so the DB card always shows 'Database unreachable' and never displays connected/latency/pool.  
**Suggested fix:** Read dbRes directly (dbRes.connected/pool/latency_ms) or wrap the backend DB-health payload in sendSuccess.

#### 🟠 `HIGH` — Join-by-code navigates to /ride/:id using the trip CODE as the ride id

**Files:** `src/components/screens/JoinRideScreen.tsx:32`, `src/App.tsx:74`, `src/hooks/useRides.ts:40`, `src/services/api.ts:150`  
**What's pending:** A 6-char trip code is passed straight into /ride/<code> → useRideById → GET /api/rides/<code>. The backend getById expects a numeric id, so a real join-by-code 404s or loads the wrong ride; the code is never resolved to a ride id.  
**Suggested fix:** Add a trip-code lookup endpoint, resolve code→id before navigating, or accept trip codes on the backend route.

#### 🟡 `MEDIUM` — useRides casts raw API Record<string,unknown> to Ride[]/MyRide[] via `as unknown as`, defeating type safety

**Files:** `src/hooks/useRides.ts:12`, `src/hooks/useRides.ts:18`, `src/hooks/useRides.ts:24`, `src/hooks/useRides.ts:30`, `src/services/api.ts:143`  
**What's pending:** ridesApi.list() is typed ApiResponse<Record<string,unknown>[]> and useRides does `(res.data||[]) as unknown as Ride[]` (×4). Backend likely returns snake_case (start_date, participant_count) vs camelCase Ride (date, joinedCount), so on the real path every ride.joinedCount/organizer is undefined — but the cast hides it. No mapping/validation layer exists.  
**Suggested fix:** Add a mapper (zod or explicit field mapping) from snake_case payload to Ride/MyRide and remove the `as unknown as` casts.

#### 🟡 `MEDIUM` — Admin updateRideStatus enum mismatch with the actual ride status domain

**Files:** `src/components/screens/AdminScreen.tsx:38-39`, `src/components/screens/AdminScreen.tsx:390-398`  
**What's pending:** Backend admin schema accepts ['upcoming','active','completed','cancelled'] but the real domain is ['scheduled','ongoing','completed','cancelled']. The FE correctly keys on 'scheduled'/'ongoing', so any future status update to those would be rejected (400) while 'upcoming'/'active' are never used.  
**Suggested fix:** Align the backend UpdateRideStatusSchema enum to ['scheduled','ongoing','completed','cancelled'].

#### ⚪ `LOW` — api.ts types all payloads as Record<string,unknown>/ApiResponse<T>, hiding contract drift at compile time

**Files:** `src/services/api.ts:86`, `src/services/api.ts:124`, `src/services/api.ts:140`, `src/services/api.ts:188`  
**What's pending:** profileApi/ridesApi/socialApi/healthApi return untyped envelopes; the data-wrapper assumption and per-endpoint shape mismatches compile cleanly and only fail at runtime.  
**Suggested fix:** Define concrete response interfaces matching the real (flat) backend shapes and remove the unknown casts.

#### ⚪ `LOW` — AdminScreen metrics panel typed ApiResponse but endpoint returns a raw object

**Files:** `src/components/screens/AdminScreen.tsx:514`, `src/services/api.ts:86`  
**What's pending:** /api/admin/metrics returns a raw object (no status field) while healthApi.metrics is typed ApiResponse<Record>; the panel mostly works by dumping raw JSON but the type is wrong.  
**Suggested fix:** Fix the healthApi.metrics return type to match the raw metrics object.

### 4. Home / Discovery Filters & Sorting (silently non-functional) (9)

#### 🟠 `HIGH` — Distance Range filter is never applied (slider does nothing)

**Files:** `src/components/screens/HomeScreen.tsx:30`, `src/components/home/DrawableFilters.tsx:142`, `src/components/home/ActiveFilters.tsx:53`, `src/hooks/useFilters.ts:19`  
**What's pending:** filters.range is rendered, shown as an active chip, and counted in activeFiltersCount, but filteredRides never checks any ride field against it. Dragging the slider changes nothing in the list.  
**Suggested fix:** Add a range predicate in filteredRides (e.g. parse ride.distanceFromUser/distance and compare to range[0]/range[1]); document which field range applies to.

#### 🟠 `HIGH` — Bike CC filter is a no-op: reads ride.minimumCC which doesn't exist on the Ride type

**Files:** `src/components/screens/HomeScreen.tsx:38`, `src/components/screens/HomeScreen.tsx:40`, `src/types/index.ts:3`, `src/data/rides.ts:3`  
**What's pending:** The CC predicate reads ride.minimumCC, but minimumCC only exists nested under RideDetail.bikeRequirements (types/index.ts:64) and is absent on every AVAILABLE_RIDES entry. The `!ride.minimumCC` short-circuit is always true, so the filter matches every ride. tsc would flag TS2339 but tsc isn't run.  
**Suggested fix:** Add minimumCC to the Ride type and data (removing the escape hatch), or remove the CC filter UI until the backend supplies the field.

#### 🟡 `MEDIUM` — Sort 'Earliest Date' breaks on Today/Tomorrow labels (Invalid Date / NaN)

**Files:** `src/components/screens/HomeScreen.tsx:62`, `src/data/rides.ts:7`  
**What's pending:** Sort compares new Date(a.date).getTime(), but ride.date is a human label ('Today, 6:00 AM', 'Tomorrow, 5:30 AM', 'Jan 8, 7:00 AM'). Today/Tomorrow parse to Invalid Date (NaN) and 'Jan 8' defaults to the current JS year, so chronological order is unreliable.  
**Suggested fix:** Store a real ISO timestamp on rides and sort on that instead of parsing display strings.

#### 🟡 `MEDIUM` — Group Size filter uses current joinedCount and hides empty/over-full rides by default

**Files:** `src/components/screens/HomeScreen.tsx:46`, `src/constants/index.ts:35`  
**What's pending:** matchesGroupSize filters on ride.joinedCount, not capacity. With default [1,20], any ride with 0 joined is excluded (0>=1 false) and any past 20 is excluded even though the user never narrowed it. New API rides (joinedCount 0) silently drop off Home.  
**Suggested fix:** Filter against capacity (maxRiders) or lower the default lower bound to 0; clarify whether the control means current riders or max capacity.

#### 🟡 `MEDIUM` — Rides queries consumed with no error handling — backend failures look like an empty state

**Files:** `src/components/screens/HomeScreen.tsx:15`, `src/components/screens/MyRidesScreen.tsx:13`, `src/components/screens/MyRidesScreen.tsx:14`, `src/components/screens/MyRidesScreen.tsx:15`  
**What's pending:** Both screens read only data (default []) and at most isLoading, never isError/error. On a real-API failure the query's [] renders 'No rides found' / 'No upcoming rides' as if the user legitimately has none — indistinguishable from an outage, with no retry.  
**Suggested fix:** Read isError/error and render a distinct error state with retry; distinguish empty-data from fetch-failure.

#### ⚪ `LOW` — 'View All N Previous Trips' button caps at 5 and never shows all

**Files:** `src/components/ride-details/PreviousTripsSection.tsx:58`, `src/components/ride-details/PreviousTripsSection.tsx:171`  
**What's pending:** Label reads 'View All {totalCompletedTrips}' (e.g. 24) but the list is sliced to slice(0, showAll ? 5 : 2), so at most 5 ever render — misleading.  
**Suggested fix:** Render all trips when expanded (or paginate), or change the label to reflect the count actually shown.

#### ⚪ `LOW` — Ride can be published with empty Max Riders (validation refine allows blank)

**Files:** `src/lib/validations.ts:19`, `src/components/ride-planning/RouteDetails.tsx:47`  
**What's pending:** maxRiders uses .refine((val) => !val || (2..50)); the `!val ||` clause lets an empty value pass, so a ride can be created with no cap. Downstream joinedCount===maxRiders 'Full'/waitlist logic misbehaves with NaN.  
**Suggested fix:** Make maxRiders required (drop `!val ||`) or supply a default before publish.

#### ⚪ `LOW` — Ride-type emoji map duplicated and inconsistent between filter pills and ride cards

**Files:** `src/components/home/RideFilters.tsx:11`, `src/lib/rideUtils.ts:28`  
**What's pending:** rideUtils.getRideTypeEmoji maps Breakfast→🌅, Scenic→🌄; RideFilters.getFilterEmoji maps Breakfast→🍳, Scenic→🌅. The same type shows different emoji on pill vs card.  
**Suggested fix:** Move a single emoji map to rideUtils/constants and consume from both.

#### ⚪ `LOW` — SearchFilters.tsx is dead code duplicating DrawableFilters and inline filter-count logic

**Files:** `src/components/home/SearchFilters.tsx:33`, `src/components/home/SearchFilters.tsx:83`  
**What's pending:** 300+ line file never imported (HomeScreen uses DrawableFilters). Duplicates sort/CC/duration/rideType lists and re-implements getActiveFiltersCount; imports an unused Calendar icon.  
**Suggested fix:** Delete SearchFilters.tsx, or refactor it to consume useFilters and shared option lists if a popover variant is still wanted.

### 5. Auth & Security (7)

#### 🟡 `MEDIUM` — No production security headers / CSP — vite headers are dev-server-only, vercel.json has none

**Files:** `vite.config.ts:10-15`, `vercel.json:1`, `index.html:11-13`  
**What's pending:** X-Content-Type-Options/X-Frame-Options/X-XSS-Protection/Referrer-Policy live under server.headers (dev only) and never ship to prod. vercel.json has only a SPA rewrite; index.html has only X-UA-Compatible + referrer meta. Zero CSP anywhere — the deployed token-in-memory SPA has no clickjacking/XSS defense-in-depth.  
**Suggested fix:** Add a headers block to vercel.json (X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Content-Security-Policy) for all production routes.

#### 🟡 `MEDIUM` — Expired refresh token leaves user stuck on protected screens — no global 401 → logout/redirect

**Files:** `src/services/api.ts:53`, `src/contexts/AuthContext.tsx:93`, `src/App.tsx:17`  
**What's pending:** On unrecoverable 401, request() throws ApiError(401) but nothing clears AuthContext; user stays set, isAuthenticated stays true, and ProtectedRoute keeps rendering screens that re-throw 401s. The user sees a broken/empty screen instead of being bounced to /auth.  
**Suggested fix:** On unrecoverable 401, dispatch a global event/callback that calls AuthContext.logout(); ProtectedRoute then redirects to /auth.

#### ⚪ `LOW` — Admin gating relies on a client-side hand-rolled JWT base64 decode of an unverified payload

**Files:** `src/contexts/AuthContext.tsx:37-45`, `src/contexts/AuthContext.tsx:94`, `src/App.tsx:24-30`  
**What's pending:** On session restore, role is read by manual base64-decode and isAdmin = role==='admin' gates AdminRoute/AdminScreen. A tampered/invalid-signature token flips the client UI to admin locally before any server call; a missing/renamed role claim silently disables admin. Safe only if every /api/admin/* route enforces role server-side (backend audit flags this as per-handler, not central).  
**Suggested fix:** Treat client role as a UI hint only; enforce admin centrally on the backend; optionally have the refresh endpoint return a verified user object.

#### ⚪ `LOW` — Auth inputs (email/password) not validated with Zod — only a minimal inline length check

**Files:** `src/components/screens/AuthScreen.tsx:22-35`, `src/lib/validations.ts:1-48`  
**What's pending:** validations.ts has only rideFormSchema — no auth/email/password schema. AuthScreen does `if(!email||!password) return;` plus a single signup password.length<8 check; login uses minLength=1. No JS email-format check, no max-length cap (oversized-payload DoS), no trimming.  
**Suggested fix:** Add an authSchema (z.string().email(), password min(8).max(128)) and safeParse in handleSubmit before login/signup; cap lengths.

#### ⚪ `LOW` — user.id typed number but JWT sub claim is commonly a string — type mismatch on restored session

**Files:** `src/contexts/AuthContext.tsx:5`, `src/contexts/AuthContext.tsx:41`  
**What's pending:** Fresh login sets id:number from the server; session-restore sets id from payload.sub (string by JWT spec). After reload the same user can have id as a string while User declares id:number, breaking numeric comparisons/APIs (e.g. socialApi.mutuals(userId:number)).  
**Suggested fix:** Coerce on decode: id: Number(payload.sub); confirm the backend signs sub consistently.

#### ⚪ `LOW` — AuthContext decodes JWT into an implicit-any payload; missing role silently disables admin

**Files:** `src/contexts/AuthContext.tsx:40`, `src/contexts/AuthContext.tsx:41`, `src/contexts/AuthContext.tsx:94`  
**What's pending:** JSON.parse(atob(...)) yields any; setUser reads sub/email/role with no guard. A token missing role makes isAdmin false silently; a wrong sub type flows into User.id unchecked. Fails closed (no escalation) but is an untyped trust boundary.  
**Suggested fix:** Type the decoded payload ({sub:number;email:string;role?:string}) and validate required claims before setUser.

#### ⚪ `LOW` — Invite/share links built from window.location.origin without validation or encoding

**Files:** `src/components/explore/sections/InviteSystem.tsx:27-28`, `src/components/home/RideCard.tsx:53-56`  
**What's pending:** Shareable links use `${window.location.origin}/invite/${code}` and origin + `/ride/${id}`; origin reflects whatever host served the page (host-header trust), and userInviteCode is interpolated unencoded.  
**Suggested fix:** Derive share URLs from a configured public base (VITE_PUBLIC_URL) and encodeURIComponent the code/id.

### 6. Types & Type Safety (8)

#### ⚪ `LOW` — Local Mentor / NearbyRider interfaces have drifted from the centralized types/index.ts versions

**Files:** `src/components/explore/cards/MentorHighlightCard.tsx:6`, `src/types/index.ts:239`, `src/components/explore/cards/NearbyRiderCard.tsx:8`, `src/types/index.ts:204`  
**What's pending:** Central Mentor requires quote and required isFollowing with achievement value:string/icon no-props; local Mentor has no quote, optional isFollowing, value:string|number, icon with className. Central NearbyRider lacks bio/lastRideLocation/mutualConnections that the local copy defines. The 'single source of truth' is fictional and passing one to the other type-errors or loses fields.  
**Suggested fix:** Reconcile central types to the actual fields used, delete the local re-declarations, and import from @/types.

#### ⚪ `LOW` — FilterOptions interface duplicated in 4 places (3 components + central) instead of imported

**Files:** `src/types/index.ts:332`, `src/components/home/SearchFilters.tsx:19`, `src/components/home/DrawableFilters.tsx:18`, `src/components/home/ActiveFilters.tsx:5`  
**What's pending:** FilterOptions is central (and imported by useFilters) but re-declared verbatim in three filter components. Shapes match today but any change to the central type silently diverges across copies — defeating the centralization the prior audit claimed (FIX-09).  
**Suggested fix:** Delete the three local declarations and `import type { FilterOptions } from '@/types'`.

#### ⚪ `LOW` — ExploreScreen passes a StoryContent handler incompatible with StoryCreator's onPublish signature

**Files:** `src/components/screens/ExploreScreen.tsx:435`, `src/components/explore/stories/StoryCreator.tsx:13`, `src/types/index.ts:303`  
**What's pending:** Two StoryContent shapes exist; StoryCreator's local one makes text optional while handlePublishStory requires text. tsc reports TS2322 — the publish handler can receive a story with no text it assumes is present. ExploreScreen is a live routed screen.  
**Suggested fix:** Use a single StoryContent type from @/types in both, and make text required or guard for its absence.

#### ⚪ `LOW` — useFilters initializes from DEFAULT_FILTERS `as const`; readonly tuples aren't assignable to number[]

**Files:** `src/hooks/useFilters.ts:6`, `src/hooks/useFilters.ts:51`, `src/constants/index.ts:31`  
**What's pending:** DEFAULT_FILTERS as const makes range readonly [0,100]/groupSize readonly [1,20], but FilterOptions uses mutable number[]; spreading into useState/setFilters yields TS2345. Runtime is fine, but invisible only because tsc is broken, and in-place mutation of frozen arrays would be a footgun.  
**Suggested fix:** Remove `as const` (or type DEFAULT_FILTERS as FilterOptions), or change FilterOptions tuples to readonly number[].

#### ⚪ `LOW` — clearAllFilters ignores initialFilters passed to useFilters

**Files:** `src/hooks/useFilters.ts:5`, `src/hooks/useFilters.ts:50`  
**What's pending:** useFilters seeds with {...DEFAULT_FILTERS, rideType:[], ...initialFilters} but clearAllFilters resets to {...DEFAULT_FILTERS, rideType:[]}, discarding initialFilters. Any future consumer passing initial filters won't return to its baseline on clear (no live impact today since HomeScreen passes none).  
**Suggested fix:** Capture initialFilters (ref) and reset to include them, or document that clear resets to global defaults.

#### ⚪ `LOW` — QuickChatModal renders msg.metadata fields that are possibly-undefined and typed unknown

**Files:** `src/components/explore/modals/QuickChatModal.tsx:248`, `src/components/explore/modals/QuickChatModal.tsx:249`, `src/components/explore/modals/QuickChatModal.tsx:250`  
**What's pending:** Accesses msg.metadata.<field> and renders directly; tsc reports TS18048 (metadata possibly undefined) and TS2322 (unknown not a ReactNode). strictNullChecks:false hides it; component is orphaned so latent, broken if ever wired.  
**Suggested fix:** Guard msg.metadata and give it a concrete type (ChatMessageMetadata), or delete the dead component.

#### ⚪ `LOW` — useToast effect lists [state] as dep, re-subscribing the listener on every state change

**Files:** `src/hooks/use-toast.ts:174`, `src/hooks/use-toast.ts:182`  
**What's pending:** The subscription effect pushes/removes setState in module-level listeners but depends on [state], so every toast update re-runs it (splice out + push back) — the known upstream shadcn bug; should be [].  
**Suggested fix:** Change the dependency array from [state] to [] so the listener registers once per mount.

#### ⚪ `LOW` — CommunityPostCard imports non-existent lucide icon 'SwipeUp' and passes post.id where a userId is expected

**Files:** `src/components/explore/cards/CommunityPostCard.tsx:3`, `src/components/explore/cards/CommunityPostCard.tsx:116`  
**What's pending:** Imports SwipeUp (not a lucide-react export — TS2305; build would throw if live), and onViewProfile?.(post.id) passes the post id where a user id is expected, so view-profile would open the wrong profile once wired. Currently orphaned.  
**Suggested fix:** Remove the SwipeUp import; pass the author's user id to onViewProfile.

### 7. Performance & Quality (dead code, duplication, stale audit claims) (15)

#### 🟡 `MEDIUM` — 15 of 25 explore components are dead code (0 imports), including all 4 modals and AllRidersPage

**Files:** `src/components/explore/modals/RiderProfileModal.tsx:1`, `src/components/explore/modals/QuickChatModal.tsx:1`, `src/components/explore/modals/PostDetailModal.tsx:1`, `src/components/explore/modals/RouteDetailsModal.tsx:1`, `src/components/explore/sections/AllRidersPage.tsx:1`, `src/components/explore/cards/CommunityPostCard.tsx:1`, `src/components/explore/cards/GearReviewCard.tsx:1`, `src/components/explore/cards/RidingTipsCard.tsx:1`  
**What's pending:** AllRidersPage, CommunityChallengeCard, CommunityPostCard, ContentSectionCarousel, EventCard, GearReviewCard, PostDetailModal, QuickChatModal, RiderMatchCard, RideRouteCard, RiderProfileModal, RiderSpotlightCard, RidingTipsCard, RouteDetailsModal, TrendingRideCard are imported nowhere. The entire view-profile/quick-chat/connect/invite/browse-all/route-details UX surface is unreachable.  
**Suggested fix:** Either wire the modals/pages into ExploreScreen (open from NearbyRiderCard's onViewProfile/onQuickChat) or delete the unused components.

#### 🟡 `MEDIUM` — PostDetailModal.tsx and RouteDetailsModal.tsx are corrupted/truncated at the top — tsc fails on them

**Files:** `src/components/explore/modals/PostDetailModal.tsx:1`, `src/components/explore/modals/PostDetailModal.tsx:46`, `src/components/explore/modals/RouteDetailsModal.tsx:1`, `src/components/explore/modals/RouteDetailsModal.tsx:319`  
**What's pending:** PostDetailModal (45 lines) starts mid-JSX with no imports/component decl and references undeclared symbols; RouteDetailsModal begins inside a mock object literal. Together they produce ~25 tsc parse errors and survive vite build only because they're orphaned. Importing either breaks the build.  
**Suggested fix:** Restore the missing top of each file (imports/interface/component) or delete them if the features are abandoned.

#### ⚪ `LOW` — AUDIT_REPORT claims TS strict mode + React-Query migration done, but Explore is untouched and root tsconfig isn't strict

**Files:** `AUDIT_REPORT.md:179`, `AUDIT_REPORT.md:209`, `tsconfig.json:12`, `src/components/screens/ExploreScreen.tsx:26`  
**What's pending:** FIX-01/FIX-22 are marked done, but root tsconfig has noImplicitAny/strictNullChecks/noUnused* off, and React Query is only in useRides/Home/MyRides — the whole Explore module still runs on hardcoded mock with no useQuery/useMutation. The 'all resolved' framing is stale for Explore.  
**Suggested fix:** Treat the prior audit's 'resolved' status as stale for Explore; migrate ExploreScreen to React Query + socialApi and reconcile the strictness claim.

#### ⚪ `LOW` — console.log/console.error left in shipped components (14 Explore stubs + StoryViewer + InviteSystem)

**Files:** `src/components/screens/ExploreScreen.tsx:158-208`, `src/components/explore/stories/StoryViewer.tsx:94`, `src/components/explore/sections/InviteSystem.tsx:36`  
**What's pending:** 14 console.log stubs in ExploreScreen plus StoryViewer logging reply text and InviteSystem logging copy failures ship to production — data leakage and noise.  
**Suggested fix:** Remove the stub console.logs; keep only intentional error logging behind a logger util.

#### ⚪ `LOW` — getDifficultyColor still re-implemented locally in RideRouteCard with inconsistent classes (audit claimed removed)

**Files:** `src/components/explore/cards/RideRouteCard.tsx:21-29`, `src/lib/rideUtils.ts:39-47`  
**What's pending:** FIX-03 claimed removal from 6 files; RideRouteCard still defines a local copy (re-created each render) that returns DIFFERENT classes than the shared util (border variants, 'Moderate'→blue vs the util's yellow). Duplication plus an inconsistency bug.  
**Suggested fix:** Delete the local function and import getDifficultyColor from @/lib/rideUtils, reconciling the styling into the shared util.

#### ⚪ `LOW` — Status/category config objects still duplicated across 6+ cards (audit claimed centralized via useStatusConfig)

**Files:** `src/components/explore/cards/NearbyRiderCard.tsx:44-79`, `src/components/explore/cards/GearReviewCard.tsx:22-39`, `src/components/explore/cards/RidingTipsCard.tsx:15-30`, `src/components/explore/cards/CommunityInitiativeCard.tsx:20`, `src/components/explore/sections/AllRidersPage.tsx:137`, `src/components/screens/AdminScreen.tsx:390`  
**What's pending:** No useStatusConfig hook exists; each card defines its own getStatusConfig/getCategoryConfig/getStatusColor switch inside the component body (re-allocated every render), duplicating the same color-mapping across 6+ files.  
**Suggested fix:** Extract into a shared statusConfig util/hook or module-level const maps and reuse.

#### ⚪ `LOW` — Domain interfaces still defined locally in components despite audit FIX-09 'all centralized'

**Files:** `src/components/explore/cards/NearbyRiderCard.tsx:8-23`, `src/components/explore/modals/QuickChatModal.tsx:21-28`, `src/components/explore/cards/MentorHighlightCard.tsx:6`, `src/components/explore/sections/CrewFinder.tsx:10`, `src/components/explore/stories/StoryViewer.tsx:8`  
**What's pending:** NearbyRider, Message, Mentor, CrewIntent, Story (declared twice with differing shapes in StoryViewer and StoriesCarousel), StoryContent remain inline, re-introducing divergent-type duplication FIX-09 claimed to fix.  
**Suggested fix:** Move these domain interfaces to types/explore.ts and import them; deduplicate the two Story definitions.

#### ⚪ `LOW` — recharts, embla-carousel-react, date-fns are dependencies with zero app usage

**Files:** `src/components/ui/chart.tsx:2`, `src/components/ui/carousel.tsx:4`, `package.json:86`  
**What's pending:** recharts is imported only by ui/chart.tsx (never imported in src); embla only by ui/carousel.tsx (never imported — carousels are hand-rolled); date-fns has zero usages. Heavyweight unused deps and dead files.  
**Suggested fix:** Delete ui/chart.tsx + ui/carousel.tsx and remove recharts, embla-carousel-react, date-fns from package.json.

#### ⚪ `LOW` — ~20 shadcn ui primitives are never imported (dead source)

**Files:** `src/components/ui/table.tsx`, `src/components/ui/drawer.tsx`, `src/components/ui/command.tsx`, `src/components/ui/dropdown-menu.tsx`, `src/components/ui/accordion.tsx`  
**What's pending:** table, drawer, command, dropdown-menu, accordion, alert-dialog, calendar, form, menubar, pagination, resizable, navigation-menu, hover-card, input-otp, aspect-ratio, breadcrumb, collapsible, context-menu, scroll-area, switch, toggle-group, alert, chart, carousel have zero external imports — dead source that inflates the repo.  
**Suggested fix:** Remove the unused shadcn primitives.

#### ⚪ `LOW` — Explore card components lack React.memo and ExploreScreen passes fresh closures / unmemoized lists (audit claimed memoized)

**Files:** `src/components/screens/ExploreScreen.tsx:338`, `src/components/explore/cards/NearbyRiderCard.tsx:34`, `src/components/explore/cards/GearReviewCard.tsx`, `src/components/explore/cards/RidingTipsCard.tsx`, `src/components/explore/cards/CommunityPostCard.tsx`  
**What's pending:** FIX-06 claimed memoization; only home/RideCard is React.memo. List/carousel cards are unmemoized and ExploreScreen passes new handler closures + computes filteredRiders without useMemo, so the whole list re-renders on any state change (tab/search keystroke).  
**Suggested fix:** Wrap listed cards in React.memo, memoize filteredRiders with useMemo, and wrap handlers in useCallback (or remove the stubs).

#### ⚪ `LOW` — Card container class string duplicated verbatim across 9 explore cards

**Files:** `src/components/explore/cards/GearReviewCard.tsx`, `src/components/explore/cards/RideRouteCard.tsx:32`, `src/components/explore/cards/EventCard.tsx`, `src/components/explore/cards/RideMomentCard.tsx`, `src/components/explore/cards/CommunityChallengeCard.tsx`  
**What's pending:** 'bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition' is copy-pasted across 9 card files with no shared wrapper (audit 1.2 flagged this).  
**Suggested fix:** Create a shared <ExploreCard> wrapper or a cn() class constant and reuse.

#### ⚪ `LOW` — QuickChatModal message ids collide (length+1/+2 from stale closure) and Math.random in send path

**Files:** `src/components/explore/modals/QuickChatModal.tsx:111-138`, `src/components/explore/modals/QuickChatModal.tsx:275`  
**What's pending:** New message id = messages.length+1 and bot reply = +2 from a stale messages closure, so rapid sends produce duplicate ids; quick-replies use key={index}; Math.random picks a bot reply (FIX-17 claimed Math.random removed).  
**Suggested fix:** Generate ids from a ref counter or crypto.randomUUID via functional setState (prev.length).

#### ⚪ `LOW` — RouteDiscoveryScreen.tsx is unrouted dead code containing inline mock data (naming collision)

**Files:** `src/components/screens/RouteDiscoveryScreen.tsx:16`, `src/components/screens/RouteDiscoveryScreen.tsx:61`, `src/App.tsx:38`  
**What's pending:** App.tsx aliases the import name 'RouteDiscoveryScreen' to the RideDiscoveryScreen file, so the actual 231-line RouteDiscoveryScreen.tsx is never routed. It ships inline mock arrays and duplicate helpers — dead code and a confusing naming collision.  
**Suggested fix:** Delete RouteDiscoveryScreen.tsx (or route it intentionally and wire to the API); resolve the name collision.

#### ⚪ `LOW` — RideDetailsScreen forces a 1200ms artificial loading delay even on the real API path

**Files:** `src/components/screens/RideDetailsScreen.tsx:22`, `src/components/screens/RideDetailsScreen.tsx:29`, `src/components/screens/RideDetailsScreen.tsx:37`  
**What's pending:** isLoading = useSimulatedLoading(1200) || apiLoading, so every ride-detail visit is gated behind a fixed 1.2s skeleton even when the real API is faster — leftover mock scaffolding bleeding into the data path; no error state either.  
**Suggested fix:** Drop useSimulatedLoading from this screen, gate the skeleton on apiLoading only, and add an error state.

#### ⚪ `LOW` — AdminScreen parent declares an unused queryClient

**Files:** `src/components/screens/AdminScreen.tsx:94`  
**What's pending:** Top-level AdminScreen calls useQueryClient() but never uses it (invalidation happens in child tabs), subscribing the parent to query context unnecessarily.  
**Suggested fix:** Remove the unused useQueryClient() call at line 94.

---

## Rejected during verification (7)

These candidate findings were dropped because an adversarial verifier could not confirm them in current code (false positive / intentional / already handled):

- **RidesTab Cancel button gated on status 'scheduled'/'ongoing' which likely never matches backend status values** (routing-appshell) — `src/components/screens/AdminScreen.tsx:390`, `src/components/screens/AdminScreen.tsx:470`  
  _Why rejected:_ False positive. The finder's central claim — that the backend returns 'upcoming' so the 'scheduled'-gated Cancel button never matches — is contradicted by the actual backend schema. The rides table defaults status to 'scheduled' and the ride service queries 'scheduled'/'ongoing', which exactly matches AdminScreen's getStatusColor cases and the Cancel button gate. The finder conflated the rider/explore status enum ('active'|'looking'|'upcoming') with the ride status enum, and mistook a comment in backend-tasks.md Task 7's code example for the authoritative contract. The frontend strings here are correct against the live backend, so there is no contract mismatch and the Cancel button will appear for scheduled rides as intended. The cited lines literally still exist (stillPresent=true), but they are not a bug. Severity left at low to match the finder's own stated low confidence, but isReal=false.
- **Frontend reads res.data.* but backend apiSuccess returns a flat envelope with no data key** (api-contracts) — `src/services/api.ts:86`, `src/services/api.ts:21`, `src/contexts/AuthContext.tsx:31`, `src/contexts/AuthContext.tsx:60`, `src/contexts/AuthContext.tsx:70`, `src/hooks/useRides.ts:12`  
  _Why rejected:_ False positive. The finding asserts the backend spreads payload at the top level with no `data` key (via a Next.js `apiSuccess`/`NextResponse.json`), making `res.data.*` always undefined and breaking login/refresh/signup/admin. That backend does not exist in the current code. The live Express backend wraps every success response under a `data` key via sendSuccess, which is precisely what the frontend's ApiResponse<T> with `data?: T` expects. The claimed 'live breakage' (login throws on 200, refresh returns null, session lost on reload, admin blank) all rest on the false premise that res.data is undefined — it is not. The finder appears to have based the claim on a stale/incorrect backend extraction. There IS a separate, narrower real issue not covered by this finding: signup (auth.controller.ts:26) returns only {message,user} with no accessToken, while AuthContext.tsx:71 expects res.data.accessToken — but that is a different, minor bug, not the universal envelope mismatch this finding describes. As written, the issue is not real and not present, so severity is downgraded to low.
- **Signup response has no role field; user.role is undefined after signup (C5 still pending)** (api-contracts) — `src/contexts/AuthContext.tsx:68`, `src/contexts/AuthContext.tsx:71`  
  _Why rejected:_ FALSE POSITIVE. The specific issue claimed — "signup response has no role field; user.role undefined" — does not exist in the current code. The backend signup RETURNING clause explicitly includes role (auth.service.ts:22) and the response user object carries it through. The finding cites stale/imagined backend SQL that does not match the actual source. NOTE: there IS a different, real contract bug adjacent to the cited lines — AuthContext.tsx:71 reads res.data.accessToken but the signup controller (auth.controller.ts:25) returns NO accessToken (only message+user), so setAccessToken(undefined) runs after signup. But that is the "envelope/missing-token" issue, not the role issue this finding describes, and the finding explicitly argues role would STILL be undefined "even after the envelope issue is fixed," which is wrong. Severity downgraded to low since the reported defect is not present. The genuinely missing-accessToken-after-signup problem should be tracked as its own separate finding, not this one.
- **connectionAction sends targetUserId (number) + arbitrary action; backend requires targetUsername (string) + fixed enum (C1 still pending)** (api-contracts) — `src/services/api.ts:193`, `src/services/api.ts:196`  
  _Why rejected:_ The finding's severity-driving premise is contradicted by the actual current source. It claims the backend validates with targetUsername:z.string() and looks up SELECT user_id FROM profiles WHERE username = $1, so every frontend request (sending targetUserId) gets a 400. The real current backend uses targetUserId:z.coerce.number() and looks up users by id — exactly what the frontend sends. So the names and types align; there is no contract mismatch. The finding appears copied from a stale/hypothetical backend version rather than verified against current code. The only sliver of truth is a minor type-safety nicety: the frontend types action as a free string instead of the backend enum, so a future caller could pass an out-of-enum value and get a 400. But (a) field names/types match, (b) there are zero socialApi/connectionAction call sites in the UI (confirmed via grep) so nothing currently exercises this, and (c) loose action typing is a low tech-debt item, not a high-severity broken contract. Marking isReal=false: the reported issue (targetUserId/targetUsername mismatch breaking every request) does not exist. Residual action-enum looseness is at most low.
- **mutuals called with numeric userId but backend route is [username] and queries by username (C2 still pending)** (api-contracts) — `src/services/api.ts:204`  
  _Why rejected:_ False positive. The finder relied on the `.next` build artifact (`/api/social/mutuals/[username]`) and the old audit's assumed App Router layout, but the actual current backend source routes `/mutuals/:id` to a handler that parses the param as a number, returns 410 Gone for non-numeric (old username) clients, and looks the target up by `users.id` (numeric). The frontend sends a numeric userId, which now matches the backend exactly — no contract mismatch. Task 6's 'Done' status is correct (implemented as a single hybrid route rather than the doc's Option A folder rename, but functionally equivalent). The finding also conceded socialApi.mutuals has zero call sites, so even its claimed impact was latent. Adjusted severity to low only to reflect a minor residual nit (the deprecated username form is never used by this frontend and the route is dead code from the FE's perspective), but the reported bug itself does not exist in current code.
- **AdminScreen calls PUT/DELETE /api/admin/rides/:id but that route does not exist (C4 still pending)** (api-contracts) — `src/components/screens/AdminScreen.tsx:38`, `src/components/screens/AdminScreen.tsx:40`, `src/components/screens/AdminScreen.tsx:476`  
  _Why rejected:_ False positive. The finding's frontend evidence is accurate, but its core claim — that the backend lacks PUT/DELETE /api/admin/rides/:id — is based on the wrong artifact. The backend is Express, and the finder read the stale .next build folder rather than src/. The current Express source explicitly registers both PUT and DELETE on /rides/:id (admin.routes.ts:15-16) with fully implemented controller handlers (admin.controller.ts:106-128), correctly mounted to produce /api/admin/rides/:id. Therefore the Cancel button works and deleteRide has a backing endpoint; the contract is NOT mismatched. The issue does not exist in the current code, so it is neither real nor still present. (Severity field retained at the finder's stated 'high' for schema purposes only; the issue itself is non-existent.)
- **forgot-password returns fake success; backend never sends the reset email (H2/L4 still pending)** (api-contracts) — `src/services/api.ts:111`  
  _Why rejected:_ The finding's central assertion — that the backend forgot-password route "still contains the TODO and never sends an email" and the reset flow is "dead end to end" / shows "fake success" — is factually false against the current source. The current backend sends a real email via Resend (controller line 75 -> email.service.ts fetch to api.resend.com), persists a hashed reset token, and fully implements resetPassword. The finder evidently transcribed the stale backend-tasks.md/backend-audit.md description (or stale .next artifacts) rather than reading the actual current code; the route path it cites (app/api/auth/forgot-password/route.ts) does not even exist as source — the backend uses an Express module structure. The only literally-true parts are (a) api.ts:111 defines forgotPassword (a correct, normal wrapper, not a defect) and (b) the two methods have no UI call sites — which the finder itself concedes makes it not user-visible. A defined-but-unused frontend API method is at most trivial dead-code/tech-debt, so even the salvageable kernel is low, not medium. Marking isReal=false because the asserted defect does not exist in the code as it now stands.

---

_Audit produced by a multi-agent workflow (find → adversarially verify → synthesize). Severity: critical = broken/blocking or security hole; high = core feature silently non-functional / significant bug; medium = correctness/UX flaw with workaround; low = tech-debt / quality._
