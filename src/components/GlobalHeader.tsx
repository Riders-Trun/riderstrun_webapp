import { ArrowLeft, Search, Bell, Filter, MapPin, ChevronDown, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { POPULAR_LOCATIONS } from "@/constants";

interface GlobalHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showLocation?: boolean;
  showFilter?: boolean;
  showNotifications?: boolean;
  showMenu?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchLocation?: string;
  onLocationChange?: (location: string) => void;
  onFilterClick?: () => void;
  filterCount?: number;
  notificationCount?: number;
  customBackAction?: () => void;
  subtitle?: string;
}
const GlobalHeader = ({
  title = "RidersTurn",
  showBack = false,
  showSearch = false,
  showLocation = false,
  showFilter = false,
  showNotifications = false,
  showMenu = true,
  searchValue = "",
  onSearchChange,
  searchLocation = "Bangalore",
  onLocationChange,
  onFilterClick,
  filterCount = 0,
  notificationCount = 0,
  customBackAction,
  subtitle = "Your Ride Partner"
}: GlobalHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [customLocationInput, setCustomLocationInput] = useState("");

  const popularLocations = POPULAR_LOCATIONS;

  const handleBack = () => {
    if (customBackAction) {
      customBackAction();
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }
  };

  const handleLocationSelect = (value: string) => {
    if (value === "custom") {
      setIsCustomLocation(true);
      setCustomLocationInput("");
    } else {
      setIsCustomLocation(false);
      onLocationChange?.(value);
    }
  };

  const handleCustomLocationSubmit = () => {
    if (customLocationInput.trim()) {
      onLocationChange?.(customLocationInput.trim());
      setIsCustomLocation(false);
      setCustomLocationInput("");
    }
  };
  const handleCustomLocationKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomLocationSubmit();
    }
    if (e.key === 'Escape') {
      setIsCustomLocation(false);
      setCustomLocationInput("");
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg sticky top-0 z-50">
      {/* Main Header Row */}
      <div className="flex items-center justify-between p-3">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1">
          {showBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-white hover:bg-white/20 transition-colors p-2 rounded-lg border border-white/20 hover:border-white/40"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : showMenu ? (
            <SidebarTrigger className="text-white hover:bg-white/20 transition-colors p-2 rounded-lg border border-white/20 hover:border-white/40">
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
          ) : null}
          
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-orange-100 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Location Selector */}
          {showLocation && (
            <div className="flex items-center gap-1 text-white">
              <MapPin className="w-4 h-4 text-orange-200 flex-shrink-0" />
              {isCustomLocation ? (
                <Input
                  value={customLocationInput}
                  onChange={(e) => setCustomLocationInput(e.target.value)}
                  onKeyDown={handleCustomLocationKeyPress}
                  onBlur={handleCustomLocationSubmit}
                  placeholder="Enter location..."
                  className="h-7 text-xs px-2 w-28 border-orange-200 bg-white/90 text-gray-800"
                  autoFocus
                />
              ) : (
                <Select value={searchLocation} onValueChange={handleLocationSelect}>
                  <SelectTrigger className="h-7 text-xs px-2 border-none shadow-none bg-transparent hover:bg-white/20 transition-colors text-orange-100 hover:text-white w-auto min-w-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>Custom location...</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Notifications */}
          {showNotifications && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/notifications')}
              className="relative text-white hover:bg-white/20 p-2 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>
      {/* Search and Filter Row */}
      {(showSearch || showFilter) && (
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2">
            {/* Search Input */}
            {showSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search rides, locations, or organizers..."
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-10 h-9 border-none bg-white/95 backdrop-blur-sm shadow-lg rounded-xl focus:ring-2 focus:ring-white/50 focus:bg-white transition-all text-sm pr-4"
                />
              </div>
            )}
            
            {/* Filter Button */}
            {showFilter && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onFilterClick}
                className="relative bg-white/95 hover:bg-orange-50 border-orange-200 px-3 h-9 rounded-xl shadow-lg flex-shrink-0"
              >
                <Filter className="w-4 h-4 text-orange-600" />
                {filterCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 bg-orange-500 text-white text-xs flex items-center justify-center rounded-full">
                    {filterCount}
                  </Badge>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalHeader;