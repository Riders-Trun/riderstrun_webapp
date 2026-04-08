# 05 — Plan Ride Screen

## Overview

The Plan Ride Screen lets any authenticated user **create and organise a new ride**.
It combines motivational context (your stats, popular routes) with a multi-section
form. Validation is enforced with Zod before submission.

**Route:** `/plan-ride`
**File:** `src/components/screens/PlanRideScreen.tsx`
**Sub-components:** `src/components/ride-planning/`
**Validation schema:** `src/lib/validations.ts`

---

## Page Structure

```
GlobalHeader (back button + "Plan a Ride")

UserStats section
  ├── Current streak (days)
  ├── Points total
  └── Rides organised (count)

PopularRoutes section
  └── Route cards (4 preset routes) with streak reward badges

RoleSelection
  └── Planner  /  Organiser

QuickPresets
  └── Breakfast / Adventure / Scenic / Night ride tiles

──── Form ────
BasicInfo
RouteDetails
PitStops
RideRules
RideDescription
──────────────

Preview button  →  submit
```

---

## Sections

### UserStats (`src/components/ride-planning/UserStats.tsx`)
Shows the current rider's motivational stats before they start planning:
- Current streak with flame icon
- Total points earned
- Number of rides they have organised so far

### Popular Routes (`src/components/ride-planning/PopularRoutes.tsx`)
Four preset routes that riders can select to auto-fill the form:

| Route | Distance | Difficulty | Streak reward |
|---|---|---|---|
| Nandi Hills Sunrise | 62 km | Easy | +5 streak days |
| Coorg Coffee Trail | 180 km | Moderate | +10 streak days |
| Coastal Highway Cruise | 220 km | Hard | +15 streak days |
| Mysore Palace Run | 150 km | Easy | +7 streak days |

Selecting a route pre-fills `startPoint`, `destination`, and `distance` fields.
The streak reward is shown as a badge on each card.

### Role Selection (`src/components/ride-planning/RoleSelection.tsx`)
Two roles:
- **Planner** — plans the route but does not lead the group
- **Organiser** — leads and is responsible for the ride

Role choice sets the `role` field in the form and affects what permissions the user
has on the ride after creation (Organiser gets edit/share controls in My Rides).

### Quick Presets (`src/components/ride-planning/QuickPresets.tsx`)
Four coloured tiles that set `type` and prefill a title suggestion:
- Breakfast Ride (yellow/orange)
- Adventure Ride (green)
- Scenic Ride (blue)
- Night Ride (indigo)

---

## Form Sections

### BasicInfo (`src/components/ride-planning/BasicInfo.tsx`)

| Field | Validation | Description |
|---|---|---|
| Title | 3–100 chars, required | Name of the ride |
| Ride type | Required | Select from RIDE_TYPES constant |
| Date | Required | Calendar picker — must be a future date |
| Start time | Required | Time picker |
| Max riders | 2–50, required | Integer input with +/− controls |

### RouteDetails (`src/components/ride-planning/RouteDetails.tsx`)

| Field | Validation | Description |
|---|---|---|
| Start point | 3–200 chars, required | Location string (text, no map) |
| Destination | 3–200 chars, required | Location string |
| Difficulty | Required | Easy / Moderate / Hard |

### PitStops (`src/components/ride-planning/PitStops.tsx`)
- Add multiple pit stops (dynamic list)
- Each stop: name, distance from start (km), facilities checkboxes (Fuel / Food / Restroom)
- "Add another stop" button appends a new stop row
- Each stop removable with × button

### RideRules (`src/components/ride-planning/RideRules.tsx`)
Toggle switches and dropdowns for:
- Helmet policy (mandatory / recommended)
- Max speed (optional — number field)
- No-show policy (text — e.g. "Notify 2 hours before")
- Pillion allowed (yes / no toggle)

### RideDescription (`src/components/ride-planning/RideDescription.tsx`)
- Large textarea, optional, max 500 characters
- Character count shown live

---

## Form Validation (Zod schema — `src/lib/validations.ts`)

```typescript
rideFormSchema = z.object({
  title:         z.string().min(3).max(100),
  type:          z.string().min(1),
  date:          z.string().min(1),
  time:          z.string().min(1),
  startPoint:    z.string().min(3).max(200),
  destination:   z.string().min(3).max(200),
  maxRiders:     z.number().min(2).max(50),
  description:   z.string().max(500).optional(),
  role:          z.string().min(1),
  selectedRoute: z.string().optional(),
})
```

Errors display inline below each field. The form is managed with `react-hook-form`.

---

## Submission Flow

1. User fills form → taps **Preview**
2. Preview modal shows a summary of all fields
3. User confirms → form data submitted to `useCreateRide()` mutation
4. Mutation → POST `/api/rides` (or mock)
5. On success → toast "Ride created!" → navigate to My Rides (Organised tab)
6. On error → toast with error message

---

## Feature Score

| Feature | Status |
|---|---|
| User stats display | Implemented |
| Popular route presets | Implemented |
| Role selection | Implemented |
| Quick presets (type tiles) | Implemented |
| BasicInfo form | Implemented |
| RouteDetails form | Implemented |
| PitStops (dynamic list) | Implemented |
| RideRules toggles | Implemented |
| RideDescription textarea | Implemented |
| Zod validation | Implemented |
| Preview before submit | Implemented |
| Create ride API call | Implemented (wired) |
| Interactive map for route | Not implemented |
| Auto-fill start point from GPS | Not implemented |
| Weather check for chosen date | Not implemented |
| Cost estimator | Not implemented |
| Duplicate ride prevention | Not implemented |
| Draft auto-save | Not implemented |
