# 10 — Location Planner Screen

## Overview

The Location Planner Screen is a **destination discovery tool**. Riders browse
popular riding destinations, filter by route type, and get key information about
each place — distance, difficulty, attractions, fuel stops, dining, best time to
visit, and estimated cost — before planning a ride there.

**Route:** `/location-planner`
**File:** `src/components/screens/LocationPlannerScreen.tsx`

---

## Layout Structure

```
GlobalHeader (back + "Location Planner")

Search bar
  └── Search destinations by name or keyword

Filter tabs (horizontal scroll)
  └── All / Scenic / Adventure / Heritage

Destination cards (vertical list)
  └── DestinationCard (per destination)
```

---

## Features

### Search
- Text input that filters the destinations list in real time
- Matches against destination name, region, and tags

### Route Type Filter Tabs
Four tabs to categorise destinations:

| Tab | Description |
|---|---|
| All | Show all destinations |
| Scenic | Viewpoints, ghats, coastal routes |
| Adventure | Off-road, hilly, challenging terrain |
| Heritage | Historical sites, temples, forts |

Tapping a tab filters the list immediately.

---

### Destination Card

Each card contains:

**Header:**
- Destination name and region/state
- Difficulty badge (Easy / Moderate / Hard)
- Star rating (community average)
- Distance from selected city (km)

**Highlights row:**
- 3–5 attraction tags (e.g. "Sunrise view", "Coffee estates", "Waterfall")

**Info grid:**
| Info | Example |
|---|---|
| Best time to visit | October – February |
| Estimated cost | ₹500 – ₹800 |
| Fuel stops | 3 available on route |
| Dining options | 5 dhabas / cafes |

**Actions:**
- **View Route** button → navigates to `/route-discovery/:id` for this destination's
  primary route
- **Plan a Ride here** button → navigates to `/plan-ride` with destination pre-filled

---

## Sample Destinations (from mock data)

The following destination types are represented in the mock data:

- Nandi Hills (Scenic, 62 km from Bangalore, Easy)
- Coorg (Scenic + Adventure, 250 km, Moderate)
- Sakleshpur (Adventure, 220 km, Hard)
- Shravanabelagola (Heritage, 160 km, Easy)
- Hampi (Heritage + Adventure, 340 km, Moderate)
- Gokarna (Scenic + Coastal, 480 km, Hard)

---

## Data Flow

```
Static / mock data from LocationPlannerScreen state
  └── Filtered client-side by search text + selected tab
        └── Rendered as DestinationCard list
```

No dedicated data file — destination data is currently inline or in the component.

---

## Feature Score

| Feature | Status |
|---|---|
| Destination list with cards | Implemented |
| Search by name/keyword | Implemented |
| Route type filter tabs | Implemented |
| Difficulty + distance info | Implemented |
| Attractions / highlights | Implemented |
| Fuel stops + dining info | Implemented |
| Best time to visit | Implemented |
| Estimated cost range | Implemented |
| "View Route" → Route Discovery | Implemented |
| "Plan Ride here" → Plan Ride pre-filled | Implemented |
| Interactive map of destination | Not implemented |
| Real distances from user's GPS | Not implemented |
| User reviews for destinations | Not implemented |
| Photo gallery per destination | Not implemented |
| Save / bookmark destinations | Not implemented |
| Offline destination data | Not implemented |
