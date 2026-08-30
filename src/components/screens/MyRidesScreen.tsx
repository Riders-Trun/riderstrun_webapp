
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MapPin, Clock, Users, Calendar, Star } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import { useUpcomingRides, usePastRides, useOrganizedRides, useLeaveRide } from "@/hooks/useRides";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { MyRide } from "@/types";

const MyRidesScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: upcomingRides = [] } = useUpcomingRides();
  const { data: pastRides = [] } = usePastRides();
  const { data: organizedRides = [] } = useOrganizedRides();

  const leaveRide = useLeaveRide();
  // Leaving is not undoable from the UI — rejoining a full or invite-only ride
  // may not be possible — so it asks first.
  const [rideToLeave, setRideToLeave] = useState<MyRide | null>(null);

  const confirmLeave = () => {
    if (!rideToLeave) return;
    const ride = rideToLeave;
    setRideToLeave(null);
    leaveRide.mutate(String(ride.id), {
      onSuccess: () => toast({ title: "You left the ride", description: ride.title }),
      onError: (error: Error) =>
        toast({ title: "Could not leave", description: error.message, variant: "destructive" }),
    });
  };

  const shareRide = async (ride: MyRide) => {
    const url = `${window.location.origin}/ride/${encodeURIComponent(String(ride.id))}`;
    try {
      // The Web Share sheet is the right affordance on mobile, where this app
      // mostly runs. Everywhere else, the clipboard is the fallback.
      if (navigator.share) {
        await navigator.share({ title: ride.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: "Share it with the riders you want along." });
    } catch (error) {
      // A cancelled share sheet lands here too, and is not worth a message.
      if ((error as Error)?.name === "AbortError") return;
      toast({ title: "Could not share", description: "Copy the link from the address bar instead.", variant: "destructive" });
    }
  };

  const RideCard = ({ ride, showActions = false, isPast = false }: { ride: MyRide; showActions?: boolean; isPast?: boolean }) => (
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
            {showActions && !isPast && !ride.isCurrentUserOrganizer && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRideToLeave(ride)}
                disabled={leaveRide.isPending}
              >
                Leave
              </Button>
            )}
            {showActions && !isPast && (
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => navigate(`/ride/${ride.id}`)}
              >
                View
              </Button>
            )}
            {isPast && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/ride/${ride.id}`)}>
                Details
              </Button>
            )}
            {ride.status === "organizing" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/plan-ride?edit=${encodeURIComponent(String(ride.id))}`)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => shareRide(ride)}
                >
                  Share
                </Button>
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
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => navigate("/")}>
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
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => navigate("/plan-ride")}>
                  Plan a Ride
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={rideToLeave !== null} onOpenChange={(open) => !open && setRideToLeave(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave this ride?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll be removed from {rideToLeave?.title ?? "this ride"} and your seat goes back to
              the group. If the ride fills up or is invite-only, you may not be able to rejoin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay on the ride</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLeave}>Leave ride</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyRidesScreen;
