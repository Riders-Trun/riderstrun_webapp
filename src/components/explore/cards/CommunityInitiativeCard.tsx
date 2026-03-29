import { Heart, Users, Calendar, MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { CommunityInitiative } from "@/types/explore";

interface CommunityInitiativeCardProps {
  initiative: CommunityInitiative;
  onRegister?: (initiativeId: number) => void;
  onShowInterest?: (initiativeId: number) => void;
  onViewDetails?: (initiativeId: number) => void;
}

const CommunityInitiativeCard = ({ 
  initiative, 
  onRegister, 
  onShowInterest, 
  onViewDetails 
}: CommunityInitiativeCardProps) => {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case "blood-donation":
        return { 
          label: "Blood Donation", 
          color: "bg-red-500", 
          bgColor: "bg-red-50", 
          textColor: "text-red-600",
          icon: Heart 
        };
      case "safety-workshop":
        return { 
          label: "Safety Workshop", 
          color: "bg-blue-500", 
          bgColor: "bg-blue-50", 
          textColor: "text-blue-600",
          icon: Users 
        };
      case "women-only":
        return { 
          label: "Women Only", 
          color: "bg-pink-500", 
          bgColor: "bg-pink-50", 
          textColor: "text-pink-600",
          icon: Users 
        };
      case "meetup":
        return { 
          label: "Meetup", 
          color: "bg-green-500", 
          bgColor: "bg-green-50", 
          textColor: "text-green-600",
          icon: Users 
        };
      case "charity":
        return { 
          label: "Charity", 
          color: "bg-purple-500", 
          bgColor: "bg-purple-50", 
          textColor: "text-purple-600",
          icon: Heart 
        };
      default:
        return { 
          label: "Community", 
          color: "bg-gray-500", 
          bgColor: "bg-gray-50", 
          textColor: "text-gray-600",
          icon: Users 
        };
    }
  };

  const typeConfig = getTypeConfig(initiative.type);
  const IconComponent = typeConfig.icon;
  const isEventPast = new Date(initiative.date) < new Date();
  const isRegistrationClosed = initiative.registrationDeadline 
    ? new Date(initiative.registrationDeadline) < new Date() 
    : false;
  const isFull = initiative.maxParticipants 
    ? initiative.participantsCount >= initiative.maxParticipants 
    : false;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Image Header */}
      <div className="relative">
        <img
          src={initiative.image}
          alt={initiative.title}
          loading="lazy"
          className="w-full h-32 object-cover"
        />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${typeConfig.color} text-white text-xs border-0`}>
            <IconComponent className="w-3 h-3 mr-1" />
            {typeConfig.label}
          </Badge>
        </div>

        {/* Status Indicators */}
        <div className="absolute top-3 right-3 flex gap-2">
          {initiative.isRegistered && (
            <Badge className="bg-green-500 text-white text-xs">
              Registered
            </Badge>
          )}
          {isFull && (
            <Badge variant="destructive" className="text-xs">
              Full
            </Badge>
          )}
          {isEventPast && (
            <Badge variant="secondary" className="text-xs">
              Completed
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{initiative.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{initiative.description}</p>

        {/* Organizer */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={initiative.organizer.avatar} />
            <AvatarFallback className="text-xs">{initiative.organizer.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-xs text-gray-600">
            <span>{initiative.organizer.name}</span>
            {initiative.organizer.organization && (
              <span className="text-gray-500"> • {initiative.organizer.organization}</span>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-3 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>{initiative.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{initiative.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3" />
            <span>
              {initiative.participantsCount} registered
              {initiative.maxParticipants && ` • ${initiative.maxParticipants - initiative.participantsCount} spots left`}
            </span>
          </div>
        </div>

        {/* Requirements */}
        {initiative.requirements && initiative.requirements.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {initiative.requirements.slice(0, 3).map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                  {req}
                </Badge>
              ))}
              {initiative.requirements.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{initiative.requirements.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Impact Statement */}
        {initiative.impact && (
          <div className={`p-2 rounded-lg border mb-3 text-xs ${typeConfig.bgColor} ${typeConfig.textColor} border-current border-opacity-20`}>
            <span className="font-medium">Impact: </span>
            {initiative.impact}
          </div>
        )}

        {/* Registration Deadline */}
        {initiative.registrationDeadline && !isEventPast && (
          <div className="text-xs text-orange-600 mb-3">
            Registration closes: {initiative.registrationDeadline}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isEventPast && !isRegistrationClosed && !isFull && !initiative.isRegistered && (
            <Button 
              size="sm"
              onClick={() => onRegister?.(initiative.id)}
              className={`flex-1 text-xs ${typeConfig.color} hover:opacity-90`}
            >
              Register
            </Button>
          )}
          
          {!isEventPast && !initiative.isRegistered && (isRegistrationClosed || isFull) && (
            <Button 
              size="sm"
              variant="outline"
              onClick={() => onShowInterest?.(initiative.id)}
              className="flex-1 text-xs border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              Show Interest
            </Button>
          )}

          {initiative.isRegistered && (
            <Button 
              size="sm"
              variant="outline"
              className="flex-1 text-xs border-green-200 text-green-600"
              disabled
            >
              ✓ Registered
            </Button>
          )}

          <Button 
            size="sm"
            variant="outline"
            onClick={() => onViewDetails?.(initiative.id)}
            className="border-gray-200 text-gray-600 hover:bg-gray-50 text-xs px-3"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityInitiativeCard;