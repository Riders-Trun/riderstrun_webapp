export const getMockRideData = (id: string): RideDiscoveryData => ({
  id: id || "1",
  title: "Nandi Sunrise Sprint",
  route: "Cubbon Park → Nandi Hills",
  distance: "80 km round trip",
  difficulty: "Moderate",
  estimatedTime: "4-5 hours",
  bestTime: "Early Morning (5:30 AM)",
  completedRides: 127,
  rating: 4.8,
  tags: ["Sunrise", "Hills", "Breakfast", "Scenic"],

  pastGroups: [
    {
      id: 1,
      date: "Dec 15, 2024",
      organizer: "Rajesh Kumar",
      participants: 12,
      rating: 5,
      highlights: ["Amazing sunrise", "Great breakfast spot", "Perfect weather"],
    },
    {
      id: 2,
      date: "Nov 28, 2024",
      organizer: "Priya Singh",
      participants: 8,
      rating: 4.5,
      highlights: ["Good group energy", "Beautiful photos", "Smooth ride"],
    },
  ],

  routeStops: [
    {
      name: "Cubbon Park - Start Point",
      type: "start",
      time: "5:30 AM",
      description: "Meeting point for all riders",
    },
    {
      name: "Nandi Hills Base",
      type: "checkpoint",
      time: "6:45 AM",
      description: "Quick stop before the climb",
    },
    {
      name: "Sunrise Point",
      type: "destination",
      time: "7:15 AM",
      description: "Main viewpoint for sunrise",
    },
    {
      name: "Hilltop Cafe",
      type: "food",
      time: "8:00 AM",
      description: "Breakfast and refreshments",
    },
  ],

  riderTalks: [
    {
      id: 1,
      rider: "Vikram Raj",
      avatar: "VR",
      time: "2 days ago",
      message:
        "Just completed this route! The sunrise was absolutely breathtaking. Perfect weather and great company. Highly recommend starting early to catch the golden hour. 🌅",
      likes: 24,
      isLiked: false,
      photos: 3,
      comments: [
        { user: "Sneha", message: "Amazing shots! 📸" },
        { user: "Rajesh", message: "Next time count me in!" },
      ],
    },
    {
      id: 2,
      rider: "Sneha Reddy",
      avatar: "SR",
      time: "1 week ago",
      message:
        "Third time doing this route and it never gets old! The cafe at the top has amazing filter coffee. Road conditions are good, just be careful on the winding sections. ☕🏍️",
      likes: 18,
      isLiked: true,
      photos: 1,
      comments: [
        { user: "Kiran", message: "That coffee is legendary!" },
        { user: "Amit", message: "Thanks for the tip about the roads" },
      ],
    },
    {
      id: 3,
      rider: "Kiran Kumar",
      avatar: "KK",
      time: "2 weeks ago",
      message:
        "Perfect route for beginners! Not too challenging but scenic enough to be exciting. The group was very supportive and we had so much fun. 🎯",
      likes: 15,
      isLiked: false,
      photos: 2,
      comments: [{ user: "Priya", message: "Great for newbies indeed!" }],
    },
    {
      id: 4,
      rider: "Arjun Patel",
      avatar: "AP",
      time: "3 weeks ago",
      message:
        "Monsoon ride was epic! Rain made it challenging but the mist-covered hills were magical. Proper rain gear is essential though. 🌧️⛰️",
      likes: 31,
      isLiked: true,
      photos: 5,
      comments: [
        { user: "Maya", message: "Brave souls! Looks incredible" },
        { user: "Dev", message: "Rain riding is next level" },
      ],
    },
  ],

  photos: [
    {
      id: 1,
      rider: "Rajesh Kumar",
      avatar: "RK",
      caption:
        "Sunrise view from Nandi Hills - Worth the early wake up! 🌄✨ #NandiHills #Sunrise #MotorcycleDiaries",
      likes: 32,
      isLiked: true,
      time: "Dec 15, 2024",
      comments: 8,
      location: "Nandi Hills, Bangalore",
    },
    {
      id: 2,
      rider: "Priya Singh",
      avatar: "PS",
      caption:
        "Group photo at the summit 📸 Amazing company makes every ride memorable! 🏍️👥 #RidersTurn #GroupRide",
      likes: 28,
      isLiked: false,
      time: "Nov 28, 2024",
      comments: 5,
      location: "Nandi Hills Summit",
    },
    {
      id: 3,
      rider: "Amit Patel",
      avatar: "AP",
      caption:
        "The winding roads up to Nandi Hills 🛣️ Perfect for a Sunday morning cruise #WindingRoads #MorningRide",
      likes: 21,
      isLiked: true,
      time: "Nov 10, 2024",
      comments: 3,
      location: "Nandi Hills Road",
    },
    {
      id: 4,
      rider: "Vikram Raj",
      avatar: "VR",
      caption:
        "Coffee break at hilltop cafe ☕ Nothing beats hot coffee after a long ride! #CoffeeBreak #HilltopCafe",
      likes: 19,
      isLiked: false,
      time: "Dec 8, 2024",
      comments: 12,
      location: "Hilltop Cafe, Nandi Hills",
    },
    {
      id: 5,
      rider: "Maya Sharma",
      avatar: "MS",
      caption:
        "Golden hour magic 🌅 These moments make every early morning worth it #GoldenHour #Photography",
      likes: 45,
      isLiked: true,
      time: "Dec 20, 2024",
      comments: 15,
      location: "Nandi Hills Viewpoint",
    },
    {
      id: 6,
      rider: "Dev Kumar",
      avatar: "DK",
      caption:
        "Fog rolling in over the hills 🌫️ Nature's own special effects! #FoggyMorning #NaturePhotography",
      likes: 38,
      isLiked: false,
      time: "Dec 5, 2024",
      comments: 9,
      location: "Nandi Hills",
    },
  ],

  tips: [
    "Start early (5:30 AM) to catch the sunrise",
    "Carry warm clothes - it gets chilly at the top",
    "Tank up fuel before starting the climb",
    "The cafe serves excellent South Indian breakfast",
  ],
});

