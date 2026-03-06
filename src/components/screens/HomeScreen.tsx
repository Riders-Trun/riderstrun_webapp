
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

interface FilterOptions {
  range: number[];
  sortBy: string;
  bikeCC: string;
  groupSize: number[];
  duration: string;
  rideType: string[];
}

const HomeScreen = () => {
  const { isLoading } = useSimulatedLoading(1500); // 1.5 second loading
  const [searchLocation, setSearchLocation] = useState("Bangalore");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    range: [0, 100],
    sortBy: "nearest",
    bikeCC: "any",
    groupSize: [1, 20],
    duration: "any",
    rideType: []
  });

  const rideTypes = ["All", "Breakfast", "Adventure", "Scenic", "Long Distance", "Night Ride"];
  
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
    setFilters({
      range: [0, 100],
      sortBy: "nearest",
      bikeCC: "any",
      groupSize: [1, 20],
      duration: "any",
      rideType: []
    });
  };
  
  const rides = [
    {
      id: 1,
      title: "Nandi Sunrise Sprint",
      date: "Today, 6:00 AM",
      distance: "80 km round trip",
      organizer: "Rajesh Kumar",
      location: "Cubbon Park → Nandi Hills",
      type: "Breakfast",
      joinedCount: 12,
      maxRiders: 15,
      isOrganizer: false,
      distanceFromUser: "2.5 km",
      pillionAvailable: true,
      pillionSlots: 3,
      tripCode: "NH001",
      brand: "Royal Enfield"
    },
    {
      id: 2,
      title: "Coorg Coffee Trail",
      date: "Tomorrow, 5:30 AM",
      distance: "280 km",
      organizer: "Priya Singh",
      location: "Brigade Road → Coorg",
      type: "Adventure",
      joinedCount: 8,
      maxRiders: 12,
      isOrganizer: true,
      distanceFromUser: "1.2 km",
      pillionAvailable: true,
      pillionSlots: 2,
      tripCode: "CT002",
      brand: "Kawasaki"
    },
    {
      id: 3,
      title: "Chikmagalur Hills Explorer",
      date: "Jan 8, 7:00 AM",
      distance: "240 km",
      organizer: "Amit Patel",
      location: "MG Road → Chikmagalur",
      type: "Scenic",
      joinedCount: 15,
      maxRiders: 15,
      isOrganizer: false,
      distanceFromUser: "3.1 km",
      pillionAvailable: false,
      tripCode: "CH003",
      brand: "Honda"
    },
    {
      id: 4,
      title: "Wayanad Monsoon Magic",
      date: "Jan 10, 6:30 AM", 
      distance: "320 km",
      organizer: "Sneha Reddy",
      location: "Electronic City → Wayanad",
      type: "Long Distance",
      joinedCount: 6,
      maxRiders: 10,
      isOrganizer: false,
      distanceFromUser: "5.8 km",
      pillionAvailable: true,
      pillionSlots: 4,
      tripCode: "WM004",
      brand: "Bajaj"
    },
    {
      id: 5,
      title: "Midnight City Cruise",
      date: "Jan 12, 11:00 PM",
      distance: "45 km",
      organizer: "Vikram Raj",
      location: "Koramangala → Outer Ring Road",
      type: "Night Ride",
      joinedCount: 18,
      maxRiders: 20,
      isOrganizer: false,
      distanceFromUser: "0.8 km",
      pillionAvailable: true,
      pillionSlots: 6,
      tripCode: "MC005",
      brand: "Yamaha"
    }
  ];

  const filteredRides = rides.filter(ride => {
    // Basic filter matching
    const matchesFilter = selectedFilter === "All" || ride.type === selectedFilter;
    const matchesSearch = searchQuery === "" || 
      ride.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.tripCode?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Advanced filter matching
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

  // Sort the filtered rides based on sortBy filter
  const sortedRides = [...filteredRides].sort((a, b) => {
    switch (filters.sortBy) {
      case "earliest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "popular":
        return b.joinedCount - a.joinedCount;
      case "newest":
        return b.id - a.id; // Assuming higher ID means newer
      case "nearest":
      default:
        return parseFloat(a.distanceFromUser) - parseFloat(b.distanceFromUser);
    }
  });

  // Show skeleton loading on initial load
  if (isLoading) {
    return <HomeScreenSkeleton />;
  }

  // Show skeleton loading on initial load
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
      
        {/* Drawable Filters */}
        <DrawableFilters 
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={sortedRides.length}
          isOpen={isFilterOpen}
          onOpenChange={setIsFilterOpen}
        />
        
        {/* Active Filters */}
        <ActiveFilters 
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
        
        <TrendingSection />
        
        <RideFilters 
          rideTypes={rideTypes}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        {/* Rides List */}
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
