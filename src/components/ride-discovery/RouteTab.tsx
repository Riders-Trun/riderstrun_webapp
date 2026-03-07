import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Coffee, Fuel, Mountain, Flag, Route } from "lucide-react";
import type { RouteStop } from "@/data/rideDiscovery";

const getStopIcon = (type: string) => {
  switch (type) {
    case "start": return Flag;
    case "checkpoint": return Navigation;
    case "destination": return Mountain;
    case "food": return Coffee;
    case "fuel": return Fuel;
    default: return MapPin;
  }
};

interface RouteTabProps {
  routeStops: RouteStop[];
}

const RouteTab = ({ routeStops }: RouteTabProps) => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Route className="w-5 h-5 text-blue-500" />
          Route Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {routeStops.map((stop, index) => {
            const Icon = getStopIcon(stop.type);
            return (
              <div key={index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stop.type === "start"
                        ? "bg-green-100 text-green-600"
                        : stop.type === "destination"
                        ? "bg-red-100 text-red-600"
                        : stop.type === "food"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {index < routeStops.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{stop.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{stop.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {stop.time}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default RouteTab;
