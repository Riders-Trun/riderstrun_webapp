
import { Route, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDifficultyColor } from "@/lib/rideUtils";

interface PopularRoute {
  id: string;
  name: string;
  distance: string;
  difficulty: string;
  rating: number;
  timesRidden: number;
  route: {
    startPoint: string;
    destination: string;
    time: string;
  };
  streak: { current: number; target: number; reward: string };
}

interface PopularRoutesProps {
  routes: PopularRoute[];
  selectedRoute: string;
  onRouteSelect: (route: PopularRoute) => void;
}

const PopularRoutes = ({ routes, selectedRoute, onRouteSelect }: PopularRoutesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Route className="w-5 h-5" />
          Popular Routes
        </CardTitle>
        <p className="text-sm text-gray-600">Choose from community favorites to auto-fill your ride</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {routes.map((route) => (
            <div
              key={route.id}
              onClick={() => onRouteSelect(route)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-orange-300 ${
                selectedRoute === route.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-sm">{route.name}</h3>
                  <p className="text-xs text-gray-500">{route.distance} • {route.timesRidden} rides completed</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(route.difficulty)}>
                    {route.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{route.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium">Route Streak</span>
                  <span className="text-xs text-gray-500">{route.streak.current}/{route.streak.target}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${(route.streak.current / route.streak.target) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {route.streak.target - route.streak.current} more to earn {route.streak.reward}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularRoutes;
