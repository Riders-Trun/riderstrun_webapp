# 08 — Explore Screen

## Overview

The Explore Screen is the **community and social hub** of RidersTurn. It goes beyond
rides and into the rider community: find nearby riders, form crews, follow mentors,
view ride moments (photos), join community initiatives, and watch stories.

**Route:** `/explore`
**File:** `src/components/screens/ExploreScreen.tsx`
**Sub-components:** `src/components/explore/`
**Data:** `src/data/explore.ts`
**Types:** `src/types/explore.ts`

---

## Layout Structure

```
GlobalHeader ("Explore")
ExploreSearchBar

StoriesCarousel  (horizontal scroll)

ContentSectionCarousel: "Nearby Riders"
ContentSectionCarousel: "Crew Finder"
ContentSectionCarousel: "Mentors"
ContentSectionCarousel: "Ride Moments"
ContentSectionCarousel: "Community Initiatives"
ContentSectionCarousel: "Trending Routes"
ContentSectionCarousel: "Rider Spotlights"
ContentSectionCarousel: "Community Challenges"
```

Each `ContentSectionCarousel` is a section with a title, "See all" link, and a
horizontal scroll row of cards.

---

## Features

### Search Bar (ExploreSearchBar)
- Searches across: riders, routes, posts
- Results update dynamically
- File: `src/components/explore/ExploreSearchBar.tsx`

---

### Stories Carousel (StoriesCarousel)
Instagram/WhatsApp-style circular story avatars at the top.

- Horizontal scroll row of user avatars with names
- Tapping a story opens the **StoryViewer** modal
- First tile is always "+ Add Story" which opens **StoryCreator**

**StoryViewer (`src/components/explore/StoryViewer.tsx`):**
- Full-screen story display
- Progress bar at top (auto-advances after a few seconds)
- Tap left / right to go to previous / next story
- Stories can be text-only or image + text

**StoryCreator (`src/components/explore/StoryCreator.tsx`):**
- Text input for caption
- Image upload option (UI only, no server upload yet)
- Post story button

---

### Nearby Riders (NearbyRiderCard)
Cards showing other riders in the user's city.

**Card shows:**
- Avatar, name, online status dot (green = online)
- Riding level (beginner / intermediate / expert)
- Bike type
- Mutual connections count
- Match percentage (calculated compatibility)
- "Connect" and "Invite" buttons

**Actions:**
- **Connect** → `socialApi.connectionAction(userId, "connect")` → sends connection request
- **Invite** → `socialApi.connectionAction(userId, "invite")` → invites to upcoming ride
- Tap card → opens **RiderProfileModal**

**RiderProfileModal (`src/components/explore/RiderProfileModal.tsx`):**
Full-page rider profile overlay showing all public details, achievements, rides.
Has a "Message" button → opens **QuickChatModal**.

**QuickChatModal (`src/components/explore/QuickChatModal.tsx`):**
Lightweight 1-on-1 chat popup with message history and text input.

---

### Crew Finder (CrewFinder)
Group intent/request cards — riders broadcasting that they want a crew.

**Card (CrewIntent type) shows:**
- Organiser name + avatar
- Intended destination + date
- Riders needed (e.g. "Need 3 more")
- Ride type badge
- "Join Crew" button

**Action:** Tap "Join Crew" → adds user to that crew intent.

---

### Mentors (MentorHighlightCard)
Expert riders who offer guidance to beginners.

**Card (Mentor type) shows:**
- Avatar, name, years of riding
- Specialisation (e.g. Mountain routes, Long distance)
- Achievements count and top achievement badge
- Total distance ridden stat
- "Follow" button + "Message" button

**Actions:**
- Follow → updates following state
- Message → opens QuickChatModal

---

### Ride Moments (RideMomentCard)
Photo moments shared by riders from past rides.

**Card shows:**
- Photo (full width card)
- Rider name + avatar
- Caption, location tag, ride name
- Like count + Comment count
- Like button (heart) + Comment button

**Tap card** → opens **PostDetailModal** with full post + comments.

**PostDetailModal (`src/components/explore/PostDetailModal.tsx`):**
- Full-screen image view
- Caption and tags
- Comments list with avatar + name + text
- Add comment input

---

### Community Initiatives (CommunityInitiativeCard)
Real-world events and causes the riding community organises.

**Card shows:**
- Event type icon (blood donation, women's workshop, safety drill, etc.)
- Title and description
- Date and location
- Participant count
- "Register" button

---

### Trending Routes (RideRouteCard)
Popular routes suggested by the community.

**Card shows:**
- Route name + cover photo
- Distance, difficulty, rating stars
- "View Route" link → opens **RouteDetailsModal**

**RouteDetailsModal (`src/components/explore/RouteDetailsModal.tsx`):**
- Full route map placeholder
- Key highlights, waypoints
- Community reviews / ratings

---

### Rider Spotlights (RiderSpotlightCard)
Featured/top riders highlighted by the platform.

**Card shows:**
- Large avatar + name
- "Rider of the week/month" badge
- Top achievement
- Rides organised / distance covered
- Follow button

---

### Community Challenges (CommunityChallengeCard)
Platform-wide challenges all riders can participate in.

**Card shows:**
- Challenge name and description
- Progress bar (global: X% of community completed)
- Time remaining
- Points reward
- "Join Challenge" button

---

## Data Types (src/types/explore.ts)

```typescript
NearbyRider       { id, name, avatar, status, ridingLevel, bike, mutuals, matchPercent }
CrewIntent        { id, organiser, destination, date, ridersNeeded, type }
Mentor            { id, name, avatar, yearsRiding, specialisation, achievements, distance }
RideMoment        { id, rider, photo, caption, location, likes, comments }
CommunityInitiative { id, type, title, description, date, location, participants }
```

---

## Social API Calls

```typescript
socialApi.getConnections(status?)           // list connections
socialApi.connectionAction(userId, action)  // connect | invite | follow | unfollow
socialApi.search(query)                     // search riders/routes/posts
socialApi.suggestions()                     // recommended riders
socialApi.mutuals(userId)                   // shared connections with a rider
```

---

## Feature Score

| Feature | Status |
|---|---|
| Stories carousel (view) | Implemented |
| Story viewer (full-screen) | Implemented |
| Story creator | Implemented (UI only, no upload) |
| Nearby riders cards | Implemented |
| Connect / Invite actions | Implemented (API wired) |
| Rider profile modal | Implemented |
| Quick chat modal | Implemented (UI only, no real-time) |
| Crew finder | Implemented |
| Mentors section | Implemented |
| Ride moments / photos | Implemented |
| Post detail modal | Implemented |
| Community initiatives | Implemented |
| Trending routes | Implemented |
| Route details modal | Implemented |
| Rider spotlights | Implemented |
| Community challenges | Implemented |
| Explore search | Implemented (UI, no backend) |
| Real-time messaging | Not implemented |
| Push notifications for connects | Not implemented |
| Infinite scroll per section | Not implemented |
| User-generated story upload | Not implemented |
