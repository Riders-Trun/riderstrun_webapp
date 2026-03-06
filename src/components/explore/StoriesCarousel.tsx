import { useState } from "react";
import { 
  Search,
  Plus,
  Camera,
  Maximize2,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Story {
  id: number;
  user: {
    name: string;
    avatar: string;
    isViewed?: boolean;
  };
  preview: string;
  hasNew?: boolean;
  isLive?: boolean;
  timestamp?: string;
}

interface StoriesCarouselProps {
  stories: Story[];
  onStoryClick?: (storyId: number) => void;
  onAddStory?: () => void;
  onViewAll?: () => void;
}

const StoriesCarousel = ({ 
  stories, 
  onStoryClick, 
  onAddStory,
  onViewAll 
}: StoriesCarouselProps) => {
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  const handleStoryClick = (storyId: number) => {
    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    onStoryClick?.(storyId);
  };

  const StoryItem = ({ story, isCompact = false }: { story: Story; isCompact?: boolean }) => {
    const ringColor = story.user.isViewed ? "ring-gray-300" : "ring-gradient-to-r from-orange-400 to-pink-500";
    const ringWidth = story.user.isViewed ? "ring-2" : "ring-[3px]";

    return (
      <div 
        className={cn(
          "relative flex-shrink-0 cursor-pointer group",
          isCompact ? "w-14" : "w-16"
        )}
        onClick={() => handleStoryClick(story.id)}
      >
        {/* Story Ring */}
        <div className={cn(
          "relative rounded-full p-0.5 bg-gradient-to-r from-orange-400 to-pink-500",
          story.user.isViewed && "bg-gray-300"
        )}>
          <div className="bg-white rounded-full p-0.5">
            <Avatar className={cn(isCompact ? "w-12 h-12" : "w-14 h-14")}>
              <AvatarImage src={story.preview} className="object-cover" />
              <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                {story.user.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Live Indicator */}
        {story.isLive && (
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
            <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium animate-pulse">
              LIVE
            </div>
          </div>
        )}

        {/* New Story Indicator */}
        {story.hasNew && !story.user.isViewed && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white">
            <div className="w-full h-full bg-orange-500 rounded-full animate-ping"></div>
          </div>
        )}

        {/* Username */}
        <p className={cn(
          "text-center mt-1 font-medium truncate",
          isCompact ? "text-xs" : "text-sm"
        )}>
          {story.user.name}
        </p>

        {/* Timestamp for recent stories */}
        {story.timestamp && (
          <p className="text-center text-xs text-gray-500 mt-0.5">
            {story.timestamp}
          </p>
        )}

        {/* Hover Effect */}
        <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
    );
  };

  const AddStoryButton = ({ isCompact = false }: { isCompact?: boolean }) => (
    <div 
      className={cn(
        "relative flex-shrink-0 cursor-pointer group",
        isCompact ? "w-14" : "w-16"
      )}
      onClick={() => {
        if (navigator.vibrate) navigator.vibrate(50);
        onAddStory?.();
      }}
    >
      <div className="relative rounded-full border-2 border-dashed border-orange-300 hover:border-orange-500 transition-colors">
        <Avatar className={cn(isCompact ? "w-12 h-12" : "w-14 h-14")}>
          <div className="w-full h-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
            <Plus className="w-6 h-6 text-orange-500" />
          </div>
        </Avatar>
      </div>
      <p className={cn(
        "text-center mt-1 font-medium text-orange-600",
        isCompact ? "text-xs" : "text-sm"
      )}>
        Add Story
      </p>
    </div>
  );

  if (isViewAllOpen) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsViewAllOpen(false)}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-white font-semibold">All Stories</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsViewAllOpen(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Stories Grid */}
        <div className="p-4 grid grid-cols-3 gap-4 overflow-y-auto">
          <AddStoryButton isCompact />
          {stories.map((story) => (
            <StoryItem key={story.id} story={story} isCompact />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Camera className="w-5 h-5 text-orange-500" />
          Stories
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsViewAllOpen(true)}
            className="text-orange-500 hover:bg-orange-50"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddStory}
            className="text-orange-500 hover:bg-orange-50"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stories Carousel */}
      <div className="px-4 pb-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          <AddStoryButton />
          {stories.map((story) => (
            <StoryItem key={story.id} story={story} />
          ))}
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0 border-orange-200 text-orange-600 hover:bg-orange-50 h-8 text-xs px-3"
            onClick={() => {/* TODO: Open camera */}}
          >
            <Camera className="w-3.5 h-3.5 mr-1" />
            Camera
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0 border-blue-200 text-blue-600 hover:bg-blue-50 h-8 text-xs px-3"
            onClick={() => {/* TODO: Quick message */}}
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1" />
            Quick Message
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0 border-green-200 text-green-600 hover:bg-green-50 h-8 text-xs px-3"
            onClick={() => {/* TODO: Share location */}}
          >
            <Share2 className="w-3.5 h-3.5 mr-1" />
            Share Location
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoriesCarousel;