
import { Badge } from "@/components/ui/badge";
import { getRideTypeEmoji } from "@/lib/rideUtils";

interface RideFiltersProps {
  rideTypes: string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const RideFilters = ({ rideTypes, selectedFilter, onFilterChange }: RideFiltersProps) => {
  return (
    <div className="px-4 pb-3 bg-white/30">
      <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-1">
        {rideTypes.map((type) => (
          <Badge
            key={type}
            variant={selectedFilter === type ? "default" : "secondary"}
            className={`cursor-pointer whitespace-nowrap transition-all duration-200 hover:scale-105 ${
              selectedFilter === type 
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:from-orange-600 hover:to-orange-700" 
                : "bg-white/80 text-gray-700 hover:bg-orange-50 hover:text-orange-700 border-gray-200"
            }`}
            onClick={() => onFilterChange(type)}
          >
            <span className="mr-1">{getRideTypeEmoji(type)}</span>
            {type}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default RideFilters;
