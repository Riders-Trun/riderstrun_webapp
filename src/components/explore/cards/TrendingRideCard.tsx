import { MapPin, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TrendingRide } from "@/types/explore";

interface TrendingRideCardProps {
  ride: TrendingRide;
  onJoinRide?: (rideId: number) => void;
  variant?: "full" | "compact";
}

const TrendingRideCard = ({ 
  ride, 
  onJoinRide, 
  variant = "full" 
}: TrendingRideCardProps) => {
  if (variant === "compact") {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="flex gap-3 p-4">
          <img
            src={ride.image}
            alt={ride.title}
            loading="lazy"
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{ride.title}</h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
              <MapPin className="w-3 h-3" />
              {ride.location}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {ride.difficulty}
                </Badge>
                <span className="text-xs text-gray-500">{ride.distance}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                {ride.participants}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <div className="relative">
        <img
          src={ride.image}
          alt={ride.title}
          loading="lazy"
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-black/70 text-white">
            {ride.difficulty}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-black/70 rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">{ride.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{ride.title}</h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <MapPin className="w-3 h-3" />
          {ride.location}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{ride.distance}</span>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {ride.participants}
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => onJoinRide?.(ride.id)}
          >
            Join Ride
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrendingRideCard;