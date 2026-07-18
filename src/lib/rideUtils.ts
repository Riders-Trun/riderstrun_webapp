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
