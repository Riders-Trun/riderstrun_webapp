import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, MapPin, Award, Calendar, Edit3, Flame, Trophy, Target, Star, Zap, Shield, Phone } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import { DEFAULT_PROFILE, DEFAULT_RIDE_STATS, STREAKS, ACHIEVEMENTS, RECENT_RIDES, CHALLENGES } from "@/data/profile";

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  const rideStats = DEFAULT_RIDE_STATS;

  const streaks = STREAKS;

  const achievements = ACHIEVEMENTS;

  const recentRides = RECENT_RIDES;

  const challenges = CHALLENGES;

  const handleSave = () => {
    setIsEditing(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800";
      case "rare": return "bg-blue-100 text-blue-800";
      case "epic": return "bg-purple-100 text-purple-800";
      case "legendary": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <GlobalHeader 
        title="Profile"
        subtitle="Manage your rider profile"
        showBack={true}
        showNotifications={true}
        notificationCount={3}
      />

      <div className="p-3 space-y-4">
        {/* Edit Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className={isEditing ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            {isEditing ? "Save" : <Edit3 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Profile Info with Rank */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <Badge className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-xs">
                  Road Captain
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="bike">Bike Model</Label>
                <Input
                  id="bike"
                  value={profile.bike}
                  onChange={(e) => setProfile({...profile, bike: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="level">Riding Level</Label>
                {isEditing ? (
                  <Select value={profile.ridingLevel} onValueChange={(value) => setProfile({...profile, ridingLevel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={profile.ridingLevel} disabled />
                )}
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="emergencyName">Contact Name</Label>
                <Input
                  id="emergencyName"
                  value={profile.emergencyContact.name}
                  onChange={(e) => setProfile({
                    ...profile, 
                    emergencyContact: {...profile.emergencyContact, name: e.target.value}
                  })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  value={profile.emergencyContact.phone}
                  onChange={(e) => setProfile({
                    ...profile, 
                    emergencyContact: {...profile.emergencyContact, phone: e.target.value}
                  })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="emergencyRelation">Relationship</Label>
                {isEditing ? (
                  <Select 
                    value={profile.emergencyContact.relation} 
                    onValueChange={(value) => setProfile({
                      ...profile, 
                      emergencyContact: {...profile.emergencyContact, relation: value}
                    })}
                  >
                    <SelectTrigger>
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
                  <Input value={profile.emergencyContact.relation} disabled />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Statistics with Streaks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Stats & Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">{rideStats.totalPoints}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5 text-red-500" />
                  <span className="text-2xl font-bold text-red-600">{rideStats.currentStreak}</span>
                </div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{rideStats.ridesOrganized}</div>
                <div className="text-sm text-gray-600">Organized</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{rideStats.totalDistance}</div>
                <div className="text-sm text-gray-600">Distance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Streaks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="w-5 h-5" />
              Active Streaks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {streaks.map((streak, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">{streak.name}</h3>
                    <Badge variant="outline">{streak.reward}</Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-600">{streak.current}/{streak.target}</span>
                    <span className="text-xs text-gray-500">{streak.target - streak.current} more to go</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${(streak.current / streak.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Challenges */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Active Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {challenges.map((challenge, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-sm">{challenge.name}</h3>
                      <p className="text-xs text-gray-600">{challenge.description}</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">{challenge.reward}</Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-600">{challenge.progress}/{challenge.target}</span>
                    <span className="text-xs text-red-500">Expires {challenge.expires}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    achievement.earned ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-500'
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{achievement.name}</span>
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">{achievement.description}</div>
                    <div className="text-xs text-orange-600 font-medium">+{achievement.points} points</div>
                  </div>
                  {achievement.earned && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      Earned
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Rides with Points */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRides.map((ride, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{ride.name}</div>
                      <div className="text-xs text-gray-500">{ride.date} • {ride.role}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{ride.distance}</Badge>
                      <div className="text-xs text-orange-600 font-medium">+{ride.points} pts</div>
                    </div>
                  </div>
                  {index < recentRides.length - 1 && <Separator className="mt-3" />}
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
