import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Smile, 
  Paperclip, 
  Camera, 
  MapPin, 
  Phone, 
  Video,
  MoreVertical,
  ArrowLeft,
  Star,
  Zap
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  content: string;
  sender: "me" | "other";
  timestamp: string;
  type: "text" | "image" | "location" | "ride_invite";
  metadata?: Record<string, unknown>;
}

interface QuickChatModalProps {
  riderId: number;
  isOpen: boolean;
  onClose: () => void;
  onViewProfile?: (riderId: number) => void;
}

const QuickChatModal = ({
  riderId,
  isOpen,
  onClose,
  onViewProfile
}: QuickChatModalProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hey! Saw your post about the Nandi Hills ride. Looks amazing! 🏍️",
      sender: "me",
      timestamp: "10:30 AM",
      type: "text"
    },
    {
      id: 2,
      content: "Thanks! It was an incredible sunrise. Are you interested in joining the next one?",
      sender: "other",
      timestamp: "10:32 AM", 
      type: "text"
    },
    {
      id: 3,
      content: "Absolutely! When are you planning the next ride?",
      sender: "me",
      timestamp: "10:33 AM",
      type: "text"
    },
    {
      id: 4,
      content: "How about this Sunday? Starting early around 4:30 AM for the sunrise.",
      sender: "other",
      timestamp: "10:35 AM",
      type: "text"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock rider data
  const rider = {
    id: riderId,
    name: "Arjun Patel",
    avatar: "/api/placeholder/40/40",
    isOnline: true,
    lastSeen: "Active now",
    bike: "Royal Enfield Classic 350",
    points: 1250,
    streak: 15
  };

  // Quick reply suggestions
  const quickReplies = [
    "Sounds great! 👍",
    "What time?",
    "Share route?",
    "Count me in!",
    "Maybe next time",
    "Coffee stop?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: message,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "text"
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    // Simulate response after a delay
    setTimeout(() => {
      const responses = [
        "Perfect! I'll send you the route details.",
        "Great! Looking forward to riding with you.",
        "Awesome! I'll add you to the group.",
        "Cool! Let's meet at the usual spot."
      ];
      
      const responseMessage: Message = {
        id: messages.length + 2,
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "other",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text"
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  const handleQuickReply = (reply: string) => {
    setMessage(reply);
  };

  const handleSendRideInvite = () => {
    const inviteMessage: Message = {
      id: messages.length + 1,
      content: "Invited you to: Sunrise Nandi Hills Ride",
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "ride_invite",
      metadata: {
        rideName: "Sunrise Nandi Hills Ride",
        date: "This Sunday",
        time: "4:30 AM",
        distance: "65 km"
      }
    };

    setMessages(prev => [...prev, inviteMessage]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-0 w-8 h-8 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div 
            className="flex items-center gap-3 flex-1 cursor-pointer"
            onClick={() => onViewProfile?.(riderId)}
          >
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={rider.avatar} />
                <AvatarFallback className="bg-orange-100 text-orange-600">
                  {rider.name[0]}
                </AvatarFallback>
              </Avatar>
              {rider.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{rider.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{rider.lastSeen}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  {rider.points}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.sender === "me" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2",
                msg.sender === "me"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-900"
              )}
            >
              {msg.type === "ride_invite" ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Ride Invitation</span>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3 space-y-1">
                    <div className="font-medium">{msg.metadata.rideName}</div>
                    <div className="text-sm opacity-90">{msg.metadata.date} • {msg.metadata.time}</div>
                    <div className="text-sm opacity-90">{msg.metadata.distance}</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
              <div
                className={cn(
                  "text-xs mt-1",
                  msg.sender === "me" ? "text-orange-100" : "text-gray-500"
                )}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {quickReplies.map((reply, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickReply(reply)}
              className="flex-shrink-0 text-xs border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              {reply}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 rounded-full text-gray-500"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 rounded-full text-gray-500"
            >
              <Camera className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSendRideInvite}
              className="w-8 h-8 p-0 rounded-full text-gray-500"
            >
              <MapPin className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pr-10 rounded-full border-gray-300 focus:border-orange-500"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 rounded-full text-gray-500"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="w-10 h-10 p-0 rounded-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickChatModal;