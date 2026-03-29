import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { RideEvent } from "@/types/explore";

interface EventCardProps {
  event: RideEvent;
  onJoin?: (eventId: number) => void;
  isJoined?: boolean;
}

const EventCard = ({ event, onJoin, isJoined = false }: EventCardProps) => {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const isFull = event.maxAttendees ? event.attendees >= event.maxAttendees : false;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge 
            variant={event.type === "Workshop" ? "default" : "secondary"}
            className="text-xs"
          >
            {event.type}
          </Badge>
        </div>
        {event.price !== undefined && (
          <div className="absolute top-3 right-3">
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {event.price === 0 ? "Free" : `$${event.price}`}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
        
        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(eventDate)}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>
              {event.attendees} attending
              {event.maxAttendees && ` • ${event.maxAttendees - event.attendees} spots left`}
            </span>
          </div>
        </div>
        
        {/* Organizer */}
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="w-6 h-6">
            <AvatarImage src={event.organizer.avatar} />
            <AvatarFallback className="text-xs">{event.organizer.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">by {event.organizer.name}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {!isUpcoming && "Event has ended"}
            {isUpcoming && isFull && "Event is full"}
          </div>
          <Button 
            size="sm" 
            variant={isJoined ? "outline" : "default"}
            className={isJoined ? "border-orange-200 text-orange-600" : "bg-orange-500 hover:bg-orange-600"}
            onClick={() => onJoin?.(event.id)}
            disabled={!isUpcoming || isFull}
          >
            {isJoined ? "Joined" : "Join Event"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;