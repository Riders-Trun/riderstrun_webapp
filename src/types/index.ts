// ===== Ride Types =====

export interface Ride {
  // Mock data uses numeric ids; the API issues UUIDs.
  id: string | number;
  title: string;
  date: string;
  distance: string;
  organizer: string;
  location: string;
  type: string;
  joinedCount: number;
  maxRiders: number;
  isOrganizer: boolean;
  // Needs the rider's geolocation — the API does not provide it.
  distanceFromUser?: string;
  /** ISO timestamp from the API, used for "newest" sorting. Absent in mock data. */
  createdAt?: string;
  pillionAvailable?: boolean;
  pillionSlots?: number;
  tripCode?: string;
  brand?: string;
  rating?: number;
  totalRatings?: number;
  estimatedCost?: string;
  highlights?: string[];
  minimumCC?: string;
}

export interface RideDetail extends Ride {
  time: string;
  startTime: string;
  endTime: string;
  organizerRating: number;
  organizerRides: number;
  organizerPhone: string;
  startLocation: string;
  destination: string;
  difficulty: string;
  pillionCount?: number;
  maxPillion?: number;
  costs: RideCosts;
  route: RouteInfo;
  bikeRequirements: BikeRequirements;
  includes: string[];
  excludes: string[];
  safetyGear: SafetyGear;
  weather: Weather;
  previousTrips: PreviousTripsInfo;
}

export interface RideCosts {
  fuel: string;
  breakfast: number;
  tollCharges: number;
  parking: number;
  total: string;
}

export interface RouteInfo {
  highlights: string[];
  roadConditions: string;
  fuelStops: string[];
  restrooms: string[];
  emergencyContact: string;
}

export interface BikeRequirements {
  minimumCC: string;
  recommended: string[];
  documents: string[];
  modifications: string;
}

export interface SafetyGear {
  mandatory: string[];
  recommended: string[];
  prohibited: string[];
}

export interface Weather {
  condition: string;
  temperature: string;
  humidity: string;
  windSpeed: string;
  rainChance: string;
}

export interface PreviousTrip {
  id: number;
  date: string;
  participants: number;
  rating: number;
  weather: string;
  photos: number;
  highlights: string[];
  expenses: {
    actualFuel: string;
    breakfast: string;
    tolls: string;
    total: string;
  };
  testimonial: string;
  reviewer: string;
  reviewerRating: number;
  featuredPhoto: string;
}

export interface PreviousTripsInfo {
  totalCompletedTrips: number;
  lastTripDate: string;
  averageRating: number;
  totalRiders: number;
  totalPhotos: number;
  trips: PreviousTrip[];
}

// ===== User Types =====

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  bike: string;
  ridingLevel: string;
  location: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface RideStats {
  totalRides: number;
  ridesOrganized: number;
  totalDistance: string;
  noShows: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  organizerRank: string;
}

export interface Streak {
  name: string;
  current: number;
  target: number;
  reward: string;
  type: string;
}

export interface Achievement {
  name: string;
  description: string;
  earned: boolean;
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Challenge {
  name: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  expires: string;
}

export interface RecentRide {
  name: string;
  date: string;
  distance: string;
  points: number;
  role: string;
}

// ===== Notification Types =====

export type NotificationType = "reminder" | "update" | "delay" | "new_ride" | "rider_joined";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  action: string;
}

// ===== My Rides Types =====

export interface MyRide {
  // Mock data uses numeric ids; the API issues UUIDs.
  id: string | number;
  title: string;
  date: string;
  distance: string;
  organizer: string;
  type: string;
  joinedCount: number;
  maxRiders?: number;
  status: string;
  isCurrentUserOrganizer: boolean;
}

// ===== Explore Types =====

export interface NearbyRider {
  id: number;
  name: string;
  avatar: string;
  bike: string;
  points: number;
  streak: number;
  distance: string;
  status: "active" | "looking" | "upcoming";
  rideStyle: string[];
  lastSeen: string;
  isOnline: boolean;
}

export interface CrewIntent {
  id: number;
  creator: {
    name: string;
    avatar: string;
    rating: number;
  };
  title: string;
  description: string;
  lookingFor: number;
  currentMembers: number;
  rideType: string;
  timePreference: string;
  skillLevel: string;
  route: string;
  speed: string;
  date: string;
  requirements: string[];
  timeAgo: string;
}

export interface Mentor {
  id: number;
  name: string;
  avatar: string;
  title: string;
  achievements: MentorAchievement[];
  stats: {
    ridesOrganized: number;
    safetyStreak: number;
    followersCount: number;
    rating: number;
  };
  specialties: string[];
  quote: string;
  isFollowing: boolean;
}

export interface MentorAchievement {
  type: "consistent" | "safety" | "pillion" | "routes";
  label: string;
  value: string;
  icon: React.ComponentType;
}

// ===== Ride Planning Types =====

export interface RideFormData {
  title: string;
  type: string;
  date: string;
  time: string;
  startPoint: string;
  destination: string;
  maxRiders: string;
  description: string;
  role: string;
  selectedRoute: string;
}

export interface PresetData {
  title: string;
  type: string;
  time: string;
  maxRiders: string;
  description: string;
  pitStops: string[];
  rules: string[];
}

export interface PopularRoute {
  id: string;
  name: string;
  distance: string;
  difficulty: string;
  rating: number;
  timesRidden: number;
  route: {
    startPoint: string;
    destination: string;
    time: string;
  };
  streak: { current: number; target: number; reward: string };
}

export interface StoryContent {
  type: "image" | "text";
  content: string;
  caption?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface NewCrewIntent {
  title: string;
  description: string;
  lookingFor: number;
  rideType: string;
  timePreference: string;
  skillLevel: string;
  route: string;
  speed: string;
  date: string;
  requirements: string[];
}

export interface ChatMessageMetadata {
  imageUrl?: string;
  location?: { lat: number; lng: number; name: string };
  rideId?: number;
  rideTitle?: string;
}

// ===== Filter Types =====

export interface FilterOptions {
  range: number[];
  sortBy: string;
  bikeCC: string;
  groupSize: number[];
  duration: string;
  rideType: string[];
}
