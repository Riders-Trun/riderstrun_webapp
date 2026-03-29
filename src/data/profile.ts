import type {
  UserProfile,
  RideStats,
  Streak,
  Achievement,
  RecentRide,
  Challenge,
} from "@/types";

export const DEFAULT_PROFILE: UserProfile = {
  name: "Alex Kumar",
  phone: "+91 98765 43210",
  email: "alex.kumar@email.com",
  bike: "Royal Enfield Classic 350",
  ridingLevel: "Intermediate",
  location: "Bangalore, Karnataka",
  emergencyContact: {
    name: "Priya Kumar",
    phone: "+91 98765 43211",
    relation: "Spouse",
  },
};

export const DEFAULT_RIDE_STATS: RideStats = {
  totalRides: 24,
  ridesOrganized: 6,
  totalDistance: "1,840 km",
  noShows: 1,
  currentStreak: 7,
  longestStreak: 15,
  totalPoints: 1250,
  organizerRank: "Road Captain",
};

export const STREAKS: Streak[] = [
  { name: "Daily Organizer", current: 7, target: 10, reward: "200 pts", type: "organizing" },
  { name: "Weekend Warrior", current: 3, target: 5, reward: "100 pts", type: "weekend" },
  { name: "Distance Rider", current: 8, target: 10, reward: "300 pts", type: "distance" },
];

export const ACHIEVEMENTS: Achievement[] = [
  { name: "First Ride", description: "Completed your first group ride", earned: true, points: 50, rarity: "common" },
  { name: "Organizer", description: "Organized your first ride", earned: true, points: 100, rarity: "common" },
  { name: "Explorer", description: "Completed 10 rides", earned: true, points: 150, rarity: "common" },
  { name: "Road Captain", description: "Organized 5 rides", earned: true, points: 200, rarity: "rare" },
  { name: "Distance Master", description: "Covered 1000+ km", earned: true, points: 250, rarity: "rare" },
  { name: "Streak Legend", description: "10-day organizing streak", earned: false, points: 400, rarity: "epic" },
  { name: "Community Leader", description: "Organize 25 rides", earned: false, points: 500, rarity: "legendary" },
  { name: "Route Master", description: "Complete all popular routes", earned: false, points: 300, rarity: "epic" },
];

export const RECENT_RIDES: RecentRide[] = [
  { name: "Mysore Palace Run", date: "Dec 24, 2023", distance: "150 km", points: 25, role: "Organizer" },
  { name: "Morning Beach Drive", date: "Dec 17, 2023", distance: "60 km", points: 15, role: "Participant" },
  { name: "Hill Station Express", date: "Dec 10, 2023", distance: "120 km", points: 30, role: "Organizer" },
];

export const CHALLENGES: Challenge[] = [
  { name: "New Year Resolution", description: "Organize 5 rides in January", progress: 3, target: 5, reward: "500 pts", expires: "Jan 31" },
  { name: "Community Builder", description: "Get 50 riders to join your rides", progress: 32, target: 50, reward: "300 pts", expires: "Feb 28" },
];
