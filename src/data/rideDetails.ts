export const mockRideDetails = {
  title: "Nandi Sunrise Sprint",
  date: "Sunday, January 7th",
  time: "6:00 AM - 6:00 PM",
  startTime: "6:00 AM",
  endTime: "6:00 PM",
  distance: "80 km round trip",
  organizer: "Rajesh Kumar",
  organizerRating: 4.8,
  organizerRides: 45,
  organizerPhone: "+91 98765 43210",
  startLocation: "Cubbon Park, Bangalore",
  destination: "Nandi Hills",
  type: "Breakfast",
  difficulty: "Moderate",
  joinedCount: 12,
  maxRiders: 15,
  pillionAvailable: true,
  pillionCount: 3,
  maxPillion: 5,

  costs: {
    fuel: "\u20B9200-300",
    breakfast: 250,
    tollCharges: 50,
    parking: 30,
    total: "\u20B9530-630",
  },

  route: {
    highlights: [
      "Bangalore City",
      "Electronic City",
      "Hoskote",
      "Chikkaballapur",
      "Nandi Hills",
    ],
    roadConditions: "Good tarmac roads, some winding sections near hills",
    fuelStops: ["HP Petrol Pump, Electronic City", "Indian Oil, Hoskote"],
    restrooms: ["Available at fuel stops and Nandi Hills base"],
    emergencyContact: "+91 98765 43210",
  },

  bikeRequirements: {
    minimumCC: "100cc and above",
    recommended: [
      "Royal Enfield",
      "Bajaj Pulsar",
      "Honda CB",
      "Any Sports Bike",
    ],
    documents: [
      "Valid Driving License",
      "RC Book",
      "Insurance Papers",
      "PUC Certificate",
    ],
    modifications: "Stock bikes preferred, loud exhausts discouraged",
  },

  includes: [
    "Experienced ride leader",
    "Group riding coordination",
    "Basic first aid support",
    "Photo/video coverage",
    "Digital ride certificate",
  ],
  excludes: [
    "Fuel costs",
    "Meal costs",
    "Accommodation",
    "Personal insurance",
    "Bike breakdown support",
  ],

  safetyGear: {
    mandatory: ["DOT/ISI Helmet", "Riding Gloves", "Proper Footwear"],
    recommended: ["Riding Jacket", "Knee Pads", "Reflective Vest"],
    prohibited: ["Flip-flops", "Shorts", "Tank tops"],
  },

  weather: {
    condition: "Partly Cloudy",
    temperature: "18\u00B0C - 28\u00B0C",
    humidity: "65%",
    windSpeed: "15 km/h",
    rainChance: "10%",
  },

  previousTrips: {
    totalCompletedTrips: 24,
    lastTripDate: "Dec 31, 2024",
    averageRating: 4.7,
    totalRiders: 312,
    totalPhotos: 1247,
    trips: [
      {
        id: 1,
        date: "Dec 31, 2024",
        participants: 14,
        rating: 4.8,
        weather: "Perfect",
        photos: 89,
        highlights: ["Amazing sunrise", "Perfect weather", "Great group"],
        expenses: {
          actualFuel: "\u20B9280",
          breakfast: "\u20B9230",
          tolls: "\u20B950",
          total: "\u20B9560",
        },
        testimonial:
          "One of the best rides ever! The sunrise view was absolutely breathtaking and the group was fantastic.",
        reviewer: "Priya M.",
        reviewerRating: 5,
        featuredPhoto:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      },
      {
        id: 2,
        date: "Dec 17, 2024",
        participants: 12,
        rating: 4.6,
        weather: "Cloudy",
        photos: 67,
        highlights: ["Good roads", "Nice group dynamics", "Safe ride"],
        expenses: {
          actualFuel: "\u20B9290",
          breakfast: "\u20B9250",
          tolls: "\u20B950",
          total: "\u20B9590",
        },
        testimonial:
          "Well organized ride with experienced riders. Safety was prioritized throughout.",
        reviewer: "Amit K.",
        reviewerRating: 5,
        featuredPhoto:
          "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop",
      },
      {
        id: 3,
        date: "Dec 3, 2024",
        participants: 15,
        rating: 4.9,
        weather: "Clear",
        photos: 112,
        highlights: ["Perfect weather", "Stunning views", "Great breakfast"],
        expenses: {
          actualFuel: "\u20B9275",
          breakfast: "\u20B9240",
          tolls: "\u20B950",
          total: "\u20B9565",
        },
        testimonial:
          "Amazing experience! The views were spectacular and everyone was so friendly.",
        reviewer: "Sneha R.",
        reviewerRating: 5,
        featuredPhoto:
          "https://images.unsplash.com/photo-1544277149-6e4bf999d75f?w=400&h=300&fit=crop",
      },
      {
        id: 4,
        date: "Nov 19, 2024",
        participants: 13,
        rating: 4.5,
        weather: "Misty",
        photos: 78,
        highlights: ["Mystic fog", "Adventure feel", "Good coordination"],
        expenses: {
          actualFuel: "\u20B9285",
          breakfast: "\u20B9260",
          tolls: "\u20B950",
          total: "\u20B9595",
        },
        testimonial:
          "The misty weather added a magical touch to the ride. Well managed by the organizer.",
        reviewer: "Karthik P.",
        reviewerRating: 4,
        featuredPhoto:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      },
      {
        id: 5,
        date: "Nov 5, 2024",
        participants: 11,
        rating: 4.7,
        weather: "Sunny",
        photos: 94,
        highlights: ["Perfect temperature", "Great company", "Smooth ride"],
        expenses: {
          actualFuel: "\u20B9270",
          breakfast: "\u20B9245",
          tolls: "\u20B950",
          total: "\u20B9565",
        },
        testimonial:
          "Perfect ride for beginners and experienced riders alike. Highly recommended!",
        reviewer: "Divya S.",
        reviewerRating: 5,
        featuredPhoto:
          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      },
    ],
  },

  schedule: [
    { time: "6:00 AM", activity: "Assembly & Brief", location: "Cubbon Park" },
    { time: "6:30 AM", activity: "Ride Start", location: "Cubbon Park" },
    { time: "8:30 AM", activity: "Fuel & Refresh", location: "Hoskote" },
    {
      time: "10:00 AM",
      activity: "Reach Nandi Hills",
      location: "Nandi Hills",
    },
    {
      time: "10:30 AM",
      activity: "Breakfast & Explore",
      location: "Hill Station",
    },
    {
      time: "12:00 PM",
      activity: "Return Journey",
      location: "Nandi Hills",
    },
    {
      time: "2:00 PM",
      activity: "Lunch Break",
      location: "Chikkaballapur",
    },
    {
      time: "6:00 PM",
      activity: "Reach Bangalore",
      location: "Cubbon Park",
    },
  ],

  cancellation: {
    policy: "Free cancellation up to 24 hours before ride",
    refund: "Full refund for cancellations 24+ hours prior",
    weather: "Ride cancelled if heavy rain/dangerous conditions",
    minimum: "Ride cancelled if less than 8 participants",
  },

  rules: [
    "Valid driving license and documents mandatory",
    "ISI/DOT approved helmet compulsory - no exceptions",
    "Stay with group leader at all times - no solo riding",
    "Fuel tank must be full before ride start",
    "Keep phone charged for emergency communication",
    "No stunts, wheelies, or reckless overtaking",
    "Zero tolerance for alcohol or substance abuse",
    "Proper riding gear required - no shorts/sandals",
    "Punctuality mandatory - ride starts sharp on time",
    "No pillion riders without prior organizer approval",
    "Follow traffic rules and speed limits strictly",
    "Mandatory safety briefing attendance before start",
  ],

  reviews: [
    {
      user: "Amit P",
      rating: 5,
      comment: "Amazing ride! Well organized and great views.",
    },
    {
      user: "Priya S",
      rating: 4,
      comment: "Good experience, loved the sunrise at Nandi Hills.",
    },
  ],
};

export type RideDetails = typeof mockRideDetails;
export type PreviousTrip = RideDetails["previousTrips"]["trips"][number];
