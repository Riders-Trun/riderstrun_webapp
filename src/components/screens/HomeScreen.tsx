import { useState } from "react";
import GlobalHeader from "@/components/GlobalHeader";
import RideFilters from "@/components/home/RideFilters";
import TrendingSection from "@/components/home/TrendingSection";
import RideCard from "@/components/home/RideCard";
import DrawableFilters from "@/components/home/DrawableFilters";
import ActiveFilters from "@/components/home/ActiveFilters";
import HomeScreenSkeleton from "@/components/home/HomeScreenSkeleton";
import FadeIn from "@/components/ui/FadeIn";
import { useSimulatedLoading } from "@/hooks/useLoading";
import { AVAILABLE_RIDES } from "@/data/rides";
import { RIDE_TYPES, DEFAULT_FILTERS } from "@/constants";
import type { FilterOptions } from "@/types";

const HomeScreen = () => {
  const { isLoading } = useSimulatedLoading(1500);
  const [searchLocation, setSearchLocation] = useState("Bangalore");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    ...DEFAULT_FILTERS,
    rideType: [],
  });

  const handleRemoveFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case "sort":
        setFilters(prev => ({ ...prev, sortBy: "nearest" }));
        break;
      case "bikeCC":
        setFilters(prev => ({ ...prev, bikeCC: "any" }));
        break;
      case "duration":
        setFilters(prev => ({ ...prev, duration: "any" }));
        break;
      case "range":
        setFilters(prev => ({ ...prev, range: [0, 100] }));
        break;
      case "groupSize":
        setFilters(prev => ({ ...prev, groupSize: [1, 20] }));
        break;
      case "rideType":
        setFilters(prev => ({
          ...prev,
          rideType: prev.rideType.filter(type => type !== value)
        }));
        break;
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.sortBy !== "nearest") count++;
    if (filters.bikeCC !== "any") count++;
    if (filters.duration !== "any") count++;
    if (filters.rideType.length > 0) count++;
    if (filters.range[0] > 0 || filters.range[1] < 100) count++;
    if (filters.groupSize[0] > 1 || filters.groupSize[1] < 20) count++;
    return count;
  };

  const handleClearAllFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, rideType: [] });
  };

  const filteredRides = AVAILABLE_RIDES.filter(ride => {
    const matchesFilter = selectedFilter === "All" || ride.type === selectedFilter;
    const matchesSearch = searchQuery === "" ||
      ride.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.tripCode?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCC = filters.bikeCC === "any" ||
      (filters.bikeCC === "100-150" && ride.brand?.includes("Honda")) ||
      (filters.bikeCC === "150-250" && ride.brand?.includes("Bajaj")) ||
      (filters.bikeCC === "250-500" && (ride.brand?.includes("Royal Enfield") || ride.brand?.includes("Kawasaki"))) ||
      (filters.bikeCC === "500+" && ride.brand?.includes("Yamaha"));

    const matchesGroupSize = ride.joinedCount >= filters.groupSize[0] && ride.joinedCount <= filters.groupSize[1];

    const matchesDuration = filters.duration === "any" ||
      (filters.duration === "half-day" && parseInt(ride.distance) <= 50) ||
      (filters.duration === "1-day" && parseInt(ride.distance) <= 150) ||
      (filters.duration === "2-day" && parseInt(ride.distance) <= 300) ||
      (filters.duration === "3-day" && parseInt(ride.distance) > 300);

    const matchesRideType = filters.rideType.length === 0 ||
      filters.rideType.some(type => ride.type.toLowerCase().includes(type));

    return matchesFilter && matchesSearch && matchesCC && matchesGroupSize && matchesDuration && matchesRideType;
  });

  const sortedRides = [...filteredRides].sort((a, b) => {
    switch (filters.sortBy) {
      case "earliest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "popular":
        return b.joinedCount - a.joinedCount;
      case "newest":
        return b.id - a.id;
      case "nearest":
      default:
        return parseFloat(a.distanceFromUser) - parseFloat(b.distanceFromUser);
    }
  });

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
          filterCount={getActiveFiltersCount()}
          notificationCount={3}
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
          onClearAll={handleClearAllFilters}
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

          <div className="space-y-3">
            {sortedRides.map((ride, index) => (
              <FadeIn key={ride.id} delay={index * 100} duration="duration-600">
                <RideCard ride={ride} />
              </FadeIn>
            ))}
          </div>

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
