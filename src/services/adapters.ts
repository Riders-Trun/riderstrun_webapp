import type { Ride, MyRide } from "@/types";

/**
 * Translates backend ride rows into the view models the UI renders.
 *
 * The two shapes differ in three ways, so nothing lines up without this layer:
 *   • naming    — snake_case columns vs camelCase props (`max_riders` → `maxRiders`)
 *   • types     — UUID ids, ISO timestamps and numeric distances vs display strings
 *   • coverage  — some UI fields (ratings, distance-from-user) have no backend source
 *
 * Fields with no backend source are simply left undefined; the components already
 * treat them as optional, so they render conditionally rather than showing blanks.
 */

/** A ride row exactly as the API returns it. */
export interface ApiRide {
  id: string;
  title: string;
  description?: string | null;
  start_date: string;
  start_location: string;
  end_location?: string | null;
  distance_km?: number | string | null;
  ride_type?: string | null;
  visibility?: string;
  status?: string;
  auto_approve?: boolean;
  max_riders?: number | string | null;
  pillion_slots?: number | string | null;
  trip_code?: string | null;
  brand_filter?: string | null;
  vehicle_type?: string | null;
  price?: number | string | null;
  currency?: string | null;
  organizer_id?: number | string;
  organizer_name?: string | null;
  participant_count?: number | string;
  created_at?: string;
}

/**
 * Postgres hands back COUNT(*) as a bigint string and DECIMAL columns as strings,
 * so numeric fields arrive as strings more often than you would expect.
 */
function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/**
 * en-IN renders the meridiem lowercase ("6:00 am"), but the rest of the app —
 * mock data and `formatRideDate` in rideUtils — uses "6:00 AM". Normalise so
 * real and mock rides read identically.
 */
function clockTime(date: Date): string {
  return date
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
    .replace(/\b(am|pm)\b/gi, (m) => m.toUpperCase());
}

/** ISO timestamp → "Today, 6:00 AM" / "Tomorrow, 5:30 AM" / "12 Jun, 6:00 AM". */
export function formatRideDate(iso?: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const time = clockTime(date);

  const dayDiff = Math.round((startOfDay(date) - startOfDay(new Date())) / 86_400_000);
  if (dayDiff === 0) return `Today, ${time}`;
  if (dayDiff === 1) return `Tomorrow, ${time}`;
  if (dayDiff === -1) return `Yesterday, ${time}`;

  const day = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${day}, ${time}`;
}

/** 80 → "80 km". Returns "" when the backend has no distance recorded. */
export function formatDistance(km?: number | string | null): string {
  const n = toNumber(km);
  return n === undefined ? "" : `${n} km`;
}

/** "Hebbal Flyover" + "Nandi Hills" → "Hebbal Flyover → Nandi Hills". */
export function composeLocation(start?: string | null, end?: string | null): string {
  if (start && end) return `${start} → ${end}`;
  return start ?? end ?? "";
}

/** Backend ride row → the `Ride` card view model. */
export function toRide(api: ApiRide, currentUserId?: number): Ride {
  return {
    id: api.id,
    title: api.title,
    date: formatRideDate(api.start_date),
    distance: formatDistance(api.distance_km),
    organizer: api.organizer_name ?? "",
    location: composeLocation(api.start_location, api.end_location),
    type: api.ride_type ?? "",
    joinedCount: toNumber(api.participant_count) ?? 0,
    maxRiders: toNumber(api.max_riders) ?? 0,
    isOrganizer:
      currentUserId !== undefined && toNumber(api.organizer_id) === currentUserId,
    // No backend source — omitted so the UI can skip it rather than render a blank.
    distanceFromUser: undefined,
    pillionSlots: toNumber(api.pillion_slots),
    pillionAvailable: (toNumber(api.pillion_slots) ?? 0) > 0,
    tripCode: api.trip_code ?? undefined,
    brand: api.brand_filter ?? undefined,
    createdAt: api.created_at,
  };
}

/** A participant as GET /api/rides/:id returns them. */
export interface ApiParticipant {
  username?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  status?: string | null;
}

/** ISO timestamp → "6:00 AM". */
export function formatTime(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return clockTime(d);
}

/** Rough difficulty from distance, matching the buckets the mock data used. */
export function difficultyFromKm(km?: number | string | null): string {
  const n = toNumber(km);
  if (n === undefined) return "";
  if (n < 50) return "Easy";
  if (n < 100) return "Moderate";
  return "Hard";
}

/**
 * Backend ride row → the ride-details view model.
 *
 * Only covers what the API actually returns. The richer sections of that screen
 * (costs, route, weather, safety gear, schedule, rules, previous trips, reviews,
 * organizer rating/phone) have no backend source at all, so they are simply
 * absent here and the screen hides those sections rather than inventing data.
 */
export function toRideDetail(
  api: ApiRide,
  participants: ApiParticipant[] = [],
  currentUserId?: number
) {
  const base = toRide(api, currentUserId);
  return {
    ...base,
    description: api.description ?? undefined,
    startLocation: api.start_location ?? "",
    destination: api.end_location ?? "",
    startTime: formatTime(api.start_date),
    time: formatTime(api.start_date),
    difficulty: difficultyFromKm(api.distance_km),
    maxPillion: toNumber(api.pillion_slots),
    status: api.status ?? "",
    participantCount: participants.length || base.joinedCount,
  };
}

/** Backend ride row → the `MyRide` list view model. */
export function toMyRide(api: ApiRide, currentUserId?: number): MyRide {
  return {
    id: api.id,
    title: api.title,
    date: formatRideDate(api.start_date),
    distance: formatDistance(api.distance_km),
    organizer: api.organizer_name ?? "",
    type: api.ride_type ?? "",
    joinedCount: toNumber(api.participant_count) ?? 0,
    maxRiders: toNumber(api.max_riders),
    status: api.status ?? "",
    isCurrentUserOrganizer:
      currentUserId !== undefined && toNumber(api.organizer_id) === currentUserId,
  };
}
