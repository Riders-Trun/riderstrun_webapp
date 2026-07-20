import { useState } from "react";
import { 
  X, 
  MessageCircle, 
  Phone, 
  Video, 
  Crown, 
  MapPin, 
  Star, 
  Zap, 
  Users, 
  Calendar,
  Route,
  Camera,
  Send,
  Smile
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockOr } from "@/lib/mock";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface RiderProfileModalProps {
  riderId: number;
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (riderId: number) => void;
  onInviteToRide?: (riderId: number) => void;
  onStartChat?: (riderId: number) => void;
}

const RiderProfileModal = ({
  riderId,
  isOpen,
  onClose,
  onConnect,
  onInviteToRide,
  onStartChat
}: RiderProfileModalProps) => {
  const [activeTab, setActiveTab] = useState("about");
  const [isConnected, setIsConnected] = useState(false);

  // Demo-only: there is no endpoint that returns a rider profile by id yet, so
  // outside mock mode this shows an empty shell rather than "Arjun Patel" and
  // 89 rides belonging to whoever was actually tapped.
  const DEMO_RIDER = {
    id: riderId,
    name: "Arjun Patel",
    avatar: "/api/placeholder/100/100",
    coverImage: "/api/placeholder/400/200",
    bio: "Weekend warrior exploring hidden gems around Bangalore. Love scenic routes and great coffee stops! Always up for a new adventure.",
    bike: "Royal Enfield Classic 350",
    location: "Koramangala, Bangalore",
    points: 1250,
    streak: 15,
    joinedDate: "March 2023",
    isOnline: true,
    badges: ["Route Master", "Coffee Explorer", "Safety First"],
    stats: {
      ridesCompleted: 89,
      distanceCovered: "12,450 km",
      averageRating: 4.8,
      followers: 156,
      following: 98
    },
    rideStyle: ["Adventure", "Scenic", "Weekend", "Photography", "Coffee Stops"],
    preferences: {
      timePreference: ["Early Morning", "Weekend"],
      difficulty: ["Easy", "Medium"],
      groupSize: "3-6 riders"
    },
    recentRides: [
      {
        id: 1,
        title: "Sunrise at Nandi Hills",
        date: "2 days ago",
        distance: "65 km",
        image: "/api/placeholder/150/100",
        participants: 4
      },
      {
        id: 2,
        title: "Coorg Coffee Trail",
        date: "1 week ago",
        distance: "180 km",
        image: "/api/placeholder/150/100",
        participants: 6
      }
    ],
    mutualConnections: [
      { name: "Priya", avatar: "/api/placeholder/30/30" },
      { name: "Vikram", avatar: "/api/placeholder/30/30" },
      { name: "Sneha", avatar: "/api/placeholder/30/30" }
    ]
  };

  const rider = mockOr(DEMO_RIDER, {
    ...DEMO_RIDER,
    name: "",
    bio: "",
    bike: "",
    location: "",
    points: 0,
    streak: 0,
    joinedDate: "",
    isOnline: false,
    badges: [],
    stats: {
      ridesCompleted: 0,
      distanceCovered: "0 km",
      averageRating: 0,
      followers: 0,
      following: 0,
    },
    rideStyle: [],
    preferences: { timePreference: [], difficulty: [], groupSize: "" },
    recentRides: [],
    mutualConnections: [],
  });

  const handleConnect = () => {
    setIsConnected(true);
    onConnect?.(riderId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full h-[90vh] sm:w-[480px] sm:h-[80vh] sm:rounded-2xl overflow-hidden">
        {/* Header with cover image */}
        <div className="relative">
          <img
            src={rider.coverImage}
            alt="Cover"
            loading="lazy"
            className="w-full h-32 object-cover"
          />
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="bg-black/20 text-white hover:bg-black/40 rounded-full w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Profile picture */}
          <div className="absolute -bottom-12 left-4">
            <div className="relative">
              <Avatar className="w-24 h-24 ring-4 ring-white">
                <AvatarImage src={rider.avatar} />
                <AvatarFallback className="bg-orange-100 text-orange-600 text-2xl font-bold">
                  {rider.name[0]}
                </AvatarFallback>
              </Avatar>
              {rider.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
              )}
            </div>
          </div>
        </div>

        {/* Profile info */}
        <div className="pt-14 px-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{rider.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <MapPin className="w-4 h-4" />
                {rider.location}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{rider.points}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">{rider.streak} day streak</span>
                </div>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStartChat?.(riderId)}
                className="w-10 h-10 p-0 rounded-full"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-10 h-10 p-0 rounded-full"
              >
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">{rider.bio}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {rider.badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Crown className="w-3 h-3 mr-1" />
                {badge}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">{rider.stats.ridesCompleted}</div>
              <div className="text-xs text-gray-600">Rides</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">{rider.stats.distanceCovered}</div>
              <div className="text-xs text-gray-600">Distance</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">{rider.stats.followers}</div>
              <div className="text-xs text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">{rider.stats.averageRating}</div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-4">
            <Button
              onClick={handleConnect}
              disabled={isConnected}
              className={cn(
                "flex-1",
                isConnected 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-orange-500 hover:bg-orange-600"
              )}
            >
              {isConnected ? "✓ Connected" : "Connect"}
            </Button>
            <Button
              onClick={() => onInviteToRide?.(riderId)}
              variant="outline"
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Invite to Ride
            </Button>
          </div>

          {/* Mutual connections */}
          {rider.mutualConnections.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700">Mutual Connections</span>
                <Badge variant="secondary" className="text-xs">
                  {rider.mutualConnections.length}
                </Badge>
              </div>
              <div className="flex gap-2">
                {rider.mutualConnections.map((connection, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={connection.avatar} />
                      <AvatarFallback className="text-xs">{connection.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-600">{connection.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mx-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="rides">Recent Rides</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Bike</h3>
                  <p className="text-sm text-gray-700">{rider.bike}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ride Styles</h3>
                  <div className="flex flex-wrap gap-2">
                    {rider.rideStyle.map((style, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Member Since</h3>
                  <p className="text-sm text-gray-700">{rider.joinedDate}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rides" className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="space-y-3">
                {rider.recentRides.map((ride) => (
                  <div key={ride.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex gap-3">
                      <img
                        src={ride.image}
                        alt={ride.title}
                        loading="lazy"
                        className="w-16 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{ride.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                          <span>{ride.date}</span>
                          <span>{ride.distance}</span>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {ride.participants}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Time Preference</h3>
                  <div className="flex flex-wrap gap-2">
                    {rider.preferences.timePreference.map((time, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Difficulty Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {rider.preferences.difficulty.map((level, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Preferred Group Size</h3>
                  <p className="text-sm text-gray-700">{rider.preferences.groupSize}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RiderProfileModal;