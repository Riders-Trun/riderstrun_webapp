import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  MessageSquare,
  Camera,
  MapPin,
  MoreHorizontal,
  Bookmark,
  Send,
  Smile,
} from "lucide-react";
import type { RidePhoto } from "@/data/rideDiscovery";

interface PhotosTabProps {
  photos: RidePhoto[];
}

const PhotosTab = ({ photos }: PhotosTabProps) => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Camera className="w-5 h-5 text-purple-500" />
          Photo Memories ({photos.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {photos.map((photo) => (
          <div key={photo.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
                    {photo.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-sm">{photo.rider}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {photo.location}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="p-1">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden">
              <Camera className="w-12 h-12 text-gray-400" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-2 ${photo.isLiked ? "text-red-500" : "text-gray-600"}`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${photo.isLiked ? "fill-red-500" : ""}`} />
                  {photo.likes}
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {photo.comments}
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-semibold">{photo.rider}</span>{" "}
                <span className="text-gray-700">{photo.caption}</span>
              </p>
              <p className="text-xs text-gray-500">{photo.time}</p>
            </div>

            {(photo.comments ?? 0) > 0 && (
              <Button variant="ghost" size="sm" className="h-6 px-0 text-gray-500 text-xs">
                View all {photo.comments} comments
              </Button>
            )}

            <div className="flex items-center gap-2 pt-2 border-t">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">You</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex items-center bg-gray-50 rounded-full px-3 py-1">
                <input
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <Smile className="w-3 h-3 text-gray-400 ml-2" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default PhotosTab;
