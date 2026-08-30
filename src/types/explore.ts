export interface RideRoute {
  id: number;
  name: string;
  description: string;
  image: string;
  distance: string;
  duration: string;
  difficulty: "Easy" | "Moderate" | "Challenging" | "Expert";
  terrain: string[];
  startPoint: string;
  endPoint: string;
  rating: number;
  reviewCount: number;
  completions: number;
  highlights: string[];
  hasGPXFile?: boolean;
}

export interface TrendingRide {
  id: number;
  title: string;
  location: string;
  participants: number;
  image: string;
  difficulty: string;
  distance: string;
  rating: number;
}

export interface GearReview {
  id: number;
  productName: string;
  productImage: string;
  category: "helmet" | "jacket" | "gloves" | "boots" | "accessories" | "electronics";
  rating: number;
  price: string;
  reviewTitle: string;
  reviewContent: string;
  pros: string[];
  cons: string[];
  reviewer: {
    name: string;
    avatar: string;
    ridesCompleted: number;
  };
  timeAgo: string;
  likes: number;
  comments: number;
  productLink?: string;
  isLiked?: boolean;
}

export interface RidingTip {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: "safety" | "maintenance" | "technique" | "gear" | "weather";
  likes: number;
  saves: number;
  timeAgo: string;
  image?: string;
  videoUrl?: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface RideEvent {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  organizer: {
    name: string;
    avatar: string;
  };
  attendees: number;
  maxAttendees?: number;
  type: "Workshop" | "Meetup" | "Training" | "Ride";
  price?: number;
}

export interface CommunityChallenge {
  id: number;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  participants: number;
  totalTarget: number;
  currentProgress: number;
  reward: string;
  difficulty: "Easy" | "Medium" | "Hard";
  location?: string;
}

export interface CommunityPost {
  id: number;
  user: {
    name: string;
    avatar: string;
    badge?: string;
    isVerified?: boolean;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares?: number;
  timeAgo: string;
  location?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  rideDetails?: {
    distance: string;
    duration: string;
    participants: number;
    difficulty: "Easy" | "Medium" | "Hard";
  };
  tags?: string[];
}

export interface RiderMatch {
  id: number;
  name: string;
  avatar: string;
  location: string;
  distance: string;
  bike: string;
  bikeImage?: string;
  matchPercentage: number;
  matchReasons: {
    reason: string;
    score: number;
  }[];
  ridePreferences: string[];
  ridesCompleted: number;
  joinedDate: string;
  isOnline?: boolean;
  mutualConnections?: number;
}

export interface RiderSpotlight {
  id: number;
  name: string;
  avatar: string;
  badge: string;
  contributions: number;
  followers: number;
  bio: string;
}

export interface RideMoment {
  /** A UUID from the API — media ids are not numbers. */
  id: string;
  /** The completed ride the photo was posted on. */
  rideId?: string;
  rider: {
    name: string;
    avatar: string;
  };
  image: string;
  location: string;
  rideTitle: string;
  date: string;
  participantsCount: number;
  taggedRiders: string[];
  hasUpcomingRide: boolean;
  /** Where "Join Next Ride" goes. */
  upcomingRideId?: string;
  upcomingRideDate?: string;
}

export interface CommunityInitiative {
  id: number;
  title: string;
  description: string;
  image: string;
  type: "blood-donation" | "safety-workshop" | "women-only" | "meetup" | "charity";
  organizer: {
    name: string;
    avatar: string;
    organization?: string;
  };
  date: string;
  location: string;
  participantsCount: number;
  maxParticipants?: number;
  registrationDeadline?: string;
  isRegistered?: boolean;
  requirements?: string[];
  impact?: string;
}
