
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Navigation, Clock, Star, Camera, Users, Route, Fuel, Coffee, Mountain, Search, Filter } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import { getDifficultyColor } from "@/lib/rideUtils";

const LocationPlannerScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const popularDestinations = [
    {
      id: 1,
      name: "Nandi Hills",
      distance: "62 km",
      difficulty: "Easy",
      rating: 4.8,
      reviews: 234,
      image: "photo-1470071459604-3b5ec3a7fe05",
      attractions: ["Sunrise Point", "Bhoga Nandeeshwara Temple", "Paragliding"],
      bestTime: "5:30 AM - 8:00 AM",
      fuelStops: 3,
      diningOptions: 5,
      estimatedCost: "₹500-800"
    },
    {
      id: 2,
      name: "Coorg Coffee Trail",
      distance: "180 km",
      difficulty: "Moderate",
      rating: 4.9,
      reviews: 156,
      image: "photo-1482938289607-e9573fc25ebb",
      attractions: ["Coffee Plantations", "Abbey Falls", "Raja's Seat"],
      bestTime: "6:00 AM - 6:00 PM",
      fuelStops: 4,
      diningOptions: 8,
      estimatedCost: "₹1500-2500"
    },
    {
      id: 3,
      name: "Chikmagalur Hills",
      distance: "245 km",
      difficulty: "Hard",
      rating: 4.7,
      reviews: 189,
      image: "photo-1433086966358-54859d0ed716",
      attractions: ["Mullayanagiri Peak", "Baba Budangiri", "Hebbe Falls"],
      bestTime: "5:00 AM - 7:00 PM",
      fuelStops: 5,
      diningOptions: 6,
      estimatedCost: "₹2000-3000"
    }
  ];

  const routeTypes = [
    { id: "all", label: "All Routes", icon: Route },
    { id: "scenic", label: "Scenic", icon: Mountain },
    { id: "adventure", label: "Adventure", icon: Navigation },
    { id: "heritage", label: "Heritage", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <GlobalHeader 
        title="Location Planner"
        subtitle="Discover amazing riding destinations"
        showBack={true}
        showSearch={true}
        showNotifications={true}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="p-3 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
            {routeTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Badge
                  key={type.id}
                  variant={selectedFilter === type.id ? "default" : "secondary"}
                  className="cursor-pointer whitespace-nowrap flex items-center gap-1"
                  onClick={() => setSelectedFilter(type.id)}
                >
                  <Icon className="w-3 h-3" />
                  {type.label}
                </Badge>
              );
            })}
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-orange-600">50+</div>
            <div className="text-xs text-gray-600">Destinations</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-blue-600">1.2K</div>
            <div className="text-xs text-gray-600">Reviews</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-green-600">95%</div>
            <div className="text-xs text-gray-600">Happy Riders</div>
          </Card>
        </div>

        {/* Popular Destinations */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Popular Destinations</h2>
          {popularDestinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden">
              <div className="relative h-32 bg-gradient-to-r from-orange-400 to-orange-600">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-2 left-3 text-white">
                  <h3 className="font-bold text-lg">{destination.name}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation className="w-3 h-3" />
                    <span>{destination.distance}</span>
                    <Badge className={getDifficultyColor(destination.difficulty)}>
                      {destination.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{destination.rating}</span>
                  <span>({destination.reviews})</span>
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                {/* Attractions */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Top Attractions</div>
                  <div className="flex flex-wrap gap-1">
                    {destination.attractions.map((attraction, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {attraction}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{destination.bestTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{destination.fuelStops} fuel stops</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{destination.diningOptions} dining options</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-600">{destination.estimatedCost}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 bg-orange-500 hover:bg-orange-600">
                    Plan Route
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Route Planning Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Route className="w-5 h-5" />
              Route Planning Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Navigation className="w-4 h-4 mr-2" />
              Custom Route Builder
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MapPin className="w-4 h-4 mr-2" />
              Nearby Attractions Finder
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Mountain className="w-4 h-4 mr-2" />
              Difficulty Calculator
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocationPlannerScreen;
