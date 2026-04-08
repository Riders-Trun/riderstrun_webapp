# 17 — Gamification System

## Overview

RidersTurn embeds a **gamification layer** to encourage regular riding, ride
organisation, and community participation. The system has five interlocking
mechanics: Points, Streaks, Achievements, Challenges, and Organiser Rank.
All gamification data lives on the user's profile.

**Data source:** `src/data/profile.ts`
**Types:** `src/types/index.ts`
**Displayed on:** Profile Screen (`/profile`), Plan Ride Screen (`/plan-ride`)

---

## 1. Points

**What earns points:**

| Action | Points |
|---|---|
| Attending a ride | +50 pts |
| Organising a ride | +100 pts |
| Completing a streak milestone | +200–500 pts |
| Completing a challenge | +100–300 pts |
| Helping a new rider (mentor action) | +75 pts |
| Sharing a ride (driving community referrals) | +25 pts |

**Where points show:**
- Profile quick stats grid (large number tile)
- Plan Ride screen UserStats section
- Achievement unlock notifications ("You earned 500 pts!")
- Organiser rank progression bar

**Current implementation:** Points total stored on `UserProfile.points`, displayed
statically. Increment logic lives on the backend (not yet wired to frontend events).

---

## 2. Streaks

A streak counts **consecutive ride-days or weekly rides** depending on the streak type.

### Streak Types

| Type | Trigger | Reset condition |
|---|---|---|
| Weekend Warrior | Attend a ride every weekend | Miss one weekend |
| Monthly Challenge | Complete X rides in a calendar month | Month ends without completing |
| Organiser Streak | Organise at least 1 ride per month | Miss a month |

### Streak Data Model

```typescript
Streak {
  type: string            // e.g. "Weekend Warrior"
  current: number         // current count (days / events)
  target: number          // goal to hit reward
  reward: string          // description of the reward
}
```

### Display
- Progress bar: `current / target` with percentage
- Flame icon when streak is active
- Reward label shown below bar
- Multiple streaks can be active simultaneously (shown as separate cards)

### Plan Ride Integration
- Popular route cards on PlanRide screen show **streak reward** for completing that route
- E.g. "Coorg Coffee Trail → +10 streak days" shown as a badge on the route card

---

## 3. Achievements

A fixed set of badges unlocked by hitting milestones.

### Rarity Tiers

| Tier | Colour | Points value | Rarity |
|---|---|---|---|
| Common | Gray | 50–100 pts | Easy to earn |
| Rare | Blue | 150–300 pts | Moderate effort |
| Epic | Purple | 400–600 pts | Significant milestone |
| Legendary | Gold | 750–1000 pts | Exceptional accomplishment |

### Sample Achievement Catalogue

| Name | Description | Rarity | Trigger |
|---|---|---|---|
| First Ride | Attended your first ride | Common | 1 ride attended |
| 5 Rides Club | Completed 5 rides | Common | 5 rides attended |
| Road Scholar | Organised your first ride | Common | 1 ride organised |
| 500 km Rider | Ridden 500 km total | Rare | 500 km cumulative |
| 10 Rides Veteran | Completed 10 rides | Rare | 10 rides attended |
| Streak Master | Maintained a 30-day streak | Epic | 30-day streak |
| 5000 km Legend | Ridden 5000 km total | Epic | 5000 km cumulative |
| Century Rider | Completed 100 rides | Legendary | 100 rides attended |
| Elite Organiser | Organised 50 rides | Legendary | 50 rides organised |
| Mentor Champion | Helped 10 new riders | Epic | 10 mentor actions |

### Display on Profile
- **Earned:** Full colour tile, name, description, points, earned date, rarity glow
- **Locked:** Greyed tile with lock icon, name visible to tease next goal

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

## 4. Challenges

Time-limited tasks with a deadline. Unlike achievements (permanent milestones),
challenges expire and are periodically refreshed.

### Challenge Data Model

```typescript
Challenge {
  name: string
  description: string
  progress: number        // 0–100 (percentage complete)
  expiresAt: string       // ISO date string
  reward: string          // e.g. "Gold Badge + 300 pts"
  type: "distance" | "rides" | "social" | "organiser" | "exploration"
}
```

### Sample Challenges

| Challenge | Type | Reward | Duration |
|---|---|---|---|
| April Distance Sprint | distance | 200 pts | Month of April |
| Weekend Back-to-back | rides | Epic badge + 300 pts | 2 consecutive weekends |
| New Connections | social | 100 pts + Rare badge | 7 days |
| Organise & Explore | organiser | 250 pts | 30 days |
| Discover 3 new routes | exploration | 150 pts | 14 days |

### Display
- Progress bar with percentage
- Time remaining countdown (e.g. "5 days left")
- Reward label
- Expired challenges hidden automatically

---

## 5. Organiser Rank

Riders who organise rides progress through a **separate rank ladder**:

| Rank Name | Rides organised | Badge |
|---|---|---|
| New Organiser | 1–5 | Gray |
| Regular Organiser | 6–15 | Bronze |
| Experienced Organiser | 16–30 | Silver |
| Veteran Organiser | 31–50 | Gold |
| Elite Organiser | 50+ | Platinum |

**Displayed on Profile:**
- Current rank name + badge icon
- Rides to next rank (e.g. "8 more rides to Experienced")
- Progress bar to next rank

**Effect on the app:**
- Higher-ranked organisers get a special badge on their ride cards (shown to
  potential joiners as a trust signal)
- Organiser rank is part of the public profile visible to other riders

---

## 6. Points Leaderboard (Planned)

A platform-wide or city-wide leaderboard showing top riders by points.

**Planned data:**
- User rank number + avatar + name + points total
- "Your rank" card pinned at bottom when user is not in top 10
- Filter: all-time / this month / this week

**Status:** Not implemented — type `RideStats.rank` exists in the data model but no
leaderboard screen or API endpoint is built.

---

## Gamification Data on UserProfile

Full profile stats object:

```typescript
RideStats {
  totalRides: number
  ridesOrganised: number
  totalDistance: number       // km
  currentStreak: number       // days
  longestStreak: number       // days
  noShows: number
  points: number
  rank: number                // leaderboard position
}
```

---

## Feature Score

| Feature | Status |
|---|---|
| Points display on profile | Implemented |
| Points display on plan ride | Implemented |
| Streak progress bars | Implemented |
| Multiple streak types | Implemented |
| Streak reward on route cards | Implemented |
| Achievements with rarity tiers | Implemented |
| Locked achievement teasers | Implemented |
| Time-limited challenges | Implemented |
| Challenge progress bars + countdown | Implemented |
| Organiser rank ladder | Implemented |
| Organiser rank progress bar | Implemented |
| Points earned on actions (live) | Not implemented (static data) |
| Streak auto-increment / reset logic | Not implemented (backend) |
| Achievement unlock notifications | Not implemented |
| Leaderboard screen | Not implemented |
| Challenge refresh cycle | Not implemented |
| Referral / sharing rewards | Not implemented |
| Seasonal events / bonus challenges | Not implemented |
