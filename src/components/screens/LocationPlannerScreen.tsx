import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Route, Star, Mountain, Users } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import { getDifficultyColor } from "@/lib/rideUtils";
import { USE_MOCK } from "@/lib/mock";
import { routesApi, type ApiRoute } from "@/services/api";

/**
 * The filter pills match against a route's tags, which riders choose freely.
 * "all" is not a tag — it is the absence of a filter.
 */
const ROUTE_TYPES = [
  { id: "all", label: "All Routes", icon: Route },
  { id: "scenic", label: "Scenic", icon: Mountain },
  { id: "adventure", label: "Adventure", icon: Navigation },
  { id: "heritage", label: "Heritage", icon: Star },
];

const LocationPlannerScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const routesQuery = useQuery({
    queryKey: ["routes"],
    queryFn: () => routesApi.list(),
    enabled: !USE_MOCK,
  });

  const routes: ApiRoute[] = routesQuery.data?.data?.routes ?? [];

  // Both filters run here rather than server-side: the public route list is
  // small enough that a round trip per keystroke would be the slower option.
  const visibleRoutes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return routes.filter((route) => {
      const matchesSearch =
        !query ||
        route.name.toLowerCase().includes(query) ||
        route.start_location.toLowerCase().includes(query) ||
        route.end_location.toLowerCase().includes(query);

      const matchesType =
        selectedFilter === "all" ||
        route.tags.some((tag) => tag.toLowerCase().includes(selectedFilter));

      return matchesSearch && matchesType;
    });
  }, [routes, searchQuery, selectedFilter]);

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
            {ROUTE_TYPES.map((type) => {
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
        
        {/* One real number, in place of the invented "50+ destinations,
            1.2K reviews, 95% happy riders" — nothing counts reviews or
            happiness, and route count is a fact. */}
        <Card className="text-center p-3">
          <div className="text-2xl font-bold text-orange-600">{routes.length}</div>
          <div className="text-xs text-gray-600">
            {routes.length === 1 ? "Route shared by riders" : "Routes shared by riders"}
          </div>
        </Card>

        <div className="space-y-4">
          {routesQuery.isPending && !USE_MOCK ? (
            <p className="text-center text-sm text-gray-500 py-8">Loading routes…</p>
          ) : visibleRoutes.length === 0 ? (
            <Card className="p-8 text-center">
              <Route className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {routes.length === 0 ? "No routes saved yet" : "Nothing matches that"}
              </h3>
              <p className="text-gray-600 mb-4">
                {routes.length === 0
                  ? "Plan a ride and save its route so other riders can find it."
                  : "Try a different search or filter."}
              </p>
              {routes.length === 0 && (
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => navigate("/plan-ride")}
                >
                  Plan a ride
                </Button>
              )}
            </Card>
          ) : (
            visibleRoutes.map((route) => (
              <Card key={route.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">{route.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {route.start_location} → {route.end_location}
                      </span>
                    </div>
                  </div>
                  {route.difficulty && (
                    <Badge className={`${getDifficultyColor(route.difficulty)} shrink-0`}>
                      {route.difficulty}
                    </Badge>
                  )}
                </div>

                {route.description && (
                  <p className="text-sm text-gray-700">{route.description}</p>
                )}

                {route.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {route.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {route.distance_km !== null && (
                    <span className="flex items-center gap-1">
                      <Route className="w-3 h-3" />
                      {route.distance_km} km
                    </span>
                  )}
                  {route.best_time && <span className="text-xs">{route.best_time}</span>}
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {route.completed_rides} ridden
                  </span>
                </div>

                <div className="flex gap-3 pt-1">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/route-discovery/${route.id}`)}
                  >
                    See the route
                  </Button>
                  <Button
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    onClick={() => navigate(`/plan-ride?route=${route.id}`)}
                  >
                    Plan a ride on it
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationPlannerScreen;
