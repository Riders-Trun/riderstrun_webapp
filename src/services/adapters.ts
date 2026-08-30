import type { Ride, MyRide, UserProfile, Notification, NearbyRider, CrewIntent } from "@/types";

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
    // Kept alongside the formatted `date` label so "earliest" can sort on a real
    // timestamp instead of trying to parse "Today, 6:00 AM".
    startDate: api.start_date,
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

// ── Notifications ─────────────────────────────────────────────────────────────

/** The notification row as the API returns it. */
export interface ApiNotification {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  actor_name?: string | null;
  ride_id?: string | null;
  is_read: boolean;
  created_at: string;
}

/** "2h ago" — coarse on purpose; an exact timestamp is noise in a list. */
export function relativeTime(iso?: string | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(iso).toLocaleDateString();
}

/** What tapping a notification offers to do, by type. */
const NOTIFICATION_ACTIONS: Record<string, string> = {
  ride_join_request: "Review request",
  ride_join_approved: "View ride",
  ride_comment: "View comment",
  ride_completed: "View ride",
  ride_left: "View ride",
  crew_joined: "View crew",
  connection_request: "View request",
  connection_accepted: "View profile",
};

/** Backend notification → the `Notification` the screen renders. */
export function toNotification(api: ApiNotification): Notification {
  return {
    id: api.id,
    type: api.type as Notification["type"],
    title: api.title,
    // The actor's name is the useful detail when there is no body text.
    message: api.body ?? (api.actor_name ? `From ${api.actor_name}` : ""),
    time: relativeTime(api.created_at),
    isRead: api.is_read,
    action: NOTIFICATION_ACTIONS[api.type] ?? "View",
    rideId: api.ride_id ?? undefined,
  };
}


// ── Riders (social search & suggestions) ──────────────────────────────────────

/**
 * A rider row from `/api/social/search` or `/api/social/suggestions`.
 *
 * `user_id` is present on suggestions but never on search results, which project
 * only the public profile columns on both storage engines. That is why it is
 * optional here, and why `username` is what the connect path actually uses.
 */
export interface ApiRider {
  user_id?: number | string;
  userId?: number | string;
  username?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  city?: string | null;
  rides_together_count?: number | string;
  reason?: string | null;
}

/**
 * Rider row → the card's view model.
 *
 * Several fields the card can show — live status, streak, points, distance away,
 * riding styles — have no backend source at all. Rather than invent them, they
 * are left at neutral values: status is always "looking", and the optional ones
 * stay undefined so the card omits those badges entirely.
 *
 * `id` is 0 for a search row, which carries no id by design. That is not a dead
 * end: `username` is always present, and the connections endpoint accepts a
 * username in place of an id — so every rider here can be acted on either way.
 */
export function toNearbyRider(api: ApiRider): NearbyRider {
  const id = toNumber(api.user_id ?? api.userId) ?? 0;
  return {
    id,
    username: api.username,
    name: api.full_name || api.username || "Rider",
    avatar: api.avatar_url ?? "",
    bike: "",
    points: 0,
    streak: 0,
    // The card renders this verbatim, so it carries the city — the only
    // location the backend actually knows — rather than a fabricated "2.4 km".
    distance: api.city ?? "",
    status: "looking",
    rideStyle: [],
    lastSeen: api.reason ?? "",
    isOnline: false,
    mutualConnections: toNumber(api.rides_together_count),
  };
}


// ── Ride form → API payload ───────────────────────────────────────────────────

export interface RideFormValues {
  title: string;
  type: string;
  date: string;
  time: string;
  startPoint: string;
  destination: string;
  maxRiders: string;
  description?: string;
  role?: string;
  selectedRoute?: string;
}

/**
 * The plan-a-ride form → the body `POST /api/rides` actually accepts.
 *
 * This layer was missing entirely: the form's own field names were sent as-is,
 * so the server saw `startPoint` where it required `start_location` and no
 * `start_date` at all, and rejected every submission. Nothing caught it because
 * the screen was only ever exercised in mock mode.
 *
 * `pitStops` and `rules` have no columns of their own; they ride along in
 * `requirements`, which is the schema's free-form object.
 */
export function fromRideForm(
  form: RideFormValues,
  extras: { pitStops: string[]; rules: string[] }
): Record<string, unknown> {
  const maxRiders = toNumber(form.maxRiders);

  return {
    title: form.title,
    ...(form.description ? { description: form.description } : {}),
    // The two inputs are a local date and a local time. Constructing the Date
    // from "YYYY-MM-DDTHH:mm" reads them in the rider's own zone, which is what
    // they meant, and toISOString hands the server the UTC instant it wants.
    start_date: new Date(`${form.date}T${form.time}`).toISOString(),
    start_location: form.startPoint,
    ...(form.destination ? { end_location: form.destination } : {}),
    ...(form.type ? { ride_type: form.type } : {}),
    // Blank means no limit, which the column stores as NULL — so omit it rather
    // than sending 0, which would be a ride nobody can join.
    ...(maxRiders !== undefined ? { max_riders: maxRiders } : {}),
    ...(extras.pitStops.length || extras.rules.length
      ? { requirements: { pitStops: extras.pitStops, rules: extras.rules } }
      : {}),
  };
}


// ── Stories ───────────────────────────────────────────────────────────────────

/** A story group as the carousel renders it: one entry per author. */
export interface StoryCarouselEntry {
  id: number;
  user: { name: string; avatar: string; isViewed?: boolean };
  preview: string;
  hasNew?: boolean;
}