/**
 * Declared rather than inferred from the demo data.
 *
 * Inferring it made the demo shape the contract, so the real API — which has no
 * ratings and no like counts — could not satisfy it. Now both fit the same type
 * and the optional fields are the honest difference between them.
 */
export interface RideDiscoveryData {
  id: string;
  title: string;
  route: string;
  distance: string;
  difficulty: string;
  estimatedTime: string;
  bestTime: string;
  completedRides: number;
  /** Demo only — nothing rates a route. */
  rating?: number;
  tags: string[];
  pastGroups: PastGroup[];
  routeStops: RouteStop[];
  riderTalks: RiderTalk[];
  photos: RidePhoto[];
  /** Demo only — nothing collects riding tips. */
  tips?: string[];
}
/**
 * The discovery tab shapes, declared rather than derived from the demo data.
 *
 * Several fields are optional, and all for the same reason: nothing in this
 * system collects them. Comments have no likes, photos have no like count, and
 * rides are not rated. Rather than send zeros — which read as "nobody liked
 * this" instead of "this is not a thing here" — they are absent, and the tabs
 * omit the controls that would go with them.
 */
export interface RouteStop {
  name: string;
  type: string;
  time?: string;
  description?: string;
}

export interface RiderTalkComment {
  user: string;
  message: string;
}

export interface RiderTalk {
  id: string | number;
  rider: string;
  avatar: string;
  time: string;
  message: string;
  likes?: number;
  isLiked?: boolean;
  photos?: number;
  comments?: RiderTalkComment[];
}

export interface RidePhoto {
  id: string | number;
  rider: string;
  avatar: string;
  caption: string;
  time: string;
  location?: string;
  likes?: number;
  isLiked?: boolean;
  comments?: number;
  url?: string;
}

export interface PastGroup {
  id: string | number;
  date: string;
  organizer: string;
  participants: number;
  rating?: number;
  highlights?: string[];
}
