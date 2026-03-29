import { Calendar, Users, Trophy, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { CommunityChallenge } from "@/types/explore";

interface CommunityChallengeCardProps {
  challenge: CommunityChallenge;
  onJoin?: (challengeId: number) => void;
  isJoined?: boolean;
}

const CommunityChallengeCard = ({ 
  challenge, 
  onJoin, 
  isJoined = false 
}: CommunityChallengeCardProps) => {
  const progressPercentage = (challenge.currentProgress / challenge.totalTarget) * 100;
  const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="relative">
        <img
          src={challenge.image}
          alt={challenge.title}
          loading="lazy"
          className="w-full h-32 object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge 
            variant={challenge.difficulty === "Easy" ? "secondary" : challenge.difficulty === "Medium" ? "default" : "destructive"}
            className="text-xs"
          >
            {challenge.difficulty}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{challenge.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{challenge.description}</p>
        
        {challenge.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin className="w-3 h-3" />
            {challenge.location}
          </div>
        )}
        
        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{challenge.currentProgress}/{challenge.totalTarget}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {challenge.participants}
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              {challenge.reward}
            </div>
          </div>
          <Button 
            size="sm" 
            variant={isJoined ? "outline" : "default"}
            className={isJoined ? "border-orange-200 text-orange-600" : "bg-orange-500 hover:bg-orange-600"}
            onClick={() => onJoin?.(challenge.id)}
            disabled={daysLeft <= 0}
          >
            {isJoined ? "Joined" : "Join"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityChallengeCard;