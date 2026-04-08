# 06 — Join Ride Screen

## Overview

The Join Ride Screen lets a rider **jump directly into a specific ride** using a
short trip code — without having to browse and search. It is ideal when an organiser
shares a code via WhatsApp, Instagram, or word-of-mouth.

**Route:** `/join-ride`
**File:** `src/components/screens/JoinRideScreen.tsx`

---

## Layout Structure

```
GlobalHeader (back button + "Join a Ride")

Instructional banner
  └── "Get the code from the ride organiser"

Trip code input
  └── 6-character uppercase text field

"Join Now" button

Quick access section
  └── 5 pre-suggested trip code tiles
```

---

## Features

### Trip Code Input
- Single text field, limited to **6 characters**
- Auto-converts input to **uppercase** as the user types
- Placeholder: `e.g. NH001`
- Debounced — no search-as-you-type, only triggered on submit

### Join Now Button
- Disabled when input is empty or less than valid length
- On tap → shows loading spinner
- Calls ride lookup API using the trip code
- On success → navigates to `/ride/:id` for that ride
- On failure → toast error "No ride found with that code"

### Quick Access Codes
Five pre-configured trip code suggestion tiles:

| Code | Ride |
|---|---|
| NH001 | Nandi Hills Sunrise |
| CT002 | Coorg Coffee Trail |
| CH003 | Coastal Highway Cruise |
| WM004 | Western Mysore Run |
| MC005 | Monsoon Coastal Ride |

Tapping a tile **auto-fills** the input field and **auto-submits** immediately (one-tap join).

These codes are defined in `src/constants/index.ts → SUGGESTED_TRIP_CODES`.

---

## Flow

```
User types code / taps quick tile
  └── Input validated (non-empty, ≥ 3 chars)
        └── POST /api/rides/join-by-code { code }  (or mock lookup)
              ├── Found → navigate to /ride/:id
              └── Not found → toast "Invalid trip code"
```

---

## UX Details
- A short explainer paragraph below the input explains where to get a code
- The quick access tiles show the ride name alongside the code to help riders recognise
  which ride they are about to join
- Toast notifications used for both success confirmation and error messages

---

## Feature Score

| Feature | Status |
|---|---|
| Trip code input (6-char, uppercase) | Implemented |
| Quick access code tiles | Implemented |
| One-tap join from tile | Implemented |
| Loading state / spinner | Implemented |
| Success/error toast | Implemented |
| Navigation to ride on success | Implemented |
| QR code scanner | Not implemented |
| Recent codes history | Not implemented |
| Deep-link from share URL | Not implemented |
| Code validation before API call | Partial (length check only) |
