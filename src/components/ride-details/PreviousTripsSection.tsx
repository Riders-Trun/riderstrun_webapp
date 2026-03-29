import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Shield,
  Star,
  Camera,
  Calendar,
  CheckCircle,
  Cloud,
  TrendingUp,
  Award,
} from "lucide-react";
import type { RideDetails } from "@/data/rideDetails";

interface PreviousTripsSectionProps {
  previousTrips: RideDetails["previousTrips"];
  showAll: boolean;
  onToggleShowAll: () => void;
}

const PreviousTripsSection = ({
  previousTrips,
  showAll,
  onToggleShowAll,
}: PreviousTripsSectionProps) => (
  <div className="p-4">
    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Ride History & Reviews</span>
          </div>
          <Badge className="bg-green-100 text-green-700 border-green-200">
            {previousTrips.totalCompletedTrips} completed
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-green-700">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
            <span className="font-medium">{previousTrips.averageRating}</span>
            <span className="text-green-600">({previousTrips.totalRiders} riders)</span>
          </div>
          <div className="flex items-center gap-1">
            <Camera className="w-4 h-4" />
            <span>{previousTrips.totalPhotos} photos shared</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Last: {previousTrips.lastTripDate}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {previousTrips.trips.slice(0, showAll ? 5 : 2).map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-lg p-4 border border-green-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-50 text-green-700 border-green-200"
                    >
                      {trip.date}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{trip.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{trip.participants} riders</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Cloud className="w-3 h-3" />
                      {trip.weather}
                    </span>
                    <span className="flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      {trip.photos} photos
                    </span>
                  </div>
                </div>
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={trip.featuredPhoto}
                    alt="Trip highlight"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-700 italic mb-2">
                  "{trip.testimonial}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">- {trip.reviewer}</span>
                  <div className="flex">
                    {[...Array(trip.reviewerRating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    Actual Expenses
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Fuel:</span>
                      <span className="font-medium">{trip.expenses.actualFuel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Food:</span>
                      <span className="font-medium">{trip.expenses.breakfast}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tolls:</span>
                      <span className="font-medium">{trip.expenses.tolls}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1 font-semibold text-blue-700">
                      <span>Total:</span>
                      <span>{trip.expenses.total}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-2">
                  <div className="text-xs text-amber-600 font-medium mb-1">
                    Trip Highlights
                  </div>
                  <div className="space-y-1">
                    {trip.highlights.slice(0, 3).map((highlight, i) => (
                      <div
                        key={i}
                        className="text-xs text-amber-700 flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {previousTrips.trips.length > 2 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleShowAll}
            className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
          >
            {showAll
              ? "Show Less"
              : `View All ${previousTrips.totalCompletedTrips} Previous Trips`}
            <TrendingUp className="w-4 h-4 ml-2" />
          </Button>
        )}

        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-3 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Why Join This Ride?
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              "Proven track record",
              "Consistent experience",
              "Transparent costs",
              "Great community",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1 text-green-700">
                <CheckCircle className="w-3 h-3" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default PreviousTripsSection;
