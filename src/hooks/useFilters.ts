import { useState, useMemo, useCallback } from "react";
import type { FilterOptions } from "@/types";
import { DEFAULT_FILTERS } from "@/constants";

export const useFilters = (initialFilters?: Partial<FilterOptions>) => {
  const [filters, setFilters] = useState<FilterOptions>({
    ...DEFAULT_FILTERS,
    rideType: [],
    ...initialFilters,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.sortBy !== "nearest") count++;
    if (filters.bikeCC !== "any") count++;
    if (filters.duration !== "any") count++;
    if (filters.rideType.length > 0) count++;
    if (filters.range[0] > 0 || filters.range[1] < 100) count++;
    if (filters.groupSize[0] > 1 || filters.groupSize[1] < 20) count++;
    return count;
  }, [filters]);

  const handleRemoveFilter = useCallback((filterType: string, value?: string) => {
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
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS, rideType: [] });
  }, []);

  return {
    filters,
    setFilters,
    isFilterOpen,
    setIsFilterOpen,
    activeFiltersCount,
    handleRemoveFilter,
    clearAllFilters,
  };
};
