# 11 — Travel Diary Screen

## Overview

The Travel Diary is a rider's **personal ride journal**. It stores memories from
completed rides — written entries, photos, tags, and ratings. Think of it as a
private/shareable scrapbook that builds over time as the rider completes more rides.

**Route:** `/travel-diary`
**File:** `src/components/screens/TravelDiaryScreen.tsx`

---

## Layout Structure

```
GlobalHeader ("Travel Diary")

Stats summary row
  ├── Total trips
  ├── Total km ridden
  ├── Photos uploaded
  └── Average rating

"New Entry" button (top right or FAB)

Diary entries list (vertical scroll)
  └── DiaryEntryCard (per entry)
```

---

## Features

### Stats Summary Row
A compact 4-metric row at the top giving a quick life-stats overview:

| Stat | Description |
|---|---|
| Total trips | Count of diary entries |
| Total km | Sum of all ride distances logged |
| Photos | Total photos attached across entries |
| Avg rating | Mean of all self-ratings |

### Create New Entry
- "+" button or "New Entry" button
- Opens a creation form / modal with:
  - Title (text, required)
  - Associated ride (select from past rides, optional)
  - Date (auto-filled from ride, editable)
  - Distance (km, auto-filled from ride, editable)
  - Location / destination text
  - Star rating (1–5)
  - Written narrative (textarea)
  - Tags (multi-select: weather, terrain, trip type, etc.)
  - Photo attachments (UI only — no server upload yet)

### Diary Entry Card

Each card shows:
- Cover photo (or placeholder illustration)
- Title and date
- Location + distance (km)
- Star rating display
- Photo count badge
- Tags row (e.g. "Sunny", "Mountain", "Breakfast ride")
- Short excerpt from the narrative (2–3 lines)
- Likes count + Comments count (for shared entries)
- "Read more" expands full entry inline or navigates to detail view

---

## Entry Detail View

When a card is expanded or tapped:
- Full narrative text
- All attached photos in a gallery grid (tap to open in PhotoGallery lightbox)
- All tags
- Ride stats for that trip (distance, duration, stops)
- Option to edit the entry
- Option to share (generates a shareable link or image)

---

## Data Model

```typescript
DiaryEntry {
  id: string
  title: string
  date: string
  location: string
  distance: number              // km
  rating: number                // 1–5
  narrative: string
  photos: string[]              // image URLs
  tags: string[]
  rideId?: string               // linked ride (optional)
  likes: number
  comments: number
  isPublic: boolean
}
```

---

## Privacy
- Entries can be **private** (visible only to the rider) or **public** (visible on
  their public profile and potentially in Explore feed)
- Toggle per entry — public / private switch

---

## Feature Score

| Feature | Status |
|---|---|
| Stats summary row | Implemented |
| Entry list with cards | Implemented |
| Entry card: title, date, location, rating | Implemented |
| Entry card: photo count, tags, excerpt | Implemented |
| Create new entry form | Implemented (UI) |
| Tag selection | Implemented |
| Star rating input | Implemented |
| Photo attachment UI | Implemented (no upload) |
| Entry detail / expand view | Implemented |
| Edit existing entry | Implemented (UI) |
| Public / private toggle | Implemented (UI) |
| Share entry | Not implemented |
| Link entry to past ride | Partial (UI only) |
| Server-side photo upload | Not implemented |
| Social feed integration | Not implemented |
| Export diary as PDF | Not implemented |
| Map trace of route in entry | Not implemented |
