import { Users, MapPin, Calendar, Bike, MessageCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { RiderMatch } from "@/types/explore";

interface RiderMatchCardProps {
  rider: RiderMatch;
  onConnect: (riderId: number) => void;
  onMessage: (riderId: number) => void;
  onViewProfile: (riderId: number) => void;
}

const RiderMatchCard = ({ 
  rider, 
  onConnect, 
  onMessage,
  onViewProfile 
}: RiderMatchCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-4">
        {/* Header with match percentage */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                <AvatarImage src={rider.avatar} />
                <AvatarFallback>{rider.name[0]}</AvatarFallback>
              </Avatar>
              {rider.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{rider.name}</h3>
                {rider.isOnline && (
                  <span className="text-xs text-green-600">Online</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                {rider.location} • {rider.distance} away
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-orange-500">{rider.matchPercentage}%</div>
            <div className="text-xs text-gray-500">match</div>
          </div>
        </div>
        
        {/* Match reasons */}
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-700 mb-2">Why you match:</div>
          <div className="space-y-2">
            {rider.matchReasons.slice(0, 3).map((reason, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">{reason.reason}</span>
                  <span className="text-gray-500">{reason.score}%</span>
                </div>
                <Progress value={reason.score} className="h-1" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Bike info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
          <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center">
            {rider.bikeImage ? (
              <img src={rider.bikeImage} alt="Bike" loading="lazy" className="w-10 h-10 object-contain" />
            ) : (
              <Bike className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500">Rides</div>
            <div className="text-sm font-medium text-gray-900">{rider.bike}</div>
          </div>
        </div>
        
        {/* Ride preferences */}
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-700 mb-2">Ride preferences:</div>
          <div className="flex flex-wrap gap-1">
            {rider.ridePreferences.map((pref, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                {pref}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {rider.mutualConnections ? `${rider.mutualConnections} mutual connections` : 'No mutual connections'}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Joined {rider.joinedDate}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="bg-orange-500 hover:bg-orange-600 flex-1"
            onClick={() => onConnect(rider.id)}
          >
            Connect
          </Button>
          <Button 
            size="sm"
            variant="outline"
            className="border-gray-200 text-gray-600 flex-1"
            onClick={() => onMessage(rider.id)}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RiderMatchCard;