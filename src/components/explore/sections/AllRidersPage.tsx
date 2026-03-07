import { useState } from "react";
import { 
  ArrowLeft, 
  Search, 
  Filter,
  MapPin,
  Users,
  Calendar,
  Clock,
  Star,
  Route,
  Share2,
  Bookmark,
  ChevronRight
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface AllRidersPageProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProfile?: (riderId: number) => void;
  onQuickChat?: (riderId: number) => void;
}

const AllRidersPage = ({
  isOpen,
  onClose,
  onViewProfile,
  onQuickChat
}: AllRidersPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDistance, setSelectedDistance] = useState("all");
  const [selectedTab, setSelectedTab] = useState("riders");

  // Mock data for all riders
  const allRiders = [
    {
      id: 1,
      name: "Arjun Patel",
      avatar: "/api/placeholder/40/40",
      bike: "Royal Enfield Classic 350",
      distance: "2.5 km",
      status: "active",
      rating: 4.8,
      rides: 89,
      lastActive: "Active now",
      specialties: ["Adventure", "Photography"]
    },
    {
      id: 2,
      name: "Priya Sharma",
      avatar: "/api/placeholder/40/40",
      bike: "KTM Duke 390",
      distance: "4.1 km",
      status: "looking",
      rating: 4.9,
      rides: 67,
      lastActive: "2 hours ago",
      specialties: ["City Rides", "Women Only"]
    },
    {
      id: 3,
      name: "Vikram Singh",
      avatar: "/api/placeholder/40/40",
      bike: "Bajaj Dominar 400",
      distance: "1.8 km",
      status: "upcoming",
      rating: 4.7,
      rides: 156,
      lastActive: "Planning Sunday ride",
      specialties: ["Long Distance", "Touring"]
    },
    {
      id: 4,
      name: "Sneha Reddy",
      avatar: "/api/placeholder/40/40",
      bike: "Honda CB300R",
      distance: "3.2 km",
      status: "active",
      rating: 4.6,
      rides: 45,
      lastActive: "Active now",
      specialties: ["Cafe Hopping", "Evening Rides"]
    },
    {
      id: 5,
      name: "Rohit Kumar",
      avatar: "/api/placeholder/40/40",
      bike: "Yamaha R15",
      distance: "5.1 km",
      status: "looking",
      rating: 4.5,
      rides: 78,
      lastActive: "1 hour ago",
      specialties: ["Track Days", "Performance"]
    }
  ];

  // Mock popular routes
  const popularRoutes = [
    {
      id: 1,
      name: "Nandi Hills Sunrise",
      distance: "65 km",
      difficulty: "Medium",
      rating: 4.8,
      completions: 156,
      thumbnail: "/api/placeholder/120/80"
    },
    {
      id: 2,
      name: "Coorg Coffee Trail",
      distance: "180 km",
      difficulty: "Easy",
      rating: 4.9,
      completions: 89,
      thumbnail: "/api/placeholder/120/80"
    },
    {
      id: 3,
      name: "Wayanad Hills Circuit",
      distance: "240 km",
      difficulty: "Hard",
      rating: 4.7,
      completions: 67,
      thumbnail: "/api/placeholder/120/80"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "looking": return "bg-orange-500";
      case "upcoming": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Active Now";
      case "looking": return "Looking for Crew";
      case "upcoming": return "Has Upcoming Rides";
      default: return "Available";
    }
  };

  const filteredRiders = allRiders.filter(rider => {
    const matchesSearch = rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rider.bike.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || rider.status === selectedCategory;
    const matchesDistance = selectedDistance === "all" || 
                           (selectedDistance === "5km" && parseFloat(rider.distance) <= 5) ||
                           (selectedDistance === "10km" && parseFloat(rider.distance) <= 10);
    
    return matchesSearch && matchesCategory && matchesDistance;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-0 w-8 h-8 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Discover</h1>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search riders, bikes, or routes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-0 rounded-xl"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Riders</SelectItem>
              <SelectItem value="active">🟢 Active Now</SelectItem>
              <SelectItem value="looking">🔍 Looking for Crew</SelectItem>
              <SelectItem value="upcoming">📅 Upcoming Rides</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDistance} onValueChange={setSelectedDistance}>
            <SelectTrigger className="w-[120px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Distance</SelectItem>
              <SelectItem value="5km">Within 5km</SelectItem>
              <SelectItem value="10km">Within 10km</SelectItem>
              <SelectItem value="20km">Within 20km</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="h-9 px-3">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
          <TabsTrigger value="riders">
            Riders ({filteredRiders.length})
          </TabsTrigger>
          <TabsTrigger value="routes">
            Popular Routes ({popularRoutes.length})
          </TabsTrigger>
        </TabsList>

        {/* Riders Tab */}
        <TabsContent value="riders" className="px-4 mt-4">
          <div className="space-y-3">
            {filteredRiders.map((rider) => (
              <div 
                key={rider.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onViewProfile?.(rider.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={rider.avatar} />
                      <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                        {rider.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                      getStatusColor(rider.status)
                    )}></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{rider.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {rider.distance}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 truncate">{rider.bike}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {rider.rating}
                      </div>
                      <span>{rider.rides} rides</span>
                      <span>{rider.lastActive}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {rider.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickChat?.(rider.id);
                          }}
                          className="h-7 px-3 text-xs border-blue-200 text-blue-600"
                        >
                          Chat
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle connect
                          }}
                          className="h-7 px-3 text-xs bg-orange-500 hover:bg-orange-600"
                        >
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="px-4 mt-4">
          <div className="space-y-3">
            {popularRoutes.map((route) => (
              <div 
                key={route.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex gap-3">
                  <img
                    src={route.thumbnail}
                    alt={route.name}
                    loading="lazy"
                    className="w-20 h-16 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{route.name}</h3>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Route className="w-4 h-4" />
                        {route.distance}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          route.difficulty === "Easy" && "border-green-300 text-green-700",
                          route.difficulty === "Medium" && "border-yellow-300 text-yellow-700",
                          route.difficulty === "Hard" && "border-red-300 text-red-700"
                        )}
                      >
                        {route.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {route.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {route.completions} completed
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Bookmark className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom spacing */}
      <div className="h-6"></div>
    </div>
  );
};

export default AllRidersPage;