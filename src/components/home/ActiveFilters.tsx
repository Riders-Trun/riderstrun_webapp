import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { FilterOptions } from "@/types";

interface ActiveFiltersProps {
  filters: FilterOptions;
  onRemoveFilter: (filterType: string, value?: string) => void;
  onClearAll: () => void;
}

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) => {
  const getActiveFilters = () => {
    const active = [];
    
    if (filters.sortBy !== "nearest") {
      active.push({
        type: "sort",
        label: `Sort: ${filters.sortBy.charAt(0).toUpperCase() + filters.sortBy.slice(1)}`,
        value: filters.sortBy
      });
    }
    
    if (filters.bikeCC !== "any") {
      active.push({
        type: "bikeCC",
        label: `CC: ${filters.bikeCC}`,
        value: filters.bikeCC
      });
    }    
    if (filters.duration !== "any") {
      const durationLabels = {
        "half-day": "Half Day",
        "1-day": "1 Day", 
        "2-day": "2 Days",
        "3-day": "3+ Days"
      };
      active.push({
        type: "duration",
        label: durationLabels[filters.duration as keyof typeof durationLabels] || filters.duration,
        value: filters.duration
      });
    }
    
    if (filters.range[0] > 0 || filters.range[1] < 100) {
      active.push({
        type: "range",
        label: `${filters.range[0]}-${filters.range[1]}km`,
        value: "range"
      });
    }
    
    if (filters.groupSize[0] > 1 || filters.groupSize[1] < 20) {
      active.push({
        type: "groupSize",
        label: `${filters.groupSize[0]}-${filters.groupSize[1]} people`,
        value: "groupSize"
      });
    }
    
    filters.rideType.forEach(type => {
      active.push({
        type: "rideType",
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type
      });
    });
    
    return active;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) return null;
  return (
    <div className="px-3 pb-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-gray-600">Active filters:</span>
        {activeFilters.map((filter, index) => (
          <Badge
            key={`${filter.type}-${filter.value}-${index}`}
            variant="secondary"
            className="bg-orange-100 text-orange-700 border-orange-200 text-xs flex items-center gap-1"
          >
            {filter.label}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={() => onRemoveFilter(filter.type, filter.value)}
            >
              <X className="w-3 h-3 hover:text-red-500" />
            </Button>
          </Badge>
        ))}
        {activeFilters.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs text-gray-500 hover:text-orange-600 h-auto py-1 px-2"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;