# 15 — UI System & Design Language

## Overview

RidersTurn uses **shadcn/ui** (built on Radix UI primitives) as its component
foundation, styled with **Tailwind CSS**. The design language is mobile-first, warm
(orange as primary), and oriented around cards, drawers, and bottom-sheet patterns
typical of consumer mobile apps.

---

## Colour Palette

| Role | Colour | Usage |
|---|---|---|
| Primary / Brand | Orange (#F97316 / `orange-500`) | Buttons, active nav, badges, streaks |
| Background | White / `gray-50` | Page backgrounds |
| Surface | White with shadow | Cards, modals |
| Text primary | `gray-900` | Headings, body |
| Text secondary | `gray-500` | Subtitles, labels |
| Success | Green (`green-500`) | Online status, healthy state |
| Warning | Yellow (`yellow-500`) | Delay notifications, warnings |
| Error | Red (`red-500`) | Form errors, down status |
| Destructive | Red | Block user, delete actions |

**Ride type gradient map (`src/constants/index.ts → TYPE_GRADIENTS`):**
Each ride type has a specific Tailwind gradient class for card backgrounds.

---

## Typography

- Font: system sans-serif stack (no custom font loaded)
- Headings: `font-bold` or `font-semibold`
- Body: `text-sm` or `text-base`
- Labels: `text-xs text-gray-500`
- All spacing via Tailwind utility classes

---

## Navigation

### Mobile — Bottom Navigation Bar (`MobileBottomNav`)
File: `src/components/MobileBottomNav.tsx`

5 tabs with icons + labels:

| Tab | Icon | Route | Notes |
|---|---|---|---|
| Discover | Home | `/` | Default landing |
| My Rides | Calendar | `/my-rides` | |
| Explore | Compass | `/explore` | **Centre floating button**, larger |
| Alerts | Bell | `/notifications` | Red badge with unread count |
| Profile | User | `/profile` | |

Active tab: orange icon + label. Inactive: gray.
The Explore tab is a floating raised circular button (FAB-style) in the centre.

### Desktop — Sidebar (`AppSidebar`)
File: `src/components/app-sidebar.tsx`

Left sidebar with:
- App logo + tagline in header
- Same 5 nav items as bottom nav (as text links with icons)
- Version info in footer
- Powered by Radix UI `<SidebarProvider>` + `<Sidebar>` primitive

### AppLayout
File: `src/components/layout/AppLayout.tsx`

Wraps every protected screen:
- On mobile: renders `MobileBottomNav` at bottom
- On desktop: renders `AppSidebar` on left with main content beside it
- Uses `use-mobile.tsx` hook for breakpoint detection

---

## GlobalHeader
File: `src/components/GlobalHeader.tsx`

Sticky top bar, configurable per screen via props:

| Prop | Type | Effect |
|---|---|---|
| `title` | string | Text shown in centre |
| `showBack` | boolean | Back arrow on left |
| `showSearch` | boolean | Search icon on right |
| `showLocation` | boolean | City picker on left |
| `showFilter` | boolean | Filter icon with badge count |
| `showNotifications` | boolean | Bell icon with unread badge |

**Location picker:**
- Dropdown showing `POPULAR_LOCATIONS` constant (10 Indian cities)
- Stores selected city in local state (no URL param, no global state)

---

## shadcn/ui Components Used

### Forms
- `Input`, `Textarea`, `Label`, `Button`
- `Checkbox`, `RadioGroup`, `Select`, `Switch`

### Overlays
- `Dialog` (modal), `Drawer` (bottom sheet / side panel)
- `AlertDialog` (confirmation dialogs)
- `Popover`, `HoverCard`

### Data Display
- `Card`, `Badge`, `Avatar`, `Separator`
- `Table`, `Tabs`, `Accordion`
- `Progress`, `Skeleton`

### Navigation
- `DropdownMenu`, `NavigationMenu`, `Menubar`, `ContextMenu`

### Feedback
- `Sonner` (toast notifications — replaces old Toaster)
- `Toast` component (shadcn's own, kept as backup)

### Layout
- `Sidebar` (desktop nav)
- `ScrollArea`, `AspectRatio`, `Resizable`

### Advanced
- `Carousel` (stories, trending rows)
- `Slider` (filter range inputs)
- `Chart` (Recharts wrapper — available but not yet used in screens)

Total shadcn/ui component files: **50+** in `src/components/ui/`

---

## Custom Components

| Component | File | Purpose |
|---|---|---|
| FadeIn | `src/components/FadeIn.tsx` | Fade-in animation wrapper for screen transitions |
| ScrollIndicator | `src/components/ScrollIndicator.tsx` | Scroll position progress bar at top |
| RideChat | `src/components/RideChat.tsx` | Group chat with organiser announcement badge |
| PhotoGallery | `src/components/PhotoGallery.tsx` | Full-screen photo carousel lightbox |
| ErrorBoundary | `src/components/ErrorBoundary.tsx` | React error boundary wrapper |
| ErrorHandler | `src/components/ErrorHandler.tsx` | Error state display with retry button |

---

## Skeleton / Loading States

| Component | File | Used in |
|---|---|---|
| HomeScreenSkeleton | `src/components/home/HomeScreenSkeleton.tsx` | Home initial load |
| RideCardSkeleton | `src/components/home/RideCardSkeleton.tsx` | Per ride card while loading |
| SkeletonList | `src/components/home/SkeletonList.tsx` | Reusable list skeleton |
| Skeleton (shadcn) | `src/components/ui/skeleton.tsx` | All other skeleton uses |

---

## Animation & Transitions
- `FadeIn` component wraps screens for page-load fade
- Tailwind `transition`, `duration-200`, `ease-in-out` for hover states
- Drawer/Dialog use Radix UI built-in animation (slide up / fade)
- No custom CSS animations beyond Tailwind utilities

---

## Responsiveness
- Mobile breakpoint: `< 768px` (detected via `use-mobile.tsx` hook using `window.matchMedia`)
- All screens designed mobile-first
- Desktop sidebar visible at `md:` breakpoint and above
- Bottom nav hidden on desktop
- Card grids use responsive column counts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)

---

## Utility Functions

```typescript
// src/lib/utils.ts
cn(...inputs)                          // clsx + tailwind-merge

// src/lib/rideUtils.ts
formatRideDate(dateString)             // "Today", "Tomorrow", or "Mon, 10 Apr"
getTimeUntilRide(dateString)           // "2 hours away", "in 3 days"
getRideTypeEmoji(type)                 // "🍳" for Breakfast, "🏕️" for Adventure, etc.
getDifficultyColor(difficulty)         // Tailwind class string for Easy/Moderate/Hard
getDifficultyFromDistance(km)          // "Easy" | "Moderate" | "Hard"
getDifficultyColorFromDistance(km)     // Combined colour class from distance
```

---

## Feature Score

| Feature | Status |
|---|---|
| shadcn/ui component library | Implemented |
| Mobile bottom navigation | Implemented |
| Desktop sidebar navigation | Implemented |
| Responsive layout | Implemented |
| GlobalHeader (configurable) | Implemented |
| Location picker in header | Implemented |
| Skeleton loading states | Implemented |
| Toast notifications (Sonner) | Implemented |
| FadeIn page transitions | Implemented |
| Error boundary | Implemented |
| Dark mode | Not implemented |
| Custom font (branded) | Not implemented |
| Accessibility (ARIA, WCAG) | Partial (Radix handles basics) |
| Keyboard navigation (full) | Partial (Radix handles basics) |
| RTL support | Not implemented |
