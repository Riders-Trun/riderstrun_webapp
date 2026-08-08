export const formatRideDate = (dateString: string) => {
  const now = new Date();
  const today = now.toDateString();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
  
  if (dateString.includes('Today')) {
    return { label: 'Today', time: dateString.split(', ')[1], isToday: true };
  }
  if (dateString.includes('Tomorrow')) {
    return { label: 'Tomorrow', time: dateString.split(', ')[1], isTomorrow: true };
  }
  
  // For other dates, just return as is
  const parts = dateString.split(', ');
  return { label: parts[0], time: parts[1] || '', isRegular: true };
};

export const getTimeUntilRide = (dateString: string) => {
  if (dateString.includes('Today')) {
    return "Starting Soon";
  }
  if (dateString.includes('Tomorrow')) {
    return "Tomorrow";
  }
  return "Upcoming";
};

export const getRideTypeEmoji = (type: string) => {
  const emojis = {
    "Breakfast": "🌅",
    "Adventure": "🏔️",
    "Scenic": "🌄",
    "Long Distance": "🛣️",
    "Night Ride": "🌙"
  };
  return emojis[type as keyof typeof emojis] || "🏍️";
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy": return "bg-green-100 text-green-800";
    case "Moderate": case "Medium": return "bg-yellow-100 text-yellow-800";
    case "Hard": case "Challenging": return "bg-red-100 text-red-800";
    case "Expert": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const getDifficultyFromDistance = (distance: string) => {
  const km = parseInt(distance.replace(/\D/g, ''));
  if (km < 50) return "Easy";
  if (km < 100) return "Moderate";
  return "Hard";
};

export const getDifficultyColorFromDistance = (distance: string) => {
  return getDifficultyColor(getDifficultyFromDistance(distance));
};

/**
 * A small, stable non-negative number derived from a ride id.
 *
 * Ride ids are numeric in mock data but UUID strings from the API, so anything
 * doing arithmetic on the id directly (placeholder ratings, photo counts) yields
 * NaN once real data arrives. Hashing first keeps those values deterministic for
 * a given ride regardless of which id format it has.
 */
export const stableSeed = (id: string | number): number => {
  if (typeof id === "number") return Math.abs(Math.trunc(id));
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

/**
 * Kilometres out of a display distance like "80 km round trip" or "280 km".
 *
 * Returns null when there is no number to find, so callers can decide what an
 * unknown distance means rather than silently treating it as zero.
 */
export const parseDistanceKm = (distance: string | undefined): number | null => {
  if (!distance) return null;
  const match = distance.match(/\d+(\.\d+)?/);
  if (!match) return null;
  const km = parseFloat(match[0]);
  return Number.isFinite(km) ? km : null;
};

/**
 * When a ride starts, as epoch milliseconds, for the "earliest" sort.
 *
 * `date` is a display label — "Today, 6:00 AM", "Tomorrow, 5:30 AM" — and
 * `new Date()` cannot parse either, so sorting on it produced NaN and left the
 * list in its original order. Prefer the API's ISO `startDate`; fall back to
 * resolving the relative labels against the current day. Anything still
 * unreadable sorts last instead of poisoning the comparator.
 */
export const rideStartTime = (ride: { startDate?: string; date?: string }): number => {
  if (ride.startDate) {
    const t = new Date(ride.startDate).getTime();
    if (Number.isFinite(t)) return t;
  }

  const label = ride.date;
  if (!label) return Number.POSITIVE_INFINITY;

  const [dayPart, timePart] = label.split(", ");
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  if (/today/i.test(dayPart)) {
    // base is already today
  } else if (/tomorrow/i.test(dayPart)) {
    base.setDate(base.getDate() + 1);
  } else {
    const parsed = new Date(label);
    const t = parsed.getTime();
    return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
  }

  return base.getTime() + parseClockOffset(timePart);
};

/** Milliseconds past midnight for a "6:00 AM" style time; 0 when absent. */
function parseClockOffset(time: string | undefined): number {
  if (!time) return 0;
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return (hours * 60 + minutes) * 60 * 1000;
}
