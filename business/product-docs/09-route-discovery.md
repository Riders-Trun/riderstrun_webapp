# 09 — Route Discovery Screen

## Overview

The Route Discovery Screen gives deep detail on a **specific route** — not a specific
ride event, but the route itself as a community-shared asset. Riders can see past
group rides on this route, view photos, read and post discussions, and study the
waypoints.

**Route:** `/route-discovery/:id`
**File:** `src/components/screens/RideDiscoveryScreen.tsx`
**Sub-components:** `src/components/ride-discovery/`
**Data:** `src/data/rideDiscovery.ts`

---

## Layout Structure

```
GlobalHeader (back + route name)

Hero card
  ├── Cover photo
  ├── Route name, distance, difficulty badge
  ├── Rating (stars + review count)
  └── "Plan a ride on this route" CTA button

Tab bar
  ├── Overview
  ├── Route
  ├── Photos
  └── Talks

Tab content area
```

---

## Tabs

### Tab 1 — Overview (`src/components/ride-discovery/OverviewTab.tsx`)
High-level summary of the route:
- Description paragraph
- Key highlights list (e.g. "Sunrise viewpoint", "Coffee estate stopover")
- Best time to visit
- Estimated total cost range
- Difficulty rating breakdown (road quality, traffic, elevation)
- Past group rides section:
  - List of historical rides on this route
  - Each entry: date, organiser, riders count, average rating, short note

### Tab 2 — Route (`src/components/ride-discovery/RouteTab.tsx`)
Detailed waypoint and road information:
- Ordered list of stops/waypoints with distances from start
- Road surface notes per segment (highway / ghat / city)
- Fuel station locations
- Known hazards or seasonal closures
- Altitude profile summary (text-based, no chart yet)

### Tab 3 — Photos (`src/components/ride-discovery/PhotosTab.tsx`)
Community-submitted photos from this route:
- Masonry or grid layout of images
- Each photo: submitter name, date taken, caption
- Tap to open in PhotoGallery lightbox component

### Tab 4 — Talks (`src/components/ride-discovery/TalksTab.tsx`)
Community discussion thread for this route:
- Posts (with avatar, name, timestamp, text + optional image)
- Nested comments (one level deep)
- Like button per post
- "Add a comment" input at bottom
- Replies show under parent post

---

## Data Model (`src/data/rideDiscovery.ts`)

```typescript
Route {
  id: string
  name: string
  distance: number            // km
  difficulty: "Easy" | "Moderate" | "Hard"
  rating: number
  reviewCount: number
  coverPhoto: string
  description: string
  highlights: string[]
  bestTime: string
  estimatedCost: { min: number, max: number }
  stops: RouteStop[]
  pastGroupRides: PastRide[]
}

RouteStop {
  name: string
  distanceFromStart: number
  facilities: string[]        // "Fuel" | "Food" | "Restroom"
  notes?: string
}

TalkPost {
  id: string
  author: { name, avatar }
  timestamp: string
  content: string
  image?: string
  likes: number
  replies: TalkReply[]
}
```

---

## Entry Points

Route Discovery is reached from:
- **Explore screen** → tapping a Trending Route card → `RouteDetailsModal` (inline
  preview) or navigates to full screen
- **Ride Details screen** → "View Route" link on Route tab
- Direct URL `/route-discovery/:id`

---

## Feature Score

| Feature | Status |
|---|---|
| Overview tab with highlights | Implemented |
| Past group rides list | Implemented |
| Route/waypoints tab | Implemented |
| Photos tab with gallery | Implemented |
| Talks/discussion tab | Implemented |
| Nested comments | Implemented (one level) |
| Like posts | Implemented (UI state only) |
| "Plan a ride on this route" CTA | Implemented (navigates to PlanRide pre-filled) |
| Interactive map of waypoints | Not implemented |
| Altitude chart | Not implemented |
| Upload photo to route | Not implemented |
| Submit new discussion post | Not implemented (input exists, no API) |
| Route bookmarking/save | Not implemented |
| Share route | Not implemented |
