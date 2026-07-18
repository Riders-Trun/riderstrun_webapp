import { useState, useMemo } from "react";
import GlobalHeader from "@/components/GlobalHeader";
import RideFilters from "@/components/home/RideFilters";
import TrendingSection from "@/components/home/TrendingSection";
import VirtualizedRideList from "@/components/home/VirtualizedRideList";
import DrawableFilters from "@/components/home/DrawableFilters";
import ActiveFilters from "@/components/home/ActiveFilters";
import HomeScreenSkeleton from "@/components/home/HomeScreenSkeleton";
import FadeIn from "@/components/ui/FadeIn";
import { useFilters } from "@/hooks/useFilters";
import { useRides } from "@/hooks/useRides";
import { RIDE_TYPES } from "@/constants";
import { stableSeed } from "@/lib/rideUtils";
import type { Ride } from "@/types";

/**
 * Recency rank for the "newest" sort. Ride ids are UUIDs from the API, so the
 * old `b.id - a.id` produced NaN; prefer the real creation timestamp and fall
 * back to the numeric id that mock data still uses.
 */
const newestRank = (ride: Ride): number => {
  if (ride.createdAt) {
    const t = new Date(ride.createdAt).getTime();
    if (Number.isFinite(t)) return t;
  }
  return typeof ride.id === "number" ? ride.id : stableSeed(ride.id);
};

/** Distance from the rider in km; unknown distances sort last. */
const distanceRank = (ride: Ride): number => {
  const n = parseFloat(ride.distanceFromUser ?? "");
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
};

const HomeScreen = () => {
  const { data: rides = [], isLoading } = useRides();
  const [searchLocation, setSearchLocation] = useState("Bangalore");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const {
    filters,
    setFilters,
    isFilterOpen,
    setIsFilterOpen,
    activeFiltersCount,
    handleRemoveFilter,
    clearAllFilters,
  } = useFilters();

  const filteredRides = useMemo(() => rides.filter(ride => {
    const matchesFilter = selectedFilter === "All" || ride.type === selectedFilter;
    const matchesSearch = searchQuery === "" ||
      ride.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.tripCode?.toLowerCase().includes(searchQuery.toLowerCase());

    const rideMinCC = ride.minimumCC ? parseInt(ride.minimumCC) : 0;
    const matchesCC = filters.bikeCC === "any" ||
      (filters.bikeCC === "100-150" && rideMinCC >= 100 && rideMinCC < 150) ||
      (filters.bikeCC === "150-250" && rideMinCC >= 150 && rideMinCC < 250) ||
      (filters.bikeCC === "250-500" && rideMinCC >= 250 && rideMinCC < 500) ||
      (filters.bikeCC === "500+" && rideMinCC >= 500);

    const matchesGroupSize = ride.joinedCount >= filters.groupSize[0] && ride.joinedCount <= filters.groupSize[1];

    const matchesDuration = filters.duration === "any" ||
      (filters.duration === "half-day" && parseInt(ride.distance) <= 50) ||
      (filters.duration === "1-day" && parseInt(ride.distance) <= 150) ||
      (filters.duration === "2-day" && parseInt(ride.distance) <= 300) ||
      (filters.duration === "3-day" && parseInt(ride.distance) > 300);

    const matchesRideType = filters.rideType.length === 0 ||
      filters.rideType.some(type => ride.type.toLowerCase().includes(type));

    return matchesFilter && matchesSearch && matchesCC && matchesGroupSize && matchesDuration && matchesRideType;
  }), [rides, selectedFilter, searchQuery, filters]);

  const sortedRides = useMemo(() => [...filteredRides].sort((a, b) => {
    switch (filters.sortBy) {
      case "earliest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "popular":
        return b.joinedCount - a.joinedCount;
      case "newest":
        return newestRank(b) - newestRank(a);
      case "nearest":
      default:
        // Rides with no known distance sort last instead of poisoning the
        // comparator with NaN.
        return distanceRank(a) - distanceRank(b);
    }
  }), [filteredRides, filters.sortBy]);

  if (isLoading) {
    return <HomeScreenSkeleton />;
  }

  return (
    <FadeIn>
      <div className="bg-gray-50">
        <GlobalHeader
          showSearch={true}
          showLocation={true}
          showFilter={true}
          showNotifications={true}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchLocation={searchLocation}
          onLocationChange={setSearchLocation}
          onFilterClick={() => setIsFilterOpen(true)}
          filterCount={activeFiltersCount}
        />

        <DrawableFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={sortedRides.length}
          isOpen={isFilterOpen}
          onOpenChange={setIsFilterOpen}
        />

        <ActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={clearAllFilters}
        />

        <TrendingSection />

        <RideFilters
          rideTypes={[...RIDE_TYPES]}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        <div className="px-3 space-y-3 pb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Available Rides</h3>
            <div className="bg-orange-100 px-3 py-1 rounded-full">
              <span className="text-sm text-orange-700 font-semibold">{sortedRides.length} rides</span>
            </div>
          </div>

          <VirtualizedRideList rides={sortedRides} />

          {sortedRides.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                <span className="text-3xl">🔍</span>
              </div>
              <p className="text-gray-700 text-lg font-medium">No rides found</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
};

export default HomeScreen;
