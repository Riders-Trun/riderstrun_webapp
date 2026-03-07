
import { useState, memo, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Users, Star, Share2, UserPlus, Navigation, Camera, Fuel } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { formatRideDate, getTimeUntilRide, getRideTypeEmoji, getDifficultyColorFromDistance, getDifficultyFromDistance } from "@/lib/rideUtils";
import { TYPE_GRADIENTS } from "@/constants";
import type { Ride } from "@/types";
import "./RideCard.css";

interface RideCardProps {
  ride: Ride;
}

const RideCard = memo(({ ride }: RideCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isNavigating, setIsNavigating] = useState(false);
  const rideDate = formatRideDate(ride.date);
  const timeStatus = getTimeUntilRide(ride.date);
  const typeEmoji = getRideTypeEmoji(ride.type);

  // Deterministic pseudo-random values based on ride.id
  const stableValues = useMemo(() => ({
    rating: `4.${(ride.id % 4) + 5}`,
    photos: (ride.id * 7) % 30 + 10,
    stops: (ride.id % 3) + 1,
  }), [ride.id]);
  
  // Determine if ride is featured (high joined count or organizer)
  const isFeatured = ride.joinedCount >= 10 || ride.isOrganizer;

  const handleJoinRide = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when button is clicked
    if (ride.joinedCount === ride.maxRiders) {
      toast({
        title: "🎯 Joining Waitlist",
        description: "You've been added to the waitlist for this ride."
      });
    } else {
      navigate(`/ride/${ride.id}`);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when share button is clicked
    if (navigator.share) {
      navigator.share({
        title: ride.title,
        text: `Join me for ${ride.title} on ${ride.date}`,
        url: window.location.origin + `/ride/${ride.id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/ride/${ride.id}`);
      toast({
        title: "📋 Link Copied!",
        description: "Ride link has been copied to clipboard."
      });
    }
  };

  const handlePillionRequest = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when pillion button is clicked
    toast({
      title: "🏍️ Pillion Request Sent!",
      description: "Organizer will review your pillion ride request."
    });
  };

  const handleCardClick = () => {
    setIsNavigating(true);
    // Add a small delay to show the click feedback
    setTimeout(() => {
      navigate(`/ride/${ride.id}`);
    }, 150);
  };

  const getTypeGradient = (type: string) => {
    return TYPE_GRADIENTS[type] || "from-gray-500 to-gray-600";
  };

  const getDifficultyColor = getDifficultyColorFromDistance;
  const getDifficultyLabel = getDifficultyFromDistance;

  return (
    <Card 
      className={`w-full max-w-full overflow-hidden premium-card card-hover-transform border-0 shadow-lg bg-white backdrop-blur-sm group cursor-pointer transition-opacity duration-200 ${rideDate.isToday ? 'urgent-ride' : ''} ${isNavigating ? 'opacity-75' : ''}`}
      onClick={handleCardClick}
    >
      {/* Loading overlay */}
      {isNavigating && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="text-sm text-gray-600 font-medium">Loading ride details...</span>
          </div>
        </div>
      )}
      
      {/* Premium Header with Gradient */}
      <div className={`relative h-32 bg-gradient-to-r ${getTypeGradient(ride.type)} transition-all duration-500`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
        
        {/* Header Content */}
        <div className="absolute bottom-3 left-4 text-white">
          <h3 className="font-bold text-lg leading-tight mb-1 flex items-center gap-2 card-title transition-colors duration-200">
            <span>{typeEmoji}</span>
            {ride.title}
          </h3>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              <span>{ride.distance}</span>
            </div>
            <Badge className={`${getDifficultyColor(ride.distance)} text-xs`}>
              {getDifficultyLabel(ride.distance)}
            </Badge>
          </div>
        </div>
        
        {/* Top Right Info */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <div className="flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{stableValues.rating}</span>
          </div>
          {ride.joinedCount === ride.maxRiders && (
            <Badge className="bg-red-500 text-white text-xs border-0">
              Full
            </Badge>
          )}
          {ride.pillionAvailable && (
            <Badge className="bg-green-500 text-white text-xs border-0 flex items-center gap-1">
              <UserPlus className="w-3 h-3" />
              Pillion
            </Badge>
          )}
        </div>

        {/* Trip Code */}
        {ride.tripCode && (
          <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-mono">
            #{ride.tripCode}
          </div>
        )}

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            ⭐ Featured
          </div>
        )}

        {/* Tap to view indicator - appears on hover */}
        <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
          👆 Tap to view
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Date and Location Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="font-medium">{rideDate.label}</span>
              {rideDate.time && <span className="text-gray-500">at {rideDate.time}</span>}
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                rideDate.isToday ? 'bg-green-50 text-green-700 border-green-200' :
                rideDate.isTomorrow ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              {timeStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>{ride.location}</span>
          </div>
        </div>

        {/* Organizer Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-orange-700">
                  {ride.organizer.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              {ride.isOrganizer && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-yellow-800 fill-yellow-800" />
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                <span>{ride.organizer}</span>
                {ride.isOrganizer && <span className="text-xs text-yellow-600 font-medium">(Host)</span>}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span className="font-medium">{ride.joinedCount}/{ride.maxRiders} riders</span>
              </div>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleShare}
            className="hover:bg-gray-50 hover:scale-105 transition-all duration-200"
          >
            <Share2 className="w-3 h-3" />
          </Button>
        </div>

        {/* Ride Stats */}
        <div className="grid grid-cols-3 gap-3 text-sm bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{ride.distanceFromUser}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Camera className="w-3 h-3" />
            <span className="text-xs">{stableValues.photos} photos</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Fuel className="w-3 h-3" />
            <span className="text-xs">{stableValues.stops} stops</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex flex-wrap gap-2">
          <div className={`text-xs px-3 py-1 rounded-full font-medium ${
            rideDate.isToday ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700' :
            'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700'
          }`}>
            📍 {ride.distanceFromUser} away
          </div>
          {ride.brand && (
            <div className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">
              🏍️ {ride.brand}
            </div>
          )}
          <div className="text-xs bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
            <span>{typeEmoji}</span>
            {ride.type}
          </div>
          {rideDate.isToday && (
            <div className="text-xs bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-3 py-1 rounded-full font-medium animate-pulse">
              🔥 Starting Soon
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium flex-1 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={handleJoinRide}
            disabled={ride.joinedCount === ride.maxRiders && !ride.pillionAvailable}
          >
            <span className="truncate">
              {ride.joinedCount === ride.maxRiders ? "Join Waitlist" : "Quick Join"}
            </span>
          </Button>
          
          {ride.pillionAvailable && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handlePillionRequest}
              className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <UserPlus className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Pillion</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

RideCard.displayName = 'RideCard';

export default RideCard;
