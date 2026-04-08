# 03 — Home Screen (Ride Discovery)

## Overview

The Home Screen is the **primary landing page** for authenticated users. It is the
ride discovery hub — riders browse all available rides, search by keyword, apply
filters, and see trending rides. Every session starts here.

**Route:** `/`
**File:** `src/components/screens/HomeScreen.tsx`

---

## Layout Structure

```
GlobalHeader
  ├── Location picker (city selector)
  ├── Search icon (toggles search bar)
  ├── Filter icon (opens DrawableFilters drawer)
  └── Notification bell (badge with unread count)

RideFilters (horizontal scroll tabs)
  └── All / Breakfast / Adventure / Scenic / Long Distance / Night Ride

ActiveFilters (chips row — only shown when filters are applied)
  └── Each chip: label + × to remove that filter

Results counter ("X rides found")

VirtualizedRideList
  └── RideCard (per ride)

TrendingSection
  └── Popular / trending ride cards
```

---

## Features

### 1. Location Picker
- Dropdown with 10 preset Indian cities: Bangalore, Mumbai, Delhi, Chennai, Hyderabad,
  Pune, Kolkata, Goa, Mysore, Coorg
- Persists the chosen city as the location context for filtering
- Displayed in the header as the current city

### 2. Search
- Full-text search across: ride title, organiser name, location, trip code
- Debounced to avoid excessive re-renders
- Clears with a single tap

### 3. Quick Ride Type Filter (RideFilters)
- Horizontal scrollable tabs: All, Breakfast, Adventure, Scenic, Long Distance, Night Ride
- Tapping a type instantly filters the ride list
- "All" resets the type filter
- Type constants live in `src/constants/index.ts → RIDE_TYPES`

### 4. Advanced Filters (DrawableFilters drawer)
Opened via the filter icon in the header. Contains:

| Filter | Type | Default | Description |
|---|---|---|---|
| Distance range | Slider (0–100 km) | [0, 100] | Only show rides within this distance |
| Sort by | Select | "nearest" | nearest / newest / popularity |
| Bike CC | Select | "any" | any / 100-150 / 150-250 / 250-500 / 500+ |
| Group size | Slider (1–20) | [1, 20] | Minimum and maximum riders |
| Duration | Select | "any" | any / half-day / full-day / multi-day |
| Ride type | Multi-select chips | [] | Same tags as quick filter |

- Filters persist in `useFilters` hook state (no URL params)
- "Reset all" button inside drawer clears everything to defaults
- Filter state defined in `src/constants/index.ts → DEFAULT_FILTERS`

### 5. Active Filter Chips (ActiveFilters)
- Rendered only when at least one non-default filter is active
- Each chip shows the human-readable label for the active filter value
- Tapping × on a chip removes only that filter
- Count badge on the header filter icon shows total active filter count

### 6. Results Counter
- Simple text: "X rides found" updated live as filters change
- Disappears if rides are loading (skeleton shown instead)

### 7. Virtualized Ride List (VirtualizedRideList)
- Uses virtual scrolling so only visible cards are rendered — important for large lists
- Each ride renders as a `RideCard`

**RideCard shows:**
- Ride title and organiser name + avatar
- Ride type badge (coloured by type)
- Date, start time, start point → destination
- Estimated distance, difficulty badge
- Participant count / max riders (e.g. 8/15)
- Cost (fuel estimate)
- Trip code chip
- "Join" or "View" CTA button

### 8. Trending Section (TrendingSection)
- A fixed section below the main list showing handpicked/popular rides
- Horizontal scroll card row
- Same card format as regular ride cards

### 9. Skeleton Loading States
- `HomeScreenSkeleton` shown on initial load
- `RideCardSkeleton` shown per card slot while paginating
- `SkeletonList` used as reusable skeleton row component

---

## Data Flow

```
useRides() hook
  └── TanStack Query → GET /api/rides (or mock from src/data/rides.ts)
        └── VirtualizedRideList receives filtered array
              └── filtered client-side via useFilters() state
```

Mock data toggle: `VITE_USE_MOCK=true` (default) reads from `src/data/rides.ts`.

---

## State

| State source | What it controls |
|---|---|
| `useFilters()` hook | All filter values, active filter count, clear/remove helpers |
| `useRides()` hook | Raw ride array from server / mock |
| Local `useState` | Search text, drawer open/close |

---

## Navigation from Home Screen

| Action | Destination |
|---|---|
| Tap ride card | `/ride/:id` (RideDetailsScreen) |
| Tap notification bell | `/notifications` |
| Plan Ride FAB (floating) | `/plan-ride` |

---

## Feature Score

| Feature | Status |
|---|---|
| Location picker | Implemented (UI only, no geo-lookup) |
| Search | Implemented (client-side string match) |
| Quick type filter | Implemented |
| Advanced filters | Implemented (client-side) |
| Active filter chips | Implemented |
| Virtualized list | Implemented |
| Trending section | Implemented |
| Skeleton loading | Implemented |
| Server-side filtering | Not implemented (all filtering is client-side) |
| Infinite scroll / pagination | Not implemented |
| Real-time ride updates | Not implemented |
| Map view toggle | Not implemented |
| AI recommendations | Not implemented |
