import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RiderSpotlight } from "@/types/explore";

interface RiderSpotlightCardProps {
  rider: RiderSpotlight;
  onFollow?: (riderId: number) => void;
}

const RiderSpotlightCard = ({ rider, onFollow }: RiderSpotlightCardProps) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
      <div className="flex items-start gap-3">
        <Avatar className="w-12 h-12 ring-2 ring-orange-100">
          <AvatarImage src={rider.avatar} />
          <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
            {rider.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{rider.name}</h3>
            <Badge variant="outline" className="text-xs border-orange-200 text-orange-600">
              {rider.badge}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{rider.bio}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>
              <span className="font-medium text-gray-700">{rider.contributions}</span> contributions
            </span>
            <span>
              <span className="font-medium text-gray-700">{rider.followers > 1000 ? `${(rider.followers/1000).toFixed(1)}k` : rider.followers}</span> followers
            </span>
          </div>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          className="border-orange-200 text-orange-600 hover:bg-orange-50"
          onClick={() => onFollow?.(rider.id)}
        >
          Follow
        </Button>
      </div>
    </div>
  );
};

export default RiderSpotlightCard;