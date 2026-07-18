import type { FilterOptions } from "@/types";

export const RIDE_TYPES = [
  "All",
  "Breakfast",
  "Adventure",
  "Scenic",
  "Long Distance",
  "Night Ride",
] as const;

export const POPULAR_LOCATIONS = [
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Goa",
  "Mysore",
  "Coorg",
] as const;

export const SUGGESTED_TRIP_CODES = [
  "NH001",
  "CT002",
  "CH003",
  "WM004",
  "MC005",
] as const;

export const DEFAULT_FILTERS: FilterOptions = {
  range: [0, 100],
  sortBy: "nearest",
  bikeCC: "any",
  groupSize: [1, 20],
  duration: "any",
  rideType: [],
};

export const TYPE_GRADIENTS: Record<string, string> = {
  Breakfast: "from-orange-500 to-red-500",
  Adventure: "from-green-500 to-emerald-600",
  Scenic: "from-blue-500 to-cyan-600",
  "Long Distance": "from-purple-500 to-pink-600",
  "Night Ride": "from-indigo-500 to-purple-600",
};

export const DIFFICULTY_THRESHOLDS = {
  easy: 50,
  moderate: 100,
} as const;
