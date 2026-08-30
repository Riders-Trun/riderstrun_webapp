import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Story {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  content: {
    type: "image" | "video";
    url: string;
    caption?: string;
  }[];
  timestamp: string;
}

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
  /** Optional: no reply endpoint exists yet, so callers may have nowhere to send one. */
  onReply?: (storyId: number, text: string) => void;
}

const StoryViewer = ({ stories, initialStoryIndex, onClose, onReply }: StoryViewerProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState("");

  const currentStory = stories[currentStoryIndex];
  const currentSlide = currentStory?.content[currentSlideIndex];
  const totalSlides = currentStory?.content.length || 0;

  // Auto-progress timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNextSlide();
          return 0;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds per slide (100 * 50ms)

    return () => clearInterval(timer);
  }, [currentStoryIndex, currentSlideIndex, isPaused]);

  const handleNextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setProgress(0);
    } else {
      handleNextStory();
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setProgress(0);
    } else {
      handlePrevStory();
    }
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentSlideIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setCurrentSlideIndex(0);
      setProgress(0);
    }
  };

  // Replies have nowhere to go: there is no stories endpoint, let alone a reply
  // one. Clearing the box would look like the message was sent, so the reply is
  // handed to the caller if it wants it and otherwise left in place.
  const handleSendReply = () => {
    const text = replyText.trim();
    if (!text) return;
    onReply?.(currentStory.id, text);
    if (onReply) setReplyText("");
  };

  if (!currentStory || !currentSlide) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Story Container */}
      <div className="relative w-full max-w-md h-full bg-black">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
          {currentStory.content.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full bg-white transition-all duration-100",
                  index === currentSlideIndex ? "opacity-100" : index < currentSlideIndex ? "opacity-100" : "opacity-30"
                )}
                style={{
                  width: index === currentSlideIndex ? `${progress}%` : index < currentSlideIndex ? "100%" : "0%"
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 ring-2 ring-white">
              <AvatarImage src={currentStory.user.avatar} />
              <AvatarFallback>{currentStory.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium text-sm">{currentStory.user.name}</p>
              <p className="text-white/70 text-xs">{currentStory.timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Story Content */}
        <div
          className="w-full h-full relative"
          onPointerDown={() => setIsPaused(true)}
          onPointerUp={() => setIsPaused(false)}
        >
          {currentSlide.type === "image" ? (
            <img
              src={currentSlide.url}
              alt="Story"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={currentSlide.url}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
            />
          )}

          {/* Navigation Areas */}
          <div className="absolute inset-0 flex">
            <button
              className="flex-1 bg-transparent"
              onClick={handlePrevSlide}
            />
            <button
              className="flex-1 bg-transparent"
              onClick={handleNextSlide}
            />
          </div>

          {/* Caption */}
          {currentSlide.caption && (
            <div className="absolute bottom-20 left-4 right-4 z-20">
              <p className="text-white text-sm bg-black/50 rounded-lg p-3">
                {currentSlide.caption}
              </p>
            </div>
          )}
        </div>

        {/* Reply Input */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Reply to story..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
              onKeyPress={(e) => e.key === "Enter" && handleSendReply()}
            />
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSendReply}
            className="text-white hover:bg-white/20"
          >
            <Send className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation Arrows (Desktop) */}
        {currentStoryIndex > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevStory}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}
        {currentStoryIndex < stories.length - 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextStory}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StoryViewer;