# 13 — Profile Screen

## Overview

The Profile Screen is each rider's **personal hub** — identity, bike info, riding
stats, gamification progress, and emergency contact. It can be edited inline and
serves as the source of truth for everything about that rider's journey on the platform.

**Route:** `/profile`
**File:** `src/components/screens/ProfileScreen.tsx`
**Data:** `src/data/profile.ts`
**API:** `profileApi.getMyProfile()` / `profileApi.updateProfile(data)`

---

## Layout Structure

```
Hero section
  ├── Profile picture (avatar with camera icon for edit)
  ├── Display name + rank badge
  ├── City / location
  └── "Edit Profile" toggle button

Quick stats grid (4 tiles)

Personal info section  (editable)

Emergency contact section  (editable)

Ride statistics section

Streaks section

Achievements section

Challenges section

Recent rides section

Organiser rank section
```

---

## Sections

### Hero Section
- Large circular avatar (placeholder initials if no photo)
- Camera overlay icon to change photo (UI only, no upload yet)
- Display name in large font
- **Rank badge** (e.g. "Road Warrior", "Trail Blazer") shown as a coloured pill
- City / location string
- "Edit Profile" button — toggles all editable fields into edit mode

---

### Quick Stats Grid
Four prominent stat tiles:

| Tile | Value source | Description |
|---|---|---|
| Total Rides | `RideStats.totalRides` | All rides attended |
| Distance | `RideStats.totalDistance` km | Cumulative km ridden |
| Streak | `RideStats.currentStreak` days | Current active streak |
| Points | `RideStats.points` | Gamification points total |

---

### Personal Info (editable)

| Field | Type | Notes |
|---|---|---|
| Name | Text | Display name |
| Phone | Tel | Contact number |
| Email | Email | Read-only (tied to auth account) |
| Bike | Text | e.g. "Royal Enfield Himalayan 450" |
| Riding level | Select | Beginner / Intermediate / Expert |
| Location / City | Text | Home city |

In **edit mode**: fields become inputs. "Save" button sends `profileApi.updateProfile()`.
In **view mode**: fields are plain text display.

---

### Emergency Contact (editable)

| Field | Type |
|---|---|
| Contact name | Text |
| Phone number | Tel |
| Relationship | Text (e.g. "Spouse", "Parent") |

This data is shown to the ride organiser on the Ride Details screen.

---

### Ride Statistics Section

Extended stats beyond the quick grid:

| Stat | Description |
|---|---|
| Total rides | Same as quick tile |
| Rides organised | Rides created by this user |
| Total distance (km) | Cumulative |
| Longest streak | All-time best streak in days |
| No-shows | Times user joined but didn't attend |
| Rank | Leaderboard position |

Streak visualiser: a linear bar showing current streak vs. target streak with a
flame icon.

---

### Streaks Section

Displays active streaks (there can be multiple types):

```typescript
Streak {
  type: string          // e.g. "Monthly Challenge", "Weekend Warrior"
  current: number       // current days/count
  target: number        // goal
  reward: string        // reward description (e.g. "Gold Badge + 500 pts")
}
```

Each streak shows a progress bar, current/target label, and the reward on completion.

---

### Achievements Section

Unlockable badges earned through riding activity.

**Rarity levels with visual styling:**

| Rarity | Colour | Example |
|---|---|---|
| Common | Gray | First Ride, 5 Rides Club |
| Rare | Blue | 10 Rides, 500 km |
| Epic | Purple | 50 Rides, 5000 km |
| Legendary | Gold | 100 Rides, Organiser Elite |

**Earned achievements:** shown with full colour, name, description, points value.
**Locked achievements:** shown greyed out with a lock icon — teases what's next.

```typescript
Achievement {
  name: string
  description: string
  earned: boolean
  earnedDate?: string
  points: number
  rarity: "common" | "rare" | "epic" | "legendary"
  icon: string
}
```

---

### Challenges Section

Time-limited tasks with progress tracking:

```typescript
Challenge {
  name: string
  description: string
  progress: number       // 0–100 (percentage)
  expiresAt: string      // deadline
  reward: string
  type: string           // "distance" | "rides" | "social" | etc.
}
```

Each challenge shows:
- Name and description
- Progress bar with percentage
- Expiry countdown (e.g. "5 days left")
- Points/reward on completion

---

### Recent Rides Section

Last 3–5 rides the user has attended, showing:
- Ride title, date, distance
- Role badge: "Rider" or "Organiser"
- Star rating given (if rated)

---

### Organiser Rank Section

Riders who organise rides accumulate organiser XP and progress through ranks:

| Rank | Rides organised | Badge colour |
|---|---|---|
| New Organiser | 1–5 | Gray |
| Regular | 6–15 | Bronze |
| Experienced | 16–30 | Silver |
| Veteran | 31–50 | Gold |
| Elite | 50+ | Platinum |

Rank shown with icon, current rank name, rides to next rank, and progress bar.

---

## Feature Score

| Feature | Status |
|---|---|
| Hero section with rank badge | Implemented |
| Quick stats grid | Implemented |
| Edit personal info inline | Implemented |
| Emergency contact editable | Implemented |
| Save via profileApi | Implemented (API wired) |
| Ride statistics dashboard | Implemented |
| Streak progress bars | Implemented |
| Achievements with rarity | Implemented |
| Locked achievement teasers | Implemented |
| Active challenges | Implemented |
| Recent rides list | Implemented |
| Organiser rank progression | Implemented |
| Profile photo upload | Not implemented |
| Bike photo gallery | Not implemented |
| Public profile link (share) | Not implemented |
| Privacy settings per field | Not implemented |
| Account deletion | Not implemented |
| Social links (Instagram, Strava) | Not implemented |
