import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Share2,
  Star,
  Mountain,
  Calendar,
  Timer,
  Loader,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import GlobalHeader from "@/components/GlobalHeader";
import OverviewTab from "@/components/ride-discovery/OverviewTab";
import RouteTab from "@/components/ride-discovery/RouteTab";
import TalksTab from "@/components/ride-discovery/TalksTab";
import PhotosTab from "@/components/ride-discovery/PhotosTab";
import { getMockRideData } from "@/data/rideDiscovery";

const RideDiscoveryScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const rideData = getMockRideData(id || "1");

  if (isLoading) {
    return (
      <div className="bg-gray-50">
        <GlobalHeader
          title="Route Discovery"
          showBack={true}
          showNotifications={true}
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading route details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <GlobalHeader
        title="Route Discovery"
        subtitle="Explore amazing routes"
        showBack={true}
        showNotifications={true}
      />

      <div className="p-3 space-y-4 pb-20">
        {/* Route Header */}
        <Card className="overflow-hidden">
          <div className="relative">
            <div className="h-48 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center">
              <div className="text-center text-white">
                <Mountain className="w-16 h-16 mx-auto mb-2 opacity-80" />
                <h3 className="text-2xl font-bold">{rideData.title}</h3>
                <p className="text-orange-100 text-sm">{rideData.route}</p>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {rideData.completedRides}
                    </div>
                    <div className="text-xs text-gray-600">Past Rides</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {rideData.rating}
                    </div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {rideData.distance}
                    </div>
                    <div className="text-xs text-gray-600">Distance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-orange-500" />
              <div>
                <div className="text-sm font-medium">{rideData.estimatedTime}</div>
                <div className="text-xs text-gray-500">Duration</div>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium">{rideData.bestTime}</div>
                <div className="text-xs text-gray-500">Best Time</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {rideData.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-orange-50 border-orange-200 text-orange-700"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="route" className="text-xs">Route</TabsTrigger>
            <TabsTrigger value="talks" className="text-xs">Talks</TabsTrigger>
            <TabsTrigger value="photos" className="text-xs">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab pastGroups={rideData.pastGroups} tips={rideData.tips} />
          </TabsContent>

          <TabsContent value="route">
            <RouteTab routeStops={rideData.routeStops} />
          </TabsContent>

          <TabsContent value="talks">
            <TalksTab riderTalks={rideData.riderTalks} />
          </TabsContent>

          <TabsContent value="photos">
            <PhotosTab photos={rideData.photos} />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button
            onClick={() => navigate("/plan-ride")}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Plan This Route
          </Button>
          <Button
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Route
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RideDiscoveryScreen;