/** The same group as the viewer renders it: the author, then their stories. */
export interface StoryViewerEntry {
  id: number;
  user: { name: string; avatar: string };
  content: {
    id: string;
    type: "image" | "text";
    url?: string;
    text?: string;
    caption?: string;
    backgroundColor?: string;
    textColor?: string;
  }[];
  timestamp: string;
}

interface ApiStoryGroupShape {
  user_id: number;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  is_self?: boolean;
  all_viewed?: boolean;
  items?: {
    id: string;
    story_type: "image" | "text";
    content: string;
    caption?: string | null;
    background_color?: string | null;
    text_color?: string | null;
    created_at?: string;
    is_viewed?: boolean;
  }[];
}

const authorName = (g: ApiStoryGroupShape) =>
  g.is_self ? "Your story" : g.full_name || g.username || "Rider";

/**
 * Story group → the carousel row.
 *
 * `preview` is the thumbnail behind the avatar ring. A text story has no image
 * to show, so it falls back to the author's avatar rather than a broken one.
 */
export function toStoryCarouselEntry(group: ApiStoryGroupShape): StoryCarouselEntry {
  const firstImage = (group.items ?? []).find((item) => item.story_type === "image");
  return {
    id: group.user_id,
    user: {
      name: authorName(group),
      avatar: group.avatar_url ?? "",
      isViewed: group.all_viewed ?? false,
    },
    preview: firstImage?.content ?? group.avatar_url ?? "",
    hasNew: !(group.all_viewed ?? false),
  };
}

/**
 * Story group → the full-screen viewer.
 *
 * Each item becomes one slide, and `content` means different things by type —
 * a URL for an image, the words themselves for text — so it is split into `url`
 * and `text` here rather than leaving the viewer to guess.
 */
export function toStoryViewerEntry(group: ApiStoryGroupShape): StoryViewerEntry {
  const items = group.items ?? [];
  return {
    id: group.user_id,
    user: { name: authorName(group), avatar: group.avatar_url ?? "" },
    content: items.map((item) => ({
      id: item.id,
      type: item.story_type,
      url: item.story_type === "image" ? item.content : undefined,
      text: item.story_type === "text" ? item.content : undefined,
      caption: item.caption ?? undefined,
      backgroundColor: item.background_color ?? undefined,
      textColor: item.text_color ?? undefined,
    })),
    timestamp: relativeTime(items[0]?.created_at),
  };
}


// ── Ride moments ──────────────────────────────────────────────────────────────

interface ApiMomentShape {
  id: string;
  ride_id: string;
  ride_title: string;
  image: string;
  location?: string | null;
  date?: string | null;
  participant_count?: number;
  rider: { user_id: number; username?: string | null; full_name?: string | null; avatar_url?: string | null };
  tagged_riders?: string[];
  tagged_overflow?: number;
  next_ride?: { id: string; title: string; start_date: string } | null;
}

/** The moment view model the card renders. */
export interface MomentView {
  id: string;
  rideId: string;
  rider: { name: string; avatar: string };
  image: string;
  location: string;
  rideTitle: string;
  date: string;
  participantsCount: number;
  taggedRiders: string[];
  hasUpcomingRide: boolean;
  upcomingRideId?: string;
  upcomingRideDate?: string;
}

/**
 * API moment → card.
 *
 * `taggedRiders` absorbs the overflow count as a final "+N more" entry, because
 * the card renders the array verbatim and has nowhere else to put the number.
 */
export function toMoment(api: ApiMomentShape): MomentView {
  const named = api.tagged_riders ?? [];
  const overflow = api.tagged_overflow ?? 0;

  return {
    id: api.id,
    rideId: api.ride_id,
    rider: {
      name: api.rider.full_name || api.rider.username || "Rider",
      avatar: api.rider.avatar_url ?? "",
    },
    image: api.image,
    location: api.location ?? "",
    rideTitle: api.ride_title,
    date: formatRideDate(api.date),
    participantsCount: api.participant_count ?? 0,
    taggedRiders: overflow > 0 ? [...named, `+${overflow} more`] : named,
    hasUpcomingRide: Boolean(api.next_ride),
    upcomingRideId: api.next_ride?.id,
    upcomingRideDate: api.next_ride ? formatRideDate(api.next_ride.start_date) : undefined,
  };
}


// ── Crews ─────────────────────────────────────────────────────────────────────

interface ApiCrewShape {
  id: string;
  creator_id: number;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  title: string;
  description?: string | null;
  looking_for: number;
  member_count?: number;
  ride_type?: string | null;
  time_preference?: string | null;
  skill_level?: string | null;
  route?: string | null;
  speed?: string | null;
  ride_date?: string | null;
  requirements?: string[];
  created_at?: string;
}

/**
 * API crew → the CrewFinder card.
 *
 * `lookingFor` becomes the crew's *full size* here, not the number still wanted.
 * The card compares `currentMembers >= lookingFor` to decide whether it is full,
 * so it needs the total — while the API speaks in riders-still-wanted, which is
 * how the person writing the intent thinks about it. This is where the two meet.
 */
export function toCrewIntent(api: ApiCrewShape): CrewIntent {
  return {
    id: api.id,
    creator: {
      name: api.full_name || api.username || "Rider",
      avatar: api.avatar_url ?? "",
      // No rating: nothing in this system computes one.
    },
    title: api.title,
    description: api.description ?? "",
    lookingFor: api.looking_for + 1,
    currentMembers: api.member_count ?? 0,
    rideType: api.ride_type ?? "",
    timePreference: api.time_preference ?? "",
    skillLevel: api.skill_level ?? "",
    route: api.route ?? "",
    speed: api.speed ?? "",
    date: api.ride_date ? formatRideDate(api.ride_date) : "",
    requirements: api.requirements ?? [],
    timeAgo: relativeTime(api.created_at),
  };
}
