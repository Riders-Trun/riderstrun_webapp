
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Users, Calendar, Star } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";

const MyRidesScreen = () => {
  const upcomingRides = [
    {
      id: 1,
      title: "Nandi Sunrise Sprint",
      date: "Sun, 6 AM",
      distance: "80 km round trip",
      organizer: "Rajesh Kumar",
      type: "Breakfast",
      joinedCount: 12,
      status: "confirmed",
      isCurrentUserOrganizer: true
    },
    {
      id: 2,
      title: "Coorg Coffee Trail",
      date: "Sat, 5:30 AM", 
      distance: "120 km round trip",
      organizer: "Priya Singh",
      type: "Long",
      joinedCount: 8,
      status: "confirmed",
      isCurrentUserOrganizer: false
    }
  ];

  const pastRides = [
    {
      id: 3,
      title: "Mysore Palace Run",
      date: "Dec 24, 2023",
      distance: "150 km round trip",
      organizer: "Amit Patel",
      type: "Long",
      joinedCount: 10,
      status: "completed",
      isCurrentUserOrganizer: false
    },
    {
      id: 4,
      title: "Morning Beach Drive",
      date: "Dec 17, 2023",
      distance: "60 km round trip", 
      organizer: "Sneha Reddy",
      type: "Breakfast",
      joinedCount: 8,
      status: "completed",
      isCurrentUserOrganizer: false
    }
  ];

  const organizedRides = [
    {
      id: 5,
      title: "Beginner's Weekend Ride",
      date: "Next Sun, 7 AM",
      distance: "40 km round trip",
      organizer: "You",
      type: "Beginner",
      joinedCount: 6,
      maxRiders: 10,
      status: "organizing",
      isCurrentUserOrganizer: true
    }
  ];

  const RideCard = ({ ride, showActions = false, isPast = false }: any) => (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg truncate">{ride.title}</CardTitle>
            <div className="space-y-1 text-sm text-gray-600 mt-1">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 shrink-0" />
                <span className="truncate">{ride.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{ride.distance}</span>
              </div>
            </div>
          </div>
          <Badge variant={isPast ? "secondary" : "outline"} className="shrink-0">
            {ride.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-orange-600">
                  {ride.organizer === "You" ? "Y" : ride.organizer.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              {ride.isCurrentUserOrganizer && (
                <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium flex items-center gap-1">
                <span className="truncate">{ride.organizer}</span>
                {ride.isCurrentUserOrganizer && <span className="text-xs text-yellow-600 shrink-0">(Host)</span>}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="w-3 h-3 shrink-0" />
                <span>{ride.joinedCount}{ride.maxRiders ? `/${ride.maxRiders}` : ''} {isPast ? 'riders' : 'joined'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {showActions && !isPast && (
              <>
                <Button variant="outline" size="sm">Leave</Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">View</Button>
              </>
            )}
            {isPast && (
              <Button variant="outline" size="sm">Details</Button>
            )}
            {ride.status === "organizing" && (
              <>
                <Button variant="outline" size="sm">Edit</Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">Share</Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-gray-50">
      {/* Global Header */}
      <GlobalHeader 
        title="My Rides"
        subtitle="Track your riding adventures"
        showBack={true}
        showNotifications={true}
        notificationCount={3}
      />

      <div className="p-3">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="upcoming" className="text-xs">Upcoming</TabsTrigger>
            <TabsTrigger value="past" className="text-xs">Past Rides</TabsTrigger>
            <TabsTrigger value="organized" className="text-xs">Organized</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4 mt-4">
            {upcomingRides.length > 0 ? (
              upcomingRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} showActions={true} />
              ))
            ) : (
              <Card className="p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming rides</h3>
                <p className="text-gray-600 mb-4">Join a ride to see it here</p>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Discover Rides
                </Button>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4 mt-4">
            {pastRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} isPast={true} />
            ))}
          </TabsContent>
          
          <TabsContent value="organized" className="space-y-4 mt-4">
            {organizedRides.length > 0 ? (
              organizedRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))
            ) : (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No organized rides</h3>
                <p className="text-gray-600 mb-4">Plan your first ride and lead the group</p>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Plan a Ride
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyRidesScreen;
