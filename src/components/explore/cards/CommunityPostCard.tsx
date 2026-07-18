import { useState } from "react";
import {
  Heart,
  MessageCircle, 
  Share2, 
  Bookmark,
  MoreHorizontal,
  MapPin,
  Users,
  Clock,
  Zap,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDifficultyColor } from "@/lib/rideUtils";
import type { CommunityPost } from "@/types/explore";

interface CommunityPostCardProps {
  post: CommunityPost;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  onBookmark?: (postId: number) => void;
  onViewProfile?: (userId: number) => void;
  variant?: "feed" | "compact";
}

const CommunityPostCard = ({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onViewProfile,
  variant = "feed"
}: CommunityPostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const handleLike = () => {
    // Add haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    onLike?.(post.id);
  };

  const handleDoubleClick = () => {
    // Double tap to like (Instagram-style)
    if (!post.isLiked) {
      handleLike();
    }
  };

  if (variant === "compact") {
    return (
      <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm truncate">{post.user.name}</span>
              {post.user.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <span className="text-xs text-gray-500">{post.timeAgo}</span>
            </div>
            
            <p className="text-sm text-gray-800 line-clamp-2 mb-2">{post.content}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Heart className={cn("w-3 h-3", post.isLiked && "fill-red-500 text-red-500")} />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>{post.comments}</span>
              </div>
            </div>
          </div>
          
          {post.image && (
            <img
              src={post.image}
              alt=""
              loading="lazy"
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar 
            className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-orange-200 transition-all"
            onClick={() => onViewProfile?.(post.id)}
          >
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback className="bg-orange-100 text-orange-600">
              {post.user.name[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
              {post.user.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              {post.user.badge && (
                <Badge variant="secondary" className="text-xs">
                  {post.user.badge}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{post.timeAgo}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-32">{post.location}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4">
        <p className={cn(
          "text-gray-800 leading-relaxed",
          !isExpanded && post.content.length > 150 && "line-clamp-3"
        )}>
          {post.content}
        </p>
        
        {post.content.length > 150 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-orange-500 hover:text-orange-600 p-0 h-auto mt-1"
          >
            {isExpanded ? "Show less" : "Show more"}
          </Button>
        )}
      </div>

      {/* Ride Details */}
      {post.rideDetails && (
        <div className="mx-4 mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="text-gray-600">{post.rideDetails.distance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">{post.rideDetails.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">{post.rideDetails.participants} riders</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <Badge variant="outline" className={cn("text-xs", getDifficultyColor(post.rideDetails.difficulty))}>
                {post.rideDetails.difficulty}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 mt-3">
          <div className="flex flex-wrap gap-1">
            {(showAllTags ? post.tags : post.tags.slice(0, 3)).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllTags(!showAllTags)}
                className="text-orange-500 hover:text-orange-600 p-0 h-auto text-xs"
              >
                {showAllTags ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    +{post.tags.length - 3} more
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Image */}
      {post.image && (
        <div 
          className="mt-3 relative group cursor-pointer"
          onDoubleClick={handleDoubleClick}
        >
          <img
            src={post.image}
            alt="Post content"
            loading="lazy"
            className={cn(
              "w-full h-64 object-cover transition-all duration-300",
              !imageLoaded && "bg-gray-200 animate-pulse"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Double-tap heart animation */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-active:opacity-100 transition-opacity pointer-events-none">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-ping">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 hover:bg-red-50 active:scale-95 transition-all",
                post.isLiked && "text-red-500"
              )}
            >
              <Heart className={cn("w-5 h-5", post.isLiked && "fill-current")} />
              <span className="text-sm font-medium">{post.likes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(post.id)}
              className="flex items-center gap-2 hover:bg-blue-50 active:scale-95 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(post.id)}
              className="flex items-center gap-2 hover:bg-green-50 active:scale-95 transition-all"
            >
              <Share2 className="w-5 h-5" />
              {post.shares && <span className="text-sm font-medium">{post.shares}</span>}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark?.(post.id)}
            className={cn(
              "hover:bg-gray-50 active:scale-95 transition-all",
              post.isBookmarked && "text-orange-500"
            )}
          >
            <Bookmark className={cn("w-5 h-5", post.isBookmarked && "fill-current")} />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" className="flex-1 text-xs border-orange-200 text-orange-600 hover:bg-orange-50">
            View Route
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs border-blue-200 text-blue-600 hover:bg-blue-50">
            Join Similar
          </Button>
          <Button size="sm" variant="outline" className="text-xs border-gray-200 text-gray-600 hover:bg-gray-50 px-3">
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostCard;