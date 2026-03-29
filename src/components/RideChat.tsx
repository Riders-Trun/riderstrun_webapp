
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  type: 'message' | 'announcement';
  isOrganizer: boolean;
}

interface RideChatProps {
  rideId: string;
  isOrganizer?: boolean;
  currentUser: string;
}

const RideChat = ({ rideId, isOrganizer = false, currentUser }: RideChatProps) => {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      author: "Rajesh Kumar",
      message: "Weather looks perfect for tomorrow! See you all at 6 AM sharp.",
      timestamp: "2 hours ago",
      type: "announcement",
      isOrganizer: true
    },
    {
      id: "2", 
      author: "Priya Singh",
      message: "Excited for the ride! Should we bring extra water?",
      timestamp: "1 hour ago",
      type: "message",
      isOrganizer: false
    },
    {
      id: "3",
      author: "Amit Patel", 
      message: "Yes, good idea. I'll bring some snacks too.",
      timestamp: "45 minutes ago",
      type: "message",
      isOrganizer: false
    }
  ]);

  const handleSendMessage = (type: 'message' | 'announcement' = 'message') => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      author: currentUser,
      message: newMessage,
      timestamp: "Just now",
      type,
      isOrganizer: isOrganizer
    };

    setMessages([...messages, message]);
    setNewMessage("");
    
    toast({
      title: type === 'announcement' ? "Announcement sent!" : "Message sent!",
      description: "Your message has been posted to the ride chat."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Ride Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages */}
        <div className="max-h-64 overflow-y-auto space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-3 rounded-lg ${
              msg.type === 'announcement' ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{msg.author}</span>
                {msg.isOrganizer && (
                  <Badge variant="secondary" className="text-xs">Organizer</Badge>
                )}
                {msg.type === 'announcement' && (
                  <Badge className="bg-orange-500 text-white text-xs">
                    <Megaphone className="w-3 h-3 mr-1" />
                    Announcement
                  </Badge>
                )}
                <span className="text-xs text-gray-500 ml-auto">{msg.timestamp}</span>
              </div>
              <p className="text-sm text-gray-700">{msg.message}</p>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button size="sm" onClick={() => handleSendMessage()} aria-label="Send message">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {isOrganizer && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleSendMessage('announcement')}
              disabled={!newMessage.trim()}
            >
              <Megaphone className="w-4 h-4 mr-2" />
              Send as Announcement
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RideChat;
