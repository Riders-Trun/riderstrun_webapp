import { useState } from "react";
import { MapPin, Users, Clock, Star, Zap, ChevronRight, MessageCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NearbyRider {
  id: number;
  name: string;
  avatar: string;
  bike: string;
  points: number;
  streak: number;
  distance: string;
  status: "active" | "upcoming" | "looking";
  rideStyle: string[];
  lastSeen: string;
  isOnline: boolean;
  bio?: string;
  lastRideLocation?: string;
  mutualConnections?: number;
}

interface NearbyRiderCardProps {
  rider: NearbyRider;
  onConnect?: (riderId: number) => void;
  onInvite?: (riderId: number) => void;
  onViewProfile?: (riderId: number) => void;
  onQuickChat?: (riderId: number) => void;
  variant?: "compact" | "expanded";
}

const NearbyRiderCard = ({ 
  rider, 
  onConnect, 
  onInvite, 
  onViewProfile,
  onQuickChat,
  variant = "expanded"
}: NearbyRiderCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { 
          label: "Active Now", 
          color: "bg-green-500", 
          textColor: "text-green-600",
          bgColor: "bg-green-50",
          pulse: true
        };
      case "upcoming":
        return { 
          label: "Upcoming Rides", 
          color: "bg-blue-500", 
          textColor: "text-blue-600",
          bgColor: "bg-blue-50",
          pulse: false
        };
      case "looking":
        return { 
          label: "Looking for Crew", 
          color: "bg-orange-500", 
          textColor: "text-orange-600",
          bgColor: "bg-orange-50",
          pulse: true
        };
      default:
        return { 
          label: "Available", 
          color: "bg-gray-500", 
          textColor: "text-gray-600",
          bgColor: "bg-gray-50",
          pulse: false
        };
    }
  };

  const statusConfig = getStatusConfig(rider.status);

  if (variant === "compact") {
    return (
      <div 
        className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 active:scale-[0.98]"
        onClick={() => onViewProfile?.(rider.id)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-12 h-12 ring-2 ring-orange-100">
              <AvatarImage src={rider.avatar} />
              <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                {rider.name[0]}
              </AvatarFallback>
            </Avatar>
            {rider.isOnline && (
              <div className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white",
                statusConfig.pulse && "animate-pulse"
              )}></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 truncate">{rider.name}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                {rider.distance}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <span className="truncate">{rider.bike}</span>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-orange-500" />
                <span>{rider.streak}</span>
              </div>
            </div>

            <Badge 
              variant="outline" 
              className={cn(
                "text-xs border-0 h-5",
                statusConfig.bgColor,
                statusConfig.textColor
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full mr-1", statusConfig.color)}></div>
              {statusConfig.label}
            </Badge>
          </div>

          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden">
      {/* Header - Always visible */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="w-14 h-14 ring-2 ring-orange-100">
              <AvatarImage src={rider.avatar} />
              <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-lg">
                {rider.name[0]}
              </AvatarFallback>
            </Avatar>
            {rider.isOnline && (
              <div className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white",
                statusConfig.pulse && "animate-pulse"
              )}></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{rider.name}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                {rider.distance}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-2 text-sm text-gray-600">
              <span className="font-medium truncate">{rider.bike}</span>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>{rider.points}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-orange-500" />
                  <span>{rider.streak}</span>
                </div>
              </div>
            </div>

            <Badge 
              variant="outline" 
              className={cn(
                "text-xs border-0 mb-2",
                statusConfig.bgColor,
                statusConfig.textColor
              )}
            >
              <div className={cn("w-2 h-2 rounded-full mr-1", statusConfig.color)}></div>
              {statusConfig.label}
            </Badge>

            <p className="text-xs text-gray-500">{rider.lastSeen}</p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-1 mb-3">
            {rider.rideStyle.slice(0, 2).map((style, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                {style}
              </Badge>
            ))}
            {rider.rideStyle.length > 2 && (
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-0.5 cursor-pointer hover:bg-gray-200"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                +{rider.rideStyle.length - 2}
              </Badge>
            )}
          </div>

          {/* Expandable Section */}
          {isExpanded && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
              {rider.bio && (
                <p className="text-sm text-gray-600 leading-relaxed">{rider.bio}</p>
              )}
              
              {rider.lastRideLocation && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>Last ride: {rider.lastRideLocation}</span>
                </div>
              )}

              {rider.mutualConnections && rider.mutualConnections > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{rider.mutualConnections} mutual connections</span>
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                {rider.rideStyle.slice(2).map((style, index) => (
                  <Badge key={index + 2} variant="secondary" className="text-xs px-2 py-0.5">
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onConnect?.(rider.id)}
              className="flex-1 text-xs border-orange-200 text-orange-600 hover:bg-orange-50 active:scale-95 transition-transform"
            >
              Connect
            </Button>
            {rider.status === "active" || rider.status === "looking" ? (
              <Button 
                size="sm"
                onClick={() => onQuickChat?.(rider.id)}
                className="flex-1 text-xs bg-blue-500 hover:bg-blue-600 active:scale-95 transition-transform"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Quick Chat
              </Button>
            ) : (
              <Button 
                size="sm"
                onClick={() => onInvite?.(rider.id)}
                className="flex-1 text-xs bg-orange-500 hover:bg-orange-600 active:scale-95 transition-transform"
              >
                Invite to Ride
              </Button>
            )}
          </div>

          {/* Expand Toggle */}
          {(rider.bio || rider.lastRideLocation || rider.mutualConnections || rider.rideStyle.length > 2) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? "Show Less" : "Show More"}
              <ChevronRight className={cn(
                "w-3 h-3 ml-1 transition-transform",
                isExpanded && "rotate-90"
              )} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyRiderCard;