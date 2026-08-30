import { useState } from "react";
import { Users, Clock, MapPin, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import type { CrewIntent } from "@/types";

interface CrewFinderProps {
  crewIntents: CrewIntent[];
  onJoinCrew?: (crewId: string) => void;
  onCreateIntent?: (intent: { title: string; description: string; lookingFor: number; rideType: string }) => void;
  /** Disables the join buttons while a request is in flight. */
  isJoining?: boolean;
}

const CrewFinder = ({ crewIntents, onJoinCrew, onCreateIntent, isJoining }: CrewFinderProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newIntent, setNewIntent] = useState({
    title: "",
    description: "",
    lookingFor: 4,
    rideType: "",
    timePreference: "",
    skillLevel: "",
    route: "",
    speed: "",
    date: "",
    requirements: [] as string[]
  });

  const handleCreateIntent = () => {
    onCreateIntent?.(newIntent);
    setShowCreateForm(false);
    setNewIntent({
      title: "",
      description: "",
      lookingFor: 4,
      rideType: "",
      timePreference: "",
      skillLevel: "",
      route: "",
      speed: "",
      date: "",
      requirements: []
    });
  };

  const addRequirement = (requirement: string) => {
    if (requirement && !newIntent.requirements.includes(requirement)) {
      setNewIntent(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirement]
      }));
    }
  };

  const removeRequirement = (requirement: string) => {
    setNewIntent(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req !== requirement)
    }));
  };

  if (showCreateForm) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create Crew Intent</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
            ✕
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ride Title
            </label>
            <Input
              placeholder="e.g., Sunday Breakfast Ride to Nandi Hills"
              value={newIntent.title}
              onChange={(e) => setNewIntent(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              placeholder="Looking for 4 riders for a Sunday breakfast ride. Avg speed 60–80km/h. From JP Nagar to Nandi Hills. No drama, full helmets."
              value={newIntent.description}
              onChange={(e) => setNewIntent(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Looking For
              </label>
              <Select value={newIntent.lookingFor.toString()} onValueChange={(value) => setNewIntent(prev => ({ ...prev, lookingFor: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 riders</SelectItem>
                  <SelectItem value="3">3 riders</SelectItem>
                  <SelectItem value="4">4 riders</SelectItem>
                  <SelectItem value="5">5 riders</SelectItem>
                  <SelectItem value="6">6+ riders</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ride Type
              </label>
              <Select value={newIntent.rideType} onValueChange={(value) => setNewIntent(prev => ({ ...prev, rideType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="long-distance">Long Distance</SelectItem>
                  <SelectItem value="weekend">Weekend Warrior</SelectItem>
                  <SelectItem value="scenic">Scenic</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Preference
              </label>
              <Select value={newIntent.timePreference} onValueChange={(value) => setNewIntent(prev => ({ ...prev, timePreference: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="early-morning">Early Morning</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Level
              </label>
              <Select value={newIntent.skillLevel} onValueChange={(value) => setNewIntent(prev => ({ ...prev, skillLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="veteran">Veteran</SelectItem>
                  <SelectItem value="mixed">Mixed Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Route
              </label>
              <Input
                placeholder="e.g., JP Nagar to Nandi Hills"
                value={newIntent.route}
                onChange={(e) => setNewIntent(prev => ({ ...prev, route: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avg Speed
              </label>
              <Input
                placeholder="e.g., 60-80 km/h"
                value={newIntent.speed}
                onChange={(e) => setNewIntent(prev => ({ ...prev, speed: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time
            </label>
            <Input
              type="datetime-local"
              value={newIntent.date}
              onChange={(e) => setNewIntent(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {newIntent.requirements.map((req, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-red-100"
                  onClick={() => removeRequirement(req)}
                >
                  {req} ✕
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => addRequirement("Full Helmet")}
              >
                + Full Helmet
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => addRequirement("No Drama")}
              >
                + No Drama
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => addRequirement("Experience")}
              >
                + Experience
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateForm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateIntent}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={!newIntent.title || !newIntent.description}
            >
              Create Intent
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create Intent Button */}
      <Button 
        onClick={() => setShowCreateForm(true)}
        className="w-full bg-orange-500 hover:bg-orange-600 mb-4"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Crew Intent
      </Button>

      {/* Existing Crew Intents */}
      {crewIntents.map((intent) => (
        <div key={intent.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{intent.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{intent.description}</p>
            </div>
            <div className="text-xs text-gray-500">{intent.timeAgo}</div>
          </div>

          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{intent.currentMembers}/{intent.lookingFor}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{intent.timePreference}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{intent.route}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="text-xs">{intent.rideType}</Badge>
            <Badge variant="outline" className="text-xs">{intent.skillLevel}</Badge>
            <Badge variant="outline" className="text-xs">{intent.speed}</Badge>
            {intent.requirements.slice(0, 2).map((req, index) => (
              <Badge key={index} variant="secondary" className="text-xs">{req}</Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={intent.creator.avatar}
                alt={intent.creator.name}
                loading="lazy"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">by {intent.creator.name}</span>
            </div>
            <Button 
              size="sm"
              onClick={() => onJoinCrew?.(intent.id)}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isJoining || intent.currentMembers >= intent.lookingFor}
            >
              {intent.currentMembers >= intent.lookingFor ? "Full" : "Join Crew"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CrewFinder;