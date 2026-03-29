import { Map, Star, Clock, Route, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RideRoute } from "@/types/explore";

interface RideRouteCardProps {
  route: RideRoute;
  onViewDetails: (routeId: number) => void;
  onSaveRoute: (routeId: number) => void;
  onPlanRide: (routeId: number) => void;
  isSaved?: boolean;
}

const RideRouteCard = ({ 
  route, 
  onViewDetails, 
  onSaveRoute, 
  onPlanRide,
  isSaved = false 
}: RideRouteCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-700 border-green-200";
      case "Moderate": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Challenging": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Expert": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="relative">
        <img
          src={route.image}
          alt={route.name}
          loading="lazy"
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge 
            variant="outline"
            className={`${getDifficultyColor(route.difficulty)}`}
          >
            {route.difficulty}
          </Badge>
        </div>
        {route.hasGPXFile && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-blue-500 text-white border-0">
              GPX Available
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{route.name}</h3>
        
        {/* Route stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Map className="w-3 h-3" />
            {route.distance}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {route.duration}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            {route.rating} ({route.reviewCount})
          </div>
        </div>
        
        {/* Route description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{route.description}</p>
        
        {/* Start to end */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="flex-1">{route.startPoint}</span>
          <ArrowRight className="w-3 h-3 text-gray-400" />
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="flex-1">{route.endPoint}</span>
        </div>
        
        {/* Terrain tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {route.terrain.map((item, index) => (
            <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 bg-gray-50">
              {item}
            </Badge>
          ))}
        </div>
        
        {/* Highlights */}
        {route.highlights && route.highlights.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-700 mb-1">Highlights:</div>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-0.5">
              {route.highlights.slice(0, 2).map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
              {route.highlights.length > 2 && (
                <li className="text-gray-500">+{route.highlights.length - 2} more</li>
              )}
            </ul>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            className={isSaved ? "border-orange-200 text-orange-600 flex-1" : "border-gray-200 text-gray-600 flex-1"}
            onClick={() => onSaveRoute(route.id)}
          >
            {isSaved ? "Saved" : "Save Route"}
          </Button>
          <Button 
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 flex-1"
            onClick={() => onPlanRide(route.id)}
          >
            Plan Ride
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RideRouteCard;