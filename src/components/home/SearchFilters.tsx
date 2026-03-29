import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { 
  Filter, 
  MapPin, 
  Clock, 
  Users, 
  Zap, 
  Calendar,
  RotateCcw,
  ChevronDown 
} from "lucide-react";

interface FilterOptions {
  range: number[];
  sortBy: string;
  bikeCC: string;
  groupSize: number[];
  duration: string;
  rideType: string[];
}

interface SearchFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  totalResults: number;
}
const SearchFilters = ({ filters, onFiltersChange, totalResults }: SearchFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: "nearest", label: "Nearest First", icon: MapPin },
    { value: "earliest", label: "Earliest Date", icon: Clock },
    { value: "popular", label: "Most Popular", icon: Users },
    { value: "newest", label: "Newly Posted", icon: Zap }
  ];

  const bikeCCOptions = [
    { value: "any", label: "Any CC" },
    { value: "100-150", label: "100-150cc" },
    { value: "150-250", label: "150-250cc" },
    { value: "250-500", label: "250-500cc" },
    { value: "500+", label: "500cc+" }
  ];

  const durationOptions = [
    { value: "any", label: "Any Duration", emoji: "🕐" },
    { value: "half-day", label: "Half Day", emoji: "🌅" },
    { value: "1-day", label: "1 Day", emoji: "☀️" },
    { value: "2-day", label: "2 Days", emoji: "🌙" },
    { value: "3-day", label: "3+ Days", emoji: "🏕️" }
  ];

  const rideTypeOptions = [
    { value: "breakfast", label: "Breakfast", emoji: "🍳" },
    { value: "adventure", label: "Adventure", emoji: "🏔️" },
    { value: "scenic", label: "Scenic", emoji: "🌅" },
    { value: "long-distance", label: "Long Distance", emoji: "🛣️" },
    { value: "night", label: "Night Ride", emoji: "🌙" },
    { value: "beginner", label: "Beginner", emoji: "🔰" }
  ];
  const updateFilter = (key: keyof FilterOptions, value: FilterOptions[keyof FilterOptions]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      range: [0, 100],
      sortBy: "nearest",
      bikeCC: "any",
      groupSize: [1, 20],
      duration: "any",
      rideType: []
    });
    setIsOpen(false);
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

  const activeCount = getActiveFiltersCount();

  return (
    <div className="px-3 pb-3">
      <div className="flex items-center justify-between gap-3">
        {/* Filter Button */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="relative bg-white/95 hover:bg-orange-50 border-orange-200"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className="w-3 h-3 ml-1" />
              {activeCount > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 bg-orange-500 text-white text-xs flex items-center justify-center">
                  {activeCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Header with Reset */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Distance Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Distance Range: {filters.range[0]}km - {filters.range[1]}km
                </label>
                <Slider
                  value={filters.range}
                  onValueChange={(value) => updateFilter("range", value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0km</span>
                  <span>100km+</span>
                </div>
              </div>

              <Separator />
              {/* Bike CC */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Bike Engine CC</label>
                <Select value={filters.bikeCC} onValueChange={(value) => updateFilter("bikeCC", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bikeCCOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Group Size */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Group Size: {filters.groupSize[0]} - {filters.groupSize[1]} people
                </label>
                <Slider
                  value={filters.groupSize}
                  onValueChange={(value) => updateFilter("groupSize", value)}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 person</span>
                  <span>20+ people</span>
                </div>
              </div>

              <Separator />

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Trip Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  {durationOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.duration === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilter("duration", option.value)}
                      className={`text-xs justify-start ${
                        filters.duration === option.value 
                          ? "bg-orange-500 hover:bg-orange-600" 
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <span className="mr-1">{option.emoji}</span>
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />

              {/* Ride Types */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ride Types</label>
                <div className="grid grid-cols-2 gap-1">
                  {rideTypeOptions.map((option) => {
                    const isSelected = filters.rideType.includes(option.value);
                    return (
                      <Button
                        key={option.value}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newTypes = isSelected
                            ? filters.rideType.filter(t => t !== option.value)
                            : [...filters.rideType, option.value];
                          updateFilter("rideType", newTypes);
                        }}
                        className={`text-xs justify-start ${
                          isSelected 
                            ? "bg-orange-500 hover:bg-orange-600" 
                            : "hover:bg-orange-50"
                        }`}
                      >
                        <span className="mr-1">{option.emoji}</span>
                        {option.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort By Quick Select */}
        <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
          <SelectTrigger className="w-auto bg-white/95 border-orange-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Results Count */}
        <div className="text-xs text-gray-600 ml-auto">
          {totalResults} rides
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;