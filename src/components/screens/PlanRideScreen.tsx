
import { mockOr } from "@/lib/mock";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { validateRideForm } from "@/lib/validations";
import { useCreateRide, useUpdateRide, useRideById } from "@/hooks/useRides";
import { fromRideForm } from "@/services/adapters";
import GlobalHeader from "@/components/GlobalHeader";
import UserStats from "@/components/ride-planning/UserStats";
import PopularRoutes from "@/components/ride-planning/PopularRoutes";
import RoleSelection from "@/components/ride-planning/RoleSelection";
import QuickPresets from "@/components/ride-planning/QuickPresets";
import BasicInfo from "@/components/ride-planning/BasicInfo";
import RouteDetails from "@/components/ride-planning/RouteDetails";
import PitStops from "@/components/ride-planning/PitStops";
import RideRules from "@/components/ride-planning/RideRules";
import RideDescription from "@/components/ride-planning/RideDescription";

const EMPTY_FORM = {
  title: "",
  type: "",
  date: "",
  time: "",
  startPoint: "",
  destination: "",
  maxRiders: "",
  description: "",
  role: "planner",
  selectedRoute: ""
};

const PlanRideScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // `?edit=<rideId>` turns this screen into an edit form for an existing ride.
  const editRideId = searchParams.get("edit");

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    time: "",
    startPoint: "",
    destination: "",
    maxRiders: "",
    description: "",
    role: "planner",
    selectedRoute: ""
  });

  const [pitStops, setPitStops] = useState<string[]>([]);
  const [rules, setRules] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const createRide = useCreateRide();
  const updateRide = useUpdateRide();
  const { data: rideBeingEdited } = useRideById(editRideId ?? "");

  const isEditing = Boolean(editRideId);
  const isSaving = createRide.isPending || updateRide.isPending;

  // Fill the form once the ride being edited arrives. Keyed on the ride's id so
  // it does not overwrite what the user has typed on every re-render.
  useEffect(() => {
    if (!rideBeingEdited) return;
    const start = new Date(rideBeingEdited.startDate ?? "");
    const valid = !Number.isNaN(start.getTime());
    const pad = (n: number) => String(n).padStart(2, "0");

    setFormData((prev) => ({
      ...prev,
      title: rideBeingEdited.title ?? "",
      type: rideBeingEdited.type ?? "",
      // The date and time inputs want local values, not the ISO instant.
      date: valid ? `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}` : "",
      time: valid ? `${pad(start.getHours())}:${pad(start.getMinutes())}` : "",
      startPoint: rideBeingEdited.startLocation ?? "",
      destination: rideBeingEdited.destination ?? "",
      maxRiders: rideBeingEdited.maxRiders ? String(rideBeingEdited.maxRiders) : "",
      description: rideBeingEdited.description ?? "",
    }));
  }, [rideBeingEdited]);

  // Demo-only: streaks and points have no backend. Zeros outside mock mode
  // rather than crediting the rider with 23 rides they never organised.
  const userStats = mockOr(
    { currentStreak: 7, longestStreak: 15, ridesOrganized: 23, totalPoints: 1250 },
    { currentStreak: 0, longestStreak: 0, ridesOrganized: 0, totalPoints: 0 }
  );

  // Pre-planned popular routes from "database"
  // Demo-only: there is no popular-routes endpoint, and these carry invented
  // ride counts and ratings. Outside mock mode the section renders empty rather
  // than inviting riders to pick a route nobody has actually ridden.
  const DEMO_POPULAR_ROUTES = [
    {
      id: "nandi-sunrise",
      name: "Nandi Hills Sunrise",
      distance: "62 km",
      difficulty: "Easy",
      rating: 4.8,
      timesRidden: 156,
      route: {
        startPoint: "Cubbon Park, Bangalore",
        destination: "Nandi Hills",
        time: "05:00"
      },
      streak: { current: 3, target: 5, reward: "50 points" }
    },
    {
      id: "coorg-adventure",
      name: "Coorg Coffee Trail",
      distance: "180 km",
      difficulty: "Moderate",
      rating: 4.9,
      timesRidden: 89,
      route: {
        startPoint: "Electronic City, Bangalore",
        destination: "Coorg Coffee Plantations",
        time: "06:00"
      },
      streak: { current: 1, target: 3, reward: "100 points" }
    },
    {
      id: "coastal-highway",
      name: "Coastal Highway Cruise",
      distance: "220 km",
      difficulty: "Hard",
      rating: 4.7,
      timesRidden: 67,
      route: {
        startPoint: "Whitefield, Bangalore",
        destination: "Mangalore Beach",
        time: "05:30"
      },
      streak: { current: 0, target: 2, reward: "150 points" }
    },
    {
      id: "mysore-palace",
      name: "Mysore Palace Run",
      distance: "150 km",
      difficulty: "Easy",
      rating: 4.6,
      timesRidden: 234,
      route: {
        startPoint: "Banashankari, Bangalore",
        destination: "Mysore Palace",
        time: "07:00"
      },
      streak: { current: 5, target: 7, reward: "75 points" }
    }
  ];

  const popularRoutes = mockOr(DEMO_POPULAR_ROUTES, []);

  const handlePresetSelect = (preset: { title: string; type: string; time: string; maxRiders: string; description: string; pitStops: string[]; rules: string[] }) => {
    setFormData({
      ...formData,
      title: preset.title,
      type: preset.type,
      time: preset.time,
      maxRiders: preset.maxRiders,
      description: preset.description
    });
    setPitStops(preset.pitStops);
    setRules(preset.rules);
  };

  const handleRouteSelect = (route: { id: string; name: string; distance: string; difficulty: string; route: { startPoint: string; destination: string; time: string } }) => {
    setFormData({
      ...formData,
      selectedRoute: route.id,
      title: route.name,
      startPoint: route.route.startPoint,
      destination: route.route.destination,
      time: route.route.time,
      maxRiders: "15",
      description: `Popular ${route.name} route. Distance: ${route.distance}. Difficulty: ${route.difficulty}`
    });
  };

  // Arriving from "Plan This Route" on the discovery screen. Preselects the route
  // when it is one this screen actually knows; an unknown id is ignored rather
  // than half-filling the form with nothing.
  const routeParam = searchParams.get("route");
  useEffect(() => {
    if (!routeParam || isEditing) return;
    const match = popularRoutes.find((route) => route.id === routeParam);
    if (match) handleRouteSelect(match);
    // Only re-run when the incoming route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeParam]);

  const handleRuleToggle = (rule: string) => {
    setRules(prev => 
      prev.includes(rule) 
        ? prev.filter(r => r !== rule)
        : [...prev, rule]
    );
  };

  const handlePitStopToggle = (stop: string) => {
    setPitStops(prev =>
      prev.includes(stop)
        ? prev.filter(s => s !== stop) 
        : [...prev, stop]
    );
  };

  const handleFormDataChange = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Was a "Preview" button that did nothing at all. There is no preview screen to
  // send anyone to, so the slot now does the thing a half-filled form actually
  // needs — leave without publishing — rather than continuing to look clickable.
  const handleCancel = () => {
    navigate(isEditing && editRideId ? `/ride/${editRideId}` : "/my-rides");
  };

  const handlePublish = () => {
    const result = validateRideForm(formData);
    if (!result.success) {
      setFormErrors(result.errors);
      const firstError = Object.values(result.errors)[0];
      toast({
        title: "Validation Error",
        description: firstError,
        variant: "destructive",
      });
      return;
    }
    setFormErrors({});

    // The form's own field names are not what the API accepts — see fromRideForm.
    const body = fromRideForm(result.data, { pitStops, rules });

    const onError = (error: Error) => {
      toast({
        title: isEditing ? "Failed to save" : "Failed to publish",
        description: error.message,
        variant: "destructive",
      });
    };

    if (isEditing && editRideId) {
      updateRide.mutate(
        { id: editRideId, data: body },
        {
          onSuccess: () => {
            toast({ title: "Changes saved", description: "Your ride has been updated." });
            navigate(`/ride/${editRideId}`);
          },
          onError,
        }
      );
      return;
    }

    createRide.mutate(body, {
      onSuccess: (response) => {
        toast({ title: "Ride Published!", description: "Your ride has been created successfully." });

        // Clear the form before leaving. Without this the state survives in the
        // route cache, so coming back to plan a second ride showed the first one
        // still filled in — and re-submitting it created a duplicate.
        setFormData(EMPTY_FORM);
        setPitStops([]);
        setRules([]);

        const created = response?.data as { ride?: { id?: string }; id?: string } | undefined;
        const newRideId = created?.ride?.id ?? created?.id;
        navigate(newRideId ? `/ride/${newRideId}` : "/my-rides");
      },
      onError,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <GlobalHeader 
        title="Plan a Ride"
        subtitle="Create an amazing weekend experience"
        showBack={true}
        showNotifications={true}
      />
      
      {/* User Stats */}
      <div className="p-3 border-b bg-white">
        <UserStats userStats={userStats} />
      </div>

      <div className="p-4 space-y-6 pb-20">
        <PopularRoutes 
          routes={popularRoutes}
          selectedRoute={formData.selectedRoute}
          onRouteSelect={handleRouteSelect}
        />

        <RoleSelection 
          role={formData.role}
          onRoleChange={(role) => handleFormDataChange({ role })}
        />

        <QuickPresets onPresetSelect={handlePresetSelect} />

        <BasicInfo
          formData={formData}
          onFormDataChange={handleFormDataChange}
          errors={formErrors}
        />

        <RouteDetails
          formData={formData}
          onFormDataChange={handleFormDataChange}
          errors={formErrors}
        />

        <PitStops 
          pitStops={pitStops}
          onPitStopToggle={handlePitStopToggle}
        />

        <RideRules 
          rules={rules}
          onRuleToggle={handleRuleToggle}
        />

        <RideDescription 
          description={formData.description}
          onDescriptionChange={(description) => handleFormDataChange({ description })}
        />
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-orange-500 hover:bg-orange-600"
            onClick={handlePublish}
            disabled={isSaving}
          >
            {isSaving
              ? (isEditing ? "Saving..." : "Publishing...")
              : isEditing
                ? "Save Changes"
                : formData.role === "organizer"
                  ? "Publish as Organizer"
                  : "Publish Ride"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanRideScreen;
