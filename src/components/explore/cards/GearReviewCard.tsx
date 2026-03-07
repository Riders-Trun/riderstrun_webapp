import { Star, ThumbsUp, MessageSquare, Share2, ExternalLink } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GearReview } from "@/types/explore";

interface GearReviewCardProps {
  review: GearReview;
  onLike: (reviewId: number) => void;
  onComment: (reviewId: number) => void;
  onShare: (reviewId: number) => void;
  onViewProduct?: (productLink: string) => void;
}

const GearReviewCard = ({ 
  review, 
  onLike, 
  onComment, 
  onShare,
  onViewProduct 
}: GearReviewCardProps) => {
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case "helmet":
        return { label: "Helmet", color: "text-red-600", bgColor: "bg-red-50" };
      case "jacket":
        return { label: "Jacket", color: "text-blue-600", bgColor: "bg-blue-50" };
      case "gloves":
        return { label: "Gloves", color: "text-green-600", bgColor: "bg-green-50" };
      case "boots":
        return { label: "Boots", color: "text-amber-600", bgColor: "bg-amber-50" };
      case "accessories":
        return { label: "Accessories", color: "text-purple-600", bgColor: "bg-purple-50" };
      case "electronics":
        return { label: "Electronics", color: "text-cyan-600", bgColor: "bg-cyan-50" };
      default:
        return { label: "Gear", color: "text-gray-600", bgColor: "bg-gray-50" };
    }
  };

  const categoryConfig = getCategoryConfig(review.category);
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="flex border-b border-gray-100">
        <div className="w-1/3 p-3">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={review.productImage}
              alt={review.productName}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="w-2/3 p-3">
          <Badge 
            variant="outline" 
            className={`${categoryConfig.color} ${categoryConfig.bgColor} mb-2`}
          >
            {categoryConfig.label}
          </Badge>
          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{review.productName}</h3>
          <div className="flex items-center gap-1 mb-1">
            {renderStars(review.rating)}
            <span className="text-xs text-gray-500 ml-1">{review.rating.toFixed(1)}</span>
          </div>
          <div className="text-xs text-gray-500">{review.price}</div>
          {review.productLink && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs p-0 h-auto mt-1 text-blue-600"
              onClick={() => onViewProduct?.(review.productLink || '')}
            >
              View Product <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {/* Reviewer info */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={review.reviewer.avatar} />
            <AvatarFallback>{review.reviewer.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-xs">
            <span className="font-medium text-gray-900">{review.reviewer.name}</span>
            <span className="text-gray-500"> • {review.reviewer.ridesCompleted} rides</span>
          </div>
          <div className="ml-auto text-xs text-gray-500">{review.timeAgo}</div>
        </div>
        
        {/* Review content */}
        <h4 className="font-medium text-gray-900 mb-2">{review.reviewTitle}</h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{review.reviewContent}</p>
        
        {/* Pros and cons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-xs font-medium text-green-600 mb-1">Pros</div>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-0.5">
              {review.pros.map((pro, index) => (
                <li key={index} className="line-clamp-1">{pro}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-medium text-red-600 mb-1">Cons</div>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-0.5">
              {review.cons.map((con, index) => (
                <li key={index} className="line-clamp-1">{con}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs gap-1 ${review.isLiked ? 'text-orange-500' : 'text-gray-500'}`}
            onClick={() => onLike(review.id)}
          >
            <ThumbsUp className="w-4 h-4" />
            {review.likes}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs gap-1 text-gray-500"
            onClick={() => onComment(review.id)}
          >
            <MessageSquare className="w-4 h-4" />
            {review.comments}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs gap-1 text-gray-500"
            onClick={() => onShare(review.id)}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GearReviewCard;