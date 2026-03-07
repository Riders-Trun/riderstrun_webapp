import { Search, Filter, Grid3x3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExploreSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onFilterClick?: () => void;
}

const ExploreSearchBar = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onFilterClick
}: ExploreSearchBarProps) => {
  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-100">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900">Explore</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange(viewMode === "grid" ? "list" : "grid")}
              className="hover:bg-orange-50"
            >
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onFilterClick}
              className="hover:bg-orange-50"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search rides, routes, or riders..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-50 border-0 focus:bg-white transition-colors focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ExploreSearchBar;