import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import GlobalHeader from "@/components/GlobalHeader";
import FadeIn from "@/components/ui/FadeIn";
import { useSimulatedLoading } from "@/hooks/useLoading";
import RideDetailsSkeleton from "./RideDetailsSkeleton";
import PreviousTripsSection from "@/components/ride-details/PreviousTripsSection";
import { mockRideDetails } from "@/data/rideDetails";
import { useRideById } from "@/hooks/useRides";
import {
  MapPin, Clock, Users, Shield, Phone, CheckCircle, AlertTriangle,
  Star, MessageCircle, Cloud, Thermometer, Route, TrendingUp,
  Calendar, DollarSign, FileText,
} from "lucide-react";

const RideDetailsScreen = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoading: simulatedLoading } = useSimulatedLoading(1200);
  const { data: apiRide, isLoading: apiLoading } = useRideById(id ?? "");
  const [isJoined, setIsJoined] = useState(false);
  const [showAllPreviousTrips, setShowAllPreviousTrips] = useState(false);

  // Use API data when available, otherwise fall back to mock
  const ride = (apiRide as typeof mockRideDetails | null) ?? mockRideDetails;
  const isLoading = simulatedLoading || apiLoading;
  const averageRating =
    ride.reviews.reduce((sum, review) => sum + review.rating, 0) /
    ride.reviews.length;

  const handleJoinRide = () => setIsJoined(true);
  const handleContactOrganizer = () => window.open(`tel:${ride.organizerPhone}`);

  if (isLoading) return <RideDetailsSkeleton />;

  return (
    <FadeIn>
      <div className="min-h-screen bg-gray-50">
        <GlobalHeader
          title="Ride Details"
          showBack={true}
          showNotifications={true}
        />

        <div className="p-3 space-y-3 pb-20">
          {/* Main Ride Info */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl">{ride.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {ride.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {ride.startTime} - {ride.endTime}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {ride.distance}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {ride.difficulty}
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                    <div className="text-sm font-medium text-orange-800 mb-1">Route</div>
                    <div className="text-xs text-orange-700">
                      {ride.startLocation} → {ride.destination}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {ride.route.roadConditions}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Badge variant="outline" className="text-center">{ride.type}</Badge>
                  <Badge variant="secondary" className="text-center">{ride.difficulty}</Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{averageRating.toFixed(1)} ({ride.reviews.length})</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Organizer Info */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-orange-600">
                      {ride.organizer.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {ride.organizer}
                      <Shield className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{ride.organizerRating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Route className="w-3 h-3" />
                        <span>{ride.organizerRides} rides led</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleContactOrganizer}>
                  <Phone className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>

              {/* Cost Breakdown */}
              <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-orange-800">Cost Breakdown</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Fuel (est):</span>
                    <span className="font-medium">{ride.costs.fuel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Breakfast:</span>
                    <span className="font-medium">₹{ride.costs.breakfast}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tolls & Parking:</span>
                    <span className="font-medium">
                      ₹{ride.costs.tollCharges + ride.costs.parking}
                    </span>
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-orange-800">
                  <span>Total Cost:</span>
                  <span>{ride.costs.total}</span>
                </div>
              </div>

              {/* Participation Status */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-800">
                      {ride.joinedCount}/{ride.maxRiders} Riders Joined
                    </div>
                    <div className="text-sm text-blue-600">
                      {ride.maxRiders - ride.joinedCount} spots remaining
                    </div>
                  </div>
                </div>
                <div className="w-16 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{
                      width: `${(ride.joinedCount / ride.maxRiders) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Weather Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-gray-500" />
                  <span>{ride.weather.condition}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-gray-500" />
                  <span>{ride.weather.temperature}</span>
                </div>
                <div className="text-gray-600">Humidity: {ride.weather.humidity}</div>
                <div className="text-gray-600">Wind: {ride.weather.windSpeed}</div>
                <div className="text-gray-600">
                  Rain Chance: {ride.weather.rainChance}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Safety Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium text-sm mb-2 text-red-600">
                  Mandatory Gear
                </div>
                <div className="space-y-1">
                  {ride.safetyGear.mandatory.map((gear, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span>{gear}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-medium text-sm mb-2 text-green-600">
                  Recommended Gear
                </div>
                <div className="space-y-1">
                  {ride.safetyGear.recommended.map((gear, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{gear}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Detailed Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ride.schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-sm font-medium text-orange-600 w-16 flex-shrink-0">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.activity}</div>
                      <div className="text-xs text-gray-500">{item.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Ride Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {ride.rules.map((rule, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-orange-600">
                        {index + 1}
                      </span>
                    </div>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Previous Trips Section */}
        <PreviousTripsSection
          previousTrips={ride.previousTrips}
          showAll={showAllPreviousTrips}
          onToggleShowAll={() => setShowAllPreviousTrips(!showAllPreviousTrips)}
        />

        {/* Bottom Action */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="max-w-md mx-auto">
            {!isJoined ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Estimated Total Cost:</span>
                  <span>{ride.costs.total}</span>
                </div>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="lg"
                  onClick={handleJoinRide}
                  disabled={ride.joinedCount >= ride.maxRiders}
                >
                  {ride.joinedCount >= ride.maxRiders
                    ? "Ride Full"
                    : "Join Ride (Free)"}
                </Button>
                <div className="text-xs text-center text-gray-500">
                  {ride.maxRiders - ride.joinedCount} spots left • Free cancellation
                  24h before
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">You're Registered!</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleContactOrganizer}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Contact Organizer
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Group Chat
                  </Button>
                </div>
                <div className="text-xs text-center text-gray-500 mt-2">
                  Assembly point: {ride.startLocation} at {ride.startTime}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default RideDetailsScreen;
