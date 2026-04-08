# 04 — Ride Details Screen

## Overview

The Ride Details Screen shows the **full information about a single ride**. It is
accessed by tapping any ride card. Riders can read all details before deciding to
join, and participants see the group chat and participant gallery here.

**Route:** `/ride/:id`
**File:** `src/components/screens/RideDetailsScreen.tsx`
**Data:** `src/data/rideDetails.ts` (mock: `mockRideDetails`)

---

## Layout Structure

```
GlobalHeader (back button + ride title)

Hero section
  ├── Ride title, type badge, difficulty badge
  ├── Date, start time, duration estimate
  └── Join / Leave button  +  Contact Organiser button

Organiser card
  ├── Avatar, name, rating (stars), rides organised count
  └── "View Profile" link

Tab bar
  ├── Overview
  ├── Route
  ├── Photos
  └── Talks

Tab content (changes per tab)
```

---

## Tabs & Content

### Tab 1 — Overview

#### Participants block
- Joined riders count vs max capacity (e.g. 8 / 15)
- Pillion available: yes/no badge
- List of participant avatars (first 5 shown + "+N more")

#### Cost breakdown (RideCosts)
| Item | Example |
|---|---|
| Fuel estimate | ₹450 |
| Breakfast | ₹250 |
| Tolls | ₹80 |
| Parking | ₹50 |
| Total | ₹830 |

#### Bike requirements (BikeRequirements)
- Minimum CC, preferred bike types, pillion policy

#### Safety gear checklist (SafetyGear)
- Helmet (mandatory), riding jacket, gloves, riding boots, knee guards
- Each item has a required/recommended flag

#### Weather forecast (Weather)
- Condition icon (sunny, cloudy, rain)
- Temperature range, wind speed, chance of rain

#### Emergency contact
- Organiser's emergency contact name and phone number

### Tab 2 — Route

#### Route info (RouteInfo)
- Start point → destination
- Total distance (km) and estimated duration
- Stops list: each stop has name, facilities (fuel/food/restroom), distance from start
- Route conditions: road quality, traffic notes, altitude/terrain info
- Fuel stop indicators on route

#### Previous trips section (PreviousTripsSection)
- List of past group rides on this same route
- Each entry: date, riders count, rating, brief note
- File: `src/components/ride-details/PreviousTripsSection.tsx`

### Tab 3 — Photos
- Photo gallery component (PhotoGallery)
- Grid of images shared by participants
- Tap to enlarge (lightbox/carousel)
- File: `src/components/PhotoGallery.tsx`

### Tab 4 — Talks (Group Chat)
- Real-time-style group chat for the ride
- Organiser announcements shown with a special badge
- Each message: avatar, name, time, message text
- Text input + send button
- File: `src/components/RideChat.tsx`

---

## Actions

### Join Ride
- Shown when user has NOT joined the ride
- On tap → `useJoinRide()` mutation → POST `/api/rides/:id/join`
- Success → participant count increments, button changes to "Leave"
- Toast confirms action

### Leave Ride
- Shown when user HAS joined the ride
- Confirmation dialog before leaving
- On confirm → remove from participants

### Contact Organiser
- Button that opens device phone/SMS to organiser's contact

---

## Data Model (RideDetail type)

```typescript
{
  id: number
  title: string
  type: string                      // "Breakfast" | "Adventure" | etc.
  date: string
  time: string
  organiser: {
    name: string
    avatar: string
    rating: number
    ridesOrganised: number
    emergencyContact: { name, phone }
  }
  route: RouteInfo                  // stops, distance, conditions
  costs: RideCosts                  // fuel, food, tolls, parking, total
  requirements: BikeRequirements    // min CC, type, pillion
  safety: SafetyGear[]              // gear checklist
  weather: Weather                  // forecast
  participants: Participant[]
  maxRiders: number
  pilionAvailable: boolean
  averageRating: number
  tripCode: string
  previousTrips: PreviousTripEntry[]
}
```

---

## Feature Score

| Feature | Status |
|---|---|
| Full ride info (all tabs) | Implemented |
| Cost breakdown | Implemented |
| Safety gear checklist | Implemented |
| Weather forecast | Implemented (static data) |
| Participant gallery | Implemented |
| Group chat (Talks) | Implemented (mock, no real-time) |
| Previous trips history | Implemented |
| Join / Leave ride | Implemented (API wired, mock fallback) |
| Contact organiser | Implemented (tel: link) |
| Real-time chat (WebSocket) | Not implemented |
| Live weather API | Not implemented |
| Payment for ride costs | Not implemented |
| Live participant updates | Not implemented |
| Turn-by-turn navigation | Not implemented |
| Check-in at ride start | Not implemented |
