import { Lightbulb, ThumbsUp, Share2, Bookmark } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RidingTip } from "@/types/explore";

interface RidingTipsCardProps {
  tip: RidingTip;
  onLike: (tipId: number) => void;
  onSave: (tipId: number) => void;
  onShare: (tipId: number) => void;
}

const RidingTipsCard = ({ tip, onLike, onSave, onShare }: RidingTipsCardProps) => {
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case "safety":
        return { color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" };
      case "maintenance":
        return { color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" };
      case "technique":
        return { color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" };
      case "gear":
        return { color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" };
      case "weather":
        return { color: "text-amber-600", bgColor: "bg-amber-50", borderColor: "border-amber-200" };
      default:
        return { color: "text-gray-600", bgColor: "bg-gray-50", borderColor: "border-gray-200" };
    }
  };

  const categoryConfig = getCategoryConfig(tip.category);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-4">
        {/* Author info */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={tip.author.avatar} />
            <AvatarFallback>{tip.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium text-gray-900">{tip.author.name}</div>
            <div className="text-xs text-gray-500">{tip.author.role}</div>
          </div>
          <div className="ml-auto text-xs text-gray-500">{tip.timeAgo}</div>
        </div>

        {/* Category badge */}
        <div className="mb-3">
          <Badge 
            variant="outline" 
            className={`${categoryConfig.color} ${categoryConfig.bgColor} ${categoryConfig.borderColor} capitalize`}
          >
            <Lightbulb className="w-3 h-3 mr-1" />
            {tip.category}
          </Badge>
        </div>

        {/* Content */}
        <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{tip.content}</p>

        {/* Image if available */}
        {tip.image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img src={tip.image} alt={tip.title} loading="lazy" className="w-full h-auto" />
          </div>
        )}

        {/* Video if available */}
        {tip.videoUrl && (
          <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 aspect-video flex items-center justify-center">
            <div className="text-sm text-gray-500">Video content: {tip.videoUrl}</div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs gap-1 ${tip.isLiked ? 'text-orange-500' : 'text-gray-500'}`}
            onClick={() => onLike(tip.id)}
          >
            <ThumbsUp className="w-4 h-4" />
            {tip.likes}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs gap-1 ${tip.isSaved ? 'text-orange-500' : 'text-gray-500'}`}
            onClick={() => onSave(tip.id)}
          >
            <Bookmark className="w-4 h-4" />
            {tip.saves}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs gap-1 text-gray-500"
            onClick={() => onShare(tip.id)}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RidingTipsCard;