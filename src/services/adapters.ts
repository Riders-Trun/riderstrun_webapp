import type { Ride, MyRide, UserProfile } from "@/types";

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

// ── Profile ───────────────────────────────────────────────────────────────────

/** The profile row as the API returns it (snake_case, storage-shaped). */
export interface ApiProfile {
  username?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  bio?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  riding_level?: string | null;
  bikes?: { model?: string; type?: string; brand?: string }[] | null;
  emergency_contact?: { name?: string; phone?: string; relation?: string } | null;
}

/** "Royal Enfield Classic 350" from the first bike on file, brand then model. */
function describeBike(bikes: ApiProfile["bikes"]): string {
  const bike = bikes?.[0];
  if (!bike) return "";
  return [bike.brand, bike.model].filter(Boolean).join(" ").trim();
}

/**
 * Backend profile → the `UserProfile` the screen renders.
 *
 * The two shapes differ more than the others: the API stores `city`/`state`
 * separately and bikes as a list, while the screen shows one location string
 * and one bike. Composing here keeps that translation in one tested place
 * rather than spread through JSX.
 */
export function toUserProfile(api: ApiProfile): UserProfile {
  return {
    name: api.full_name ?? "",
    phone: api.phone_number ?? "",
    email: api.email ?? "",
    bike: describeBike(api.bikes),
    ridingLevel: api.riding_level ?? "",
    location: [api.city, api.state].filter(Boolean).join(", "),
    emergencyContact: {
      name: api.emergency_contact?.name ?? "",
      phone: api.emergency_contact?.phone ?? "",
      relation: api.emergency_contact?.relation ?? "",
    },
  };
}

/**
 * `UserProfile` → the body POST /api/profile expects.
 *
 * `location` is split back into city/state on the first comma. Anything the
 * screen does not edit — username, bio, bikes, riding styles, social links —
 * is passed through from the row we loaded, because the endpoint upserts the
 * whole profile and omitting a field would erase it.
 */
export function fromUserProfile(
  form: UserProfile,
  existing: ApiProfile
): Record<string, unknown> {
  const [city, state] = form.location.split(",").map((part) => part.trim());

  return {
    // Required by ProfileSchema, and not editable on this screen.
    username: existing.username ?? "",
    full_name: form.name,
    phone_number: form.phone || undefined,
    bio: existing.bio ?? undefined,
    city: city || undefined,
    state: state || undefined,
    country: existing.country ?? undefined,
    bikes: existing.bikes ?? undefined,
    riding_level: form.ridingLevel || undefined,
    emergency_contact:
      form.emergencyContact.name || form.emergencyContact.phone
        ? form.emergencyContact
        : undefined,
  };
}
