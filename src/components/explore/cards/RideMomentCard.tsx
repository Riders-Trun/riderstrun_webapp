import { MapPin, Users, Calendar, Route } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RideMoment } from "@/types/explore";

interface RideMomentCardProps {
  moment: RideMoment;
  onJoinNextRide?: (momentId: number) => void;
  onAskForRoute?: (momentId: number) => void;
  onViewRide?: (momentId: number) => void;
}

const RideMomentCard = ({ 
  moment, 
  onJoinNextRide, 
  onAskForRoute, 
  onViewRide 
}: RideMomentCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative">
        <img
          src={moment.image}
          alt={moment.rideTitle}
          loading="lazy"
          className="w-full h-48 object-cover"
        />
        
        {/* Overlay Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{moment.location}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Users className="w-4 h-4" />
              <span>{moment.participantsCount}</span>
            </div>
          </div>
        </div>

        {/* Next Ride Badge */}
        {moment.hasUpcomingRide && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500 text-white text-xs">
              Next Ride Available
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={moment.rider.avatar} />
            <AvatarFallback className="text-xs">{moment.rider.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{moment.rideTitle}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>by {moment.rider.name}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{moment.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tagged Riders */}
        {moment.taggedRiders.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>Completed with:</span>
              <div className="flex flex-wrap gap-1">
                {moment.taggedRiders.slice(0, 3).map((rider, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                    {rider}
                  </Badge>
                ))}
                {moment.taggedRiders.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    +{moment.taggedRiders.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Ride Info */}
        {moment.hasUpcomingRide && moment.upcomingRideDate && (
          <div className="mb-3 p-2 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-1 text-xs text-green-700">
              <Calendar className="w-3 h-3" />
              <span className="font-medium">Next ride: {moment.upcomingRideDate}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {moment.hasUpcomingRide ? (
            <Button 
              size="sm"
              onClick={() => onJoinNextRide?.(moment.id)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-xs"
            >
              Join Next Ride
            </Button>
          ) : (
            <Button 
              size="sm"
              variant="outline"
              onClick={() => onAskForRoute?.(moment.id)}
              className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50 text-xs"
            >
              <Route className="w-3 h-3 mr-1" />
              Ask for Route
            </Button>
          )}
          
          <Button 
            size="sm"
            variant="outline"
            onClick={() => onViewRide?.(moment.id)}
            className="border-gray-200 text-gray-600 hover:bg-gray-50 text-xs px-3"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RideMomentCard;