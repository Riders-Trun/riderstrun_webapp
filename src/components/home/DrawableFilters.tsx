import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Clock, 
  Users, 
  Zap, 
  Calendar,
  RotateCcw,
  X
} from "lucide-react";
import type { FilterOptions } from "@/types";

interface DrawableFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  totalResults: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DrawableFilters = ({ 
  filters, 
  onFiltersChange, 
  totalResults,
  isOpen,
  onOpenChange 
}: DrawableFiltersProps) => {
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
  };
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-4 py-3 border-b bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-white">Filters & Sort</SheetTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-orange-100">{totalResults} rides</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters}
                  className="text-white hover:bg-white/20 h-8"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Sort By */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900">Sort By</label>
              <div className="grid grid-cols-2 gap-2">
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = filters.sortBy === option.value;
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilter("sortBy", option.value)}
                      className={`justify-start h-10 ${
                        isSelected 
                          ? "bg-orange-500 hover:bg-orange-600 text-white" 
                          : "hover:bg-orange-50 hover:border-orange-200"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Distance Range */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900">
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
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900">Bike Engine CC</label>
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
              <label className="text-sm font-semibold text-gray-900">
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
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900">Trip Duration</label>
              <div className="grid grid-cols-2 gap-2">
                {durationOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.duration === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("duration", option.value)}
                    className={`justify-start h-10 ${
                      filters.duration === option.value 
                        ? "bg-orange-500 hover:bg-orange-600 text-white" 
                        : "hover:bg-orange-50 hover:border-orange-200"
                    }`}
                  >
                    <span className="mr-2">{option.emoji}</span>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            <Separator />

            {/* Ride Types */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900">Ride Types</label>
              <div className="grid grid-cols-2 gap-2">
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
                      className={`justify-start h-10 ${
                        isSelected 
                          ? "bg-orange-500 hover:bg-orange-600 text-white" 
                          : "hover:bg-orange-50 hover:border-orange-200"
                      }`}
                    >
                      <span className="mr-2">{option.emoji}</span>
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4 bg-gray-50">
            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Apply Filters ({totalResults} rides)
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DrawableFilters;