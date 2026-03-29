
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Camera, MapPin, Calendar, Star, Route, Plus, Heart, MessageCircle, Share } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";

const TravelDiaryScreen = () => {
  const [selectedTab, setSelectedTab] = useState("entries");

  const diaryEntries = [
    {
      id: 1,
      title: "Epic Nandi Hills Sunrise",
      date: "2024-01-15",
      location: "Nandi Hills, Karnataka",
      distance: "62 km",
      rating: 5,
      photos: 12,
      excerpt: "The most breathtaking sunrise I've ever witnessed. The ride up was challenging but totally worth it...",
      tags: ["sunrise", "hills", "photography"],
      likes: 24,
      comments: 8,
      weather: "Clear, 18°C"
    },
    {
      id: 2,
      title: "Coorg Coffee Adventure",
      date: "2024-01-08",
      location: "Coorg, Karnataka", 
      distance: "180 km",
      rating: 4,
      photos: 28,
      excerpt: "Two days exploring the coffee plantations and waterfalls. Met some amazing local riders...",
      tags: ["coffee", "waterfalls", "nature"],
      likes: 31,
      comments: 12,
      weather: "Partly cloudy, 22°C"
    },
    {
      id: 3,
      title: "Coastal Highway Cruise",
      date: "2024-01-01",
      location: "Mangalore Coast",
      distance: "220 km",
      rating: 5,
      photos: 15,
      excerpt: "New Year ride along the beautiful coastal highway. Perfect weather and great company...",
      tags: ["coast", "highway", "newyear"],
      likes: 42,
      comments: 15,
      weather: "Sunny, 26°C"
    }
  ];

  const stats = {
    totalTrips: 23,
    totalDistance: "3,450 km",
    totalPhotos: 456,
    averageRating: 4.6
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <GlobalHeader 
        title="Travel Diary"
        subtitle="Your riding adventures"
        showBack={true}
        showNotifications={true}
      />
      
      {/* New Entry Button */}
      <div className="p-3 border-b bg-white">
        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 w-full">
          <Plus className="w-4 h-4 mr-1" />
          New Entry
        </Button>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-orange-600">{stats.totalTrips}</div>
            <div className="text-xs text-gray-600">Total Trips</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-blue-600">{stats.totalDistance}</div>
            <div className="text-xs text-gray-600">Distance</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-green-600">{stats.totalPhotos}</div>
            <div className="text-xs text-gray-600">Photos</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-purple-600">{stats.averageRating}</div>
            <div className="text-xs text-gray-600">Avg Rating</div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="entries">Entries</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
          </TabsList>

          <TabsContent value="entries" className="space-y-4 mt-4">
            {diaryEntries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {entry.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < entry.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700">{entry.excerpt}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Entry Stats */}
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Route className="w-3 h-3" />
                        {entry.distance}
                      </div>
                      <div className="flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        {entry.photos} photos
                      </div>
                    </div>
                    <div className="text-xs">{entry.weather}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {entry.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {entry.comments}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="photos" className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-orange-200 to-orange-400 rounded-lg"></div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="routes" className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center text-gray-500">
                  <Route className="w-12 h-12 mx-auto mb-2" />
                  <p>Your saved routes will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TravelDiaryScreen;
