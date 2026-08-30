import { useState, useRef } from "react";
import { X, Camera, Image, Type, Palette, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { StoryContent } from "@/types";

interface StoryCreatorProps {
  onClose: () => void;
  /** Optional: there is no stories endpoint yet, so a caller may have nowhere to publish to. */
  onPublish?: (story: StoryContent) => void;
}

const StoryCreator = ({ onClose, onPublish }: StoryCreatorProps) => {
  const [storyType, setStoryType] = useState<"image" | "text">("image");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [textContent, setTextContent] = useState("");
  const [caption, setCaption] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#ffffff");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const backgroundColors = [
    "#000000", "#ffffff", "#ff6b6b", "#4ecdc4", "#45b7d1", 
    "#96ceb4", "#ffeaa7", "#fab1a0", "#fd79a8", "#6c5ce7"
  ];

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('File too large. Maximum 5MB allowed.');
      event.target.value = '';
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setStoryType("image");
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = () => {
    const story: StoryContent = {
      type: storyType,
      content: storyType === "image" ? selectedImage || "" : textContent,
      caption: caption.trim() || undefined,
      backgroundColor: storyType === "text" ? backgroundColor : undefined,
      textColor: storyType === "text" ? textColor : undefined
    };

    if ((storyType === "image" && selectedImage) || (storyType === "text" && textContent.trim())) {
      onPublish?.(story);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md h-full bg-black">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStoryType("image")}
              className={cn(
                "text-white hover:bg-white/20",
                storyType === "image" && "bg-white/20"
              )}
            >
              <Image className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStoryType("text")}
              className={cn(
                "text-white hover:bg-white/20",
                storyType === "text" && "bg-white/20"
              )}
            >
              <Type className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePublish}
            disabled={!((storyType === "image" && selectedImage) || (storyType === "text" && textContent.trim()))}
            className="text-white hover:bg-white/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Content Area */}
        <div className="w-full h-full flex items-center justify-center p-4 pt-16 pb-32">
          {storyType === "image" ? (
            <div className="w-full h-full flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Selected"
                  loading="lazy"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-white text-lg font-medium mb-2">Add a photo</p>
                  <p className="text-white/70 text-sm mb-6">Share your ride moment</p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-black hover:bg-white/90"
                  >
                    Choose Photo
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center p-8 rounded-lg"
              style={{ backgroundColor }}
            >
              <Textarea
                placeholder="Share your thoughts..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="w-full h-32 bg-transparent border-none text-center text-2xl font-medium resize-none focus:ring-0 placeholder:text-current/50"
                style={{ color: textColor }}
              />
            </div>
          )}
        </div>

        {/* Text Story Controls */}
        {storyType === "text" && (
          <div className="absolute bottom-24 left-4 right-4 z-20">
            <div className="bg-black/50 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Background</span>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {backgroundColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBackgroundColor(color)}
                    className={cn(
                      "w-8 h-8 rounded-full flex-shrink-0 ring-2",
                      backgroundColor === color ? "ring-white" : "ring-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Text Color</span>
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => setTextColor("#ffffff")}
                    className={cn(
                      "w-6 h-6 bg-white rounded-full ring-2",
                      textColor === "#ffffff" ? "ring-orange-500" : "ring-transparent"
                    )}
                  />
                  <button
                    onClick={() => setTextColor("#000000")}
                    className={cn(
                      "w-6 h-6 bg-black rounded-full ring-2",
                      textColor === "#000000" ? "ring-orange-500" : "ring-transparent"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Caption Input */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <Input
            placeholder="Add a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
          />
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default StoryCreator;