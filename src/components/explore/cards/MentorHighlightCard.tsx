import { Crown, Users, Shield, Route, Award, MessageCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Mentor {
  id: number;
  name: string;
  avatar: string;
  title: string;
  achievements: {
    type: "consistent" | "safety" | "pillion" | "routes";
    label: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  stats: {
    ridesOrganized: number;
    safetyStreak: number;
    followersCount: number;
    rating: number;
  };
  specialties: string[];
  isFollowing?: boolean;
}

interface MentorHighlightCardProps {
  mentor: Mentor;
  onFollow?: (mentorId: number) => void;
  onInviteCollaborate?: (mentorId: number) => void;
  onAskGuidance?: (mentorId: number) => void;
  onViewProfile?: (mentorId: number) => void;
}

const MentorHighlightCard = ({ 
  mentor, 
  onFollow, 
  onInviteCollaborate, 
  onAskGuidance, 
  onViewProfile 
}: MentorHighlightCardProps) => {
  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "consistent":
        return Crown;
      case "safety":
        return Shield;
      case "pillion":
        return Users;
      case "routes":
        return Route;
      default:
        return Award;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case "consistent":
        return "text-yellow-600 bg-yellow-50";
      case "safety":
        return "text-green-600 bg-green-50";
      case "pillion":
        return "text-blue-600 bg-blue-50";
      case "routes":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <Avatar className="w-16 h-16 ring-2 ring-yellow-200">
            <AvatarImage src={mentor.avatar} />
            <AvatarFallback className="bg-yellow-100 text-yellow-600 font-semibold text-lg">
              {mentor.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
            <Crown className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg">{mentor.name}</h3>
          <p className="text-orange-600 font-medium text-sm mb-2">{mentor.title}</p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
            <div>
              <span className="font-medium text-gray-900">{mentor.stats.ridesOrganized}</span> rides organized
            </div>
            <div>
              <span className="font-medium text-gray-900">{mentor.stats.safetyStreak}</span> day safety streak
            </div>
            <div>
              <span className="font-medium text-gray-900">{mentor.stats.followersCount}</span> followers
            </div>
            <div>
              <span className="font-medium text-gray-900">{mentor.stats.rating}★</span> rating
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {mentor.achievements.map((achievement, index) => {
          const IconComponent = getAchievementIcon(achievement.type);
          const colorClass = getAchievementColor(achievement.type);
          
          return (
            <div 
              key={index}
              className={`p-3 rounded-lg border ${colorClass.split(' ')[1]} ${colorClass.split(' ')[0]} border-current border-opacity-20`}
            >
              <div className="flex items-center gap-2 mb-1">
                <IconComponent className="w-4 h-4" />
                <span className="font-medium text-xs">{achievement.label}</span>
              </div>
              <div className="text-lg font-bold">{achievement.value}</div>
            </div>
          );
        })}
      </div>

      {/* Specialties */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {mentor.specialties.map((specialty, index) => (
            <Badge key={index} variant="outline" className="text-xs border-orange-200 text-orange-600">
              {specialty}
            </Badge>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={mentor.isFollowing ? "outline" : "default"}
            onClick={() => onFollow?.(mentor.id)}
            className={mentor.isFollowing 
              ? "flex-1 border-orange-200 text-orange-600" 
              : "flex-1 bg-orange-500 hover:bg-orange-600"
            }
          >
            {mentor.isFollowing ? "Following" : "Follow"}
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onInviteCollaborate?.(mentor.id)}
            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Collaborate
          </Button>
        </div>
        
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onAskGuidance?.(mentor.id)}
          className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Ask for Guidance
        </Button>
      </div>
    </div>
  );
};

export default MentorHighlightCard;