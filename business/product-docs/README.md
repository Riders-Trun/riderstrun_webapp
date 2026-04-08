# RidersTurn — Product Documentation Index

> **App:** RidersTurn Web App (`riderstrun_webapp`)
> **Stack:** React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, TanStack Query, React Router v6
> **Deployment:** Vercel (prod + dev via GitHub Actions CI/CD)
> **Last documented:** April 2026

---

## What is RidersTurn?

RidersTurn is a **motorcycle riding community platform** built for Indian riders
(currently centred around Bangalore). It lets riders discover rides, plan their own
rides, join rides via trip codes, track their riding history, explore the riding
community, and connect with other riders.

The app is mobile-first with a bottom navigation bar on mobile and a sidebar on desktop.

---

## Documentation Structure

| File | Feature Area |
|---|---|
| [01-architecture.md](./01-architecture.md) | Tech stack, routing, auth, API layer, data flow |
| [02-authentication.md](./02-authentication.md) | Login, Signup, JWT session, Admin gate |
| [03-home-screen.md](./03-home-screen.md) | Ride discovery feed, search, filters, trending |
| [04-ride-details.md](./04-ride-details.md) | Full ride info, costs, weather, safety, reviews |
| [05-plan-ride.md](./05-plan-ride.md) | Ride creation form, presets, popular routes |
| [06-join-ride.md](./06-join-ride.md) | Trip code entry, quick access codes |
| [07-my-rides.md](./07-my-rides.md) | Upcoming, past, and organised ride tabs |
| [08-explore.md](./08-explore.md) | Community feed, stories, crew finder, mentors |
| [09-route-discovery.md](./09-route-discovery.md) | Route detail: overview, route, talks, photos |
| [10-location-planner.md](./10-location-planner.md) | Destination discovery, filters, fuel/dining |
| [11-travel-diary.md](./11-travel-diary.md) | Personal ride journal, entries, photos |
| [12-notifications.md](./12-notifications.md) | Ride reminders, updates, delay alerts |
| [13-profile.md](./13-profile.md) | Rider profile, stats, streaks, achievements |
| [14-admin-panel.md](./14-admin-panel.md) | Admin dashboard: users, rides, health |
| [15-ui-system.md](./15-ui-system.md) | Design system, components, navigation |
| [16-api-layer.md](./16-api-layer.md) | API service, JWT tokens, all endpoints |
| [17-gamification.md](./17-gamification.md) | Points, streaks, achievements, ranks |

---

## Key User Roles

- **Rider (default)** — Browse, join, and plan rides. Has profile, diary, notifications.
- **Organiser** — Any rider who creates a ride. Has edit/share controls on that ride.
- **Admin** — `role: "admin"` in JWT. Access to `/admin` panel only.
