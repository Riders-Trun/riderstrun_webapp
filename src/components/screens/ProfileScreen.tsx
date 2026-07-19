import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { profileApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, MapPin, Award, Calendar, Edit3, Flame, Trophy, Target, Star, Zap, Shield, Phone, Bike, Mail, ChevronRight } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import { DEFAULT_PROFILE, DEFAULT_RIDE_STATS, STREAKS, ACHIEVEMENTS, RECENT_RIDES, CHALLENGES } from "@/data/profile";
import { mockOr } from "@/lib/mock";
import { useAuth } from "@/contexts/AuthContext";
import type { UserProfile, RideStats } from "@/types";

/**
 * This screen is not wired to /api/profile yet — it has always rendered demo
 * data. Outside mock mode it shows an empty profile rather than "Alex Kumar"
 * and 24 rides that belong to nobody. The signed-in email is filled in from the
 * auth context so the screen is recognisably yours while the rest is blank.
 */
const EMPTY_PROFILE: UserProfile = {
    name: "",
    phone: "",
    email: "",
    bike: "",
    ridingLevel: "",
    location: "",
    emergencyContact: { name: "", phone: "", relation: "" },
};

const EMPTY_RIDE_STATS: RideStats = {
    totalRides: 0,
    ridesOrganized: 0,
    totalDistance: "0 km",
    noShows: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalPoints: 0,
    organizerRank: "—",
};

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const [profile, setProfile] = useState(
    mockOr(DEFAULT_PROFILE, { ...EMPTY_PROFILE, email: user?.email ?? "" })
  );

  const rideStats = mockOr(DEFAULT_RIDE_STATS, EMPTY_RIDE_STATS);
  const streaks = mockOr(STREAKS, []);
  const achievements = mockOr(ACHIEVEMENTS, []);
  const recentRides = mockOr(RECENT_RIDES, []);
  const challenges = mockOr(CHALLENGES, []);

  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await profileApi.updateProfile({
        full_name: profile.name,
        phone: profile.phone,
        email: profile.email,
        bike: profile.bike,
        riding_level: profile.ridingLevel,
        location: profile.location,
      });
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
    } catch {
      toast({ title: "Failed to save", description: "Could not update profile.", variant: "destructive" });
    }
    setIsEditing(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-700";
      case "rare": return "bg-blue-100 text-blue-700";
      case "epic": return "bg-purple-100 text-purple-700";
      case "legendary": return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "👑";
      case "epic": return "💎";
      case "rare": return "⭐";
      default: return "🏅";
    }
  };

  return (
    <div className="bg-gray-50">
      <GlobalHeader
        title="Profile"
        subtitle="Manage your rider profile"
        showBack={true}
        showNotifications={true}
      />

      {/* Hero Profile Section */}
      <div className="bg-gradient-to-b from-orange-500 to-orange-600 px-4 pb-16 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
              <span className="text-2xl font-bold text-white">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge className="bg-white/20 text-white border-0 text-xs backdrop-blur-sm">
                  {rideStats.organizerRank}
                </Badge>
                <span className="text-orange-100 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile.location}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="text-white hover:bg-white/20 border border-white/30 h-9 px-3"
          >
            {isEditing ? "Save" : <Edit3 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-white">{rideStats.totalRides}</div>
            <div className="text-xs text-orange-100 uppercase tracking-wide">Rides</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-white">{rideStats.totalDistance}</div>
            <div className="text-xs text-orange-100 uppercase tracking-wide">Distance</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-white flex items-center justify-center gap-0.5">
              <Flame className="w-4 h-4" />
              {rideStats.currentStreak}
            </div>
            <div className="text-xs text-orange-100 uppercase tracking-wide">Streak</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-white">{rideStats.totalPoints}</div>
            <div className="text-xs text-orange-100 uppercase tracking-wide">Points</div>
          </div>
        </div>
      </div>

      {/* Content overlapping the hero */}
      <div className="px-3 -mt-8 space-y-3 pb-6">

        {/* Personal Info Card */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-700">
              <User className="w-4 h-4 text-orange-500" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name" className="text-xs text-gray-500">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  disabled={!isEditing}
                  className="h-9 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs text-gray-500">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  disabled={!isEditing}
                  className="h-9 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-xs text-gray-500">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  disabled={!isEditing}
                  className="h-9 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bike" className="text-xs text-gray-500">Bike Model</Label>
                <Input
                  id="bike"
                  value={profile.bike}
                  onChange={(e) => setProfile({...profile, bike: e.target.value})}
                  disabled={!isEditing}
                  className="h-9 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="level" className="text-xs text-gray-500">Riding Level</Label>
                {isEditing ? (
                  <Select value={profile.ridingLevel} onValueChange={(value) => setProfile({...profile, ridingLevel: value})}>
                    <SelectTrigger className="h-9 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={profile.ridingLevel} disabled className="h-9 mt-1" />
                )}
              </div>
              <div>
                <Label htmlFor="location" className="text-xs text-gray-500">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  disabled={!isEditing}
                  className="h-9 mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-700">
              <Shield className="w-4 h-4 text-red-500" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="emergencyName" className="text-xs text-gray-500">Contact Name</Label>
                <Input
                  id="emergencyName"
                  value={profile.emergencyContact.name}
                  onChange={(e) => setProfile({
                    ...profile,
                    emergencyContact: {...profile.emergencyContact, name: e.target.value}
                  })}
                  disabled={!isEditing}
                  className="h-9 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emergencyPhone" className="text-xs text-gray-500">Phone</Label>
                <Input
                  id="emergencyPhone"
                  value={profile.emergencyContact.phone}
                  onChange={(e) => setProfile({
                    ...profile,
                    emergencyContact: {...profile.emergencyContact, phone: e.target.value}
                  })}
                  disabled={!isEditing}
                  className="h-9 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emergencyRelation" className="text-xs text-gray-500">Relationship</Label>
                {isEditing ? (
                  <Select
                    value={profile.emergencyContact.relation}
                    onValueChange={(value) => setProfile({
                      ...profile,
                      emergencyContact: {...profile.emergencyContact, relation: value}
                    })}
                  >
                    <SelectTrigger className="h-9 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Friend">Friend</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={profile.emergencyContact.relation} disabled className="h-9 mt-1" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streaks & Challenges - Side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Active Streaks */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                <Flame className="w-4 h-4 text-red-500" />
                Active Streaks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {streaks.map((streak, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-medium text-xs">{streak.name}</span>
                    <span className="text-xs text-orange-600 font-semibold bg-orange-50 px-2 py-0.5 rounded-full">{streak.reward}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${(streak.current / streak.target) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">{streak.current}/{streak.target}</span>
                    <span className="text-xs text-gray-400">{streak.target - streak.current} to go</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Challenges */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                <Target className="w-4 h-4 text-purple-500" />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {challenges.map((challenge, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="font-medium text-xs block">{challenge.name}</span>
                      <span className="text-xs text-gray-500">{challenge.description}</span>
                    </div>
                    <span className="text-xs text-purple-600 font-semibold bg-purple-100 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">{challenge.reward}</span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-1.5 mb-1 mt-2">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-purple-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">{challenge.progress}/{challenge.target}</span>
                    <span className="text-xs text-red-400">Expires {challenge.expires}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-700">
              <Award className="w-4 h-4 text-amber-500" />
              Achievements
              <span className="text-xs text-gray-400 font-normal ml-auto">
                {achievements.filter(a => a.earned).length}/{achievements.length} unlocked
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`relative rounded-xl p-3 text-center transition-all ${
                    achievement.earned
                      ? 'bg-gradient-to-b from-orange-50 to-white border border-orange-200 shadow-sm'
                      : 'bg-gray-50 border border-gray-100 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    achievement.earned ? 'bg-orange-100' : 'bg-gray-200'
                  }`}>
                    <span className="text-lg">{getRarityIcon(achievement.rarity)}</span>
                  </div>
                  <div className="font-medium text-xs truncate">{achievement.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{achievement.description}</div>
                  <Badge className={`mt-1.5 text-xs px-1.5 py-0 ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </Badge>
                  {achievement.earned && (
                    <div className="text-xs text-orange-600 font-medium mt-1">+{achievement.points} pts</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Rides */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-blue-500" />
              Recent Rides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0 divide-y divide-gray-100">
              {recentRides.map((ride, index) => (
                <div key={index} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      ride.role === "Organizer" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                    }`}>
                      {ride.role === "Organizer" ? "O" : "P"}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{ride.name}</div>
                      <div className="text-xs text-gray-400">{ride.date} · {ride.distance}</div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs font-semibold text-orange-600">+{ride.points} pts</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileScreen;
