import type { Notification } from "@/types";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "reminder",
    title: "Ride starts in 12 hours",
    message: "Nandi Sunrise Sprint starts tomorrow at 6:00 AM",
    time: "2 hours ago",
    isRead: false,
    action: "View Ride",
  },
  {
    id: 2,
    type: "update",
    title: "Location changed",
    message: "Organizer changed start point to Cubbon Park Metro Station",
    time: "4 hours ago",
    isRead: false,
    action: "View Details",
  },
  {
    id: 3,
    type: "delay",
    title: "Ride delayed",
    message: "Coorg Coffee Trail delayed by 15 minutes due to weather",
    time: "1 day ago",
    isRead: true,
    action: "Acknowledged",
  },
  {
    id: 4,
    type: "new_ride",
    title: "New ride near you",
    message: "Beginner's Delight - Perfect for weekend riders",
    time: "2 days ago",
    isRead: true,
    action: "Join Now",
  },
  {
    id: 5,
    type: "rider_joined",
    title: "New rider joined",
    message: "3 more riders joined your Mysore Palace Run",
    time: "3 days ago",
    isRead: true,
    action: "View Riders",
  },
];
