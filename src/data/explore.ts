import { Crown } from "lucide-react";
import type { NearbyRider, CrewIntent, Mentor } from "@/types";

export const NEARBY_RIDERS: NearbyRider[] = [
  {
    id: 1,
    name: "Arjun Patel",
    avatar: "/api/placeholder/40/40",
    bike: "Royal Enfield Classic 350",
    points: 1250,
    streak: 15,
    distance: "2.5 km",
    status: "active",
    rideStyle: ["Adventure", "Scenic", "Weekend"],
    lastSeen: "Active now",
    isOnline: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    avatar: "/api/placeholder/40/40",
    bike: "KTM Duke 390",
    points: 980,
    streak: 8,
    distance: "4.1 km",
    status: "looking",
    rideStyle: ["Short Rides", "City", "Breakfast"],
    lastSeen: "2 hours ago",
    isOnline: false,
  },
  {
    id: 3,
    name: "Vikram Singh",
    avatar: "/api/placeholder/40/40",
    bike: "Bajaj Dominar 400",
    points: 2100,
    streak: 23,
    distance: "1.8 km",
    status: "upcoming",
    rideStyle: ["Long Distance", "Highway", "Night"],
    lastSeen: "Planning Sunday ride",
    isOnline: true,
  },
];

export const CREW_INTENTS: CrewIntent[] = [
  {
    id: 1,
    creator: {
      name: "Rohit Kumar",
      avatar: "/api/placeholder/40/40",
      rating: 4.8,
    },
    title: "Sunday Breakfast Ride to Nandi Hills",
    description:
      "Looking for 4 riders for a Sunday breakfast ride. Avg speed 60\u201380km/h. From JP Nagar to Nandi Hills. No drama, full helmets.",
    lookingFor: 4,
    currentMembers: 2,
    rideType: "Breakfast",
    timePreference: "Early Morning",
    skillLevel: "Intermediate",
    route: "JP Nagar to Nandi Hills",
    speed: "60-80 km/h",
    date: "2024-01-14",
    requirements: ["Full Helmet", "No Drama", "Experience"],
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    creator: {
      name: "Sneha Reddy",
      avatar: "/api/placeholder/40/40",
      rating: 4.9,
    },
    title: "Women-Only Evening Ride",
    description:
      "Safe evening ride for women riders. Exploring city routes with coffee stops. All skill levels welcome!",
    lookingFor: 6,
    currentMembers: 4,
    rideType: "City",
    timePreference: "Evening",
    skillLevel: "Mixed Levels",
    route: "Indiranagar to UB City",
    speed: "40-60 km/h",
    date: "2024-01-13",
    requirements: ["Women Only", "Safety First"],
    timeAgo: "5 hours ago",
  },
];

export const MENTORS: Mentor[] = [
  {
    id: 1,
    name: "Captain Rajesh",
    avatar: "/api/placeholder/60/60",
    title: "Safety Champion & Route Master",
    achievements: [
      { type: "consistent", label: "Consistent Rides", value: "127", icon: Crown },
      { type: "safety", label: "Safety Streak", value: "365 days", icon: Crown },
      { type: "pillion", label: "Pillion Friendly", value: "89%", icon: Crown },
      { type: "routes", label: "Routes Created", value: "43", icon: Crown },
    ],
    stats: {
      ridesOrganized: 127,
      safetyStreak: 365,
      followersCount: 1200,
      rating: 4.9,
    },
    specialties: ["Highway", "Long Distance", "Safety Training"],
    quote: "Riding is not just about speed, it's about the journey and the brotherhood.",
    isFollowing: false,
  },
];
