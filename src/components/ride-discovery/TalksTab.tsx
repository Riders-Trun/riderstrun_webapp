import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  MessageSquare,
  Camera,
  MoreHorizontal,
  Bookmark,
  Send,
  Smile,
} from "lucide-react";
import type { RiderTalk } from "@/data/rideDiscovery";

interface TalksTabProps {
  riderTalks: RiderTalk[];
}

const TalksTab = ({ riderTalks }: TalksTabProps) => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-500" />
          Rider Stories & Experiences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {riderTalks.map((talk) => (
          <div key={talk.id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-orange-100 text-orange-700 text-sm font-bold">
                    {talk.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-sm">{talk.rider}</h4>
                  <p className="text-xs text-gray-500">{talk.time}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="p-1">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-700 leading-relaxed">{talk.message}</p>
            </div>

            {talk.photos > 0 && (
              <div className="mb-3">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Camera className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">
                      {talk.photos} photo{talk.photos > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-2 ${talk.isLiked ? "text-red-500" : "text-gray-600"}`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${talk.isLiked ? "fill-red-500" : ""}`} />
                  {talk.likes}
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {talk.comments?.length || 0}
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>

            {talk.comments && talk.comments.length > 0 && (
              <div className="space-y-2">
                {talk.comments.map((comment, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                    <span className="text-sm text-gray-700">{comment.message}</span>
                  </div>
                ))}
                {talk.comments.length > 2 && (
                  <Button variant="ghost" size="sm" className="h-6 px-0 text-gray-500 text-xs">
                    View all comments
                  </Button>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">You</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex items-center bg-gray-50 rounded-full px-3 py-2">
                <input
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <Smile className="w-4 h-4 text-gray-400 ml-2" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default TalksTab;
