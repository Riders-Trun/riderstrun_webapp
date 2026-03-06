import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Camera, 
  MessageSquare, 
  Heart, 
  Share2,
  Navigation,
  Users,
  Star,
  Coffee,
  Fuel,
  Mountain,
  Calendar,
  Timer,
  Route,
  Flag,
  Loader,
  MoreHorizontal,
  Bookmark,
  Send,
  Smile
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import GlobalHeader from "@/components/GlobalHeader";

const RideDiscoveryScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    try {
      navigate(-1);
    } catch (error) {
      navigate('/');
    }
  };
  // Mock data with fallbacks
  const rideData = {
    id: id || "1",
    title: "Nandi Sunrise Sprint",
    route: "Cubbon Park → Nandi Hills",
    distance: "80 km round trip",
    difficulty: "Moderate",
    estimatedTime: "4-5 hours",
    bestTime: "Early Morning (5:30 AM)",
    completedRides: 127,
    rating: 4.8,
    tags: ["Sunrise", "Hills", "Breakfast", "Scenic"],
    
    pastGroups: [
      {
        id: 1,
        date: "Dec 15, 2024",
        organizer: "Rajesh Kumar",
        participants: 12,
        rating: 5,
        highlights: ["Amazing sunrise", "Great breakfast spot", "Perfect weather"]
      },
      {
        id: 2,
        date: "Nov 28, 2024", 
        organizer: "Priya Singh",
        participants: 8,
        rating: 4.5,
        highlights: ["Good group energy", "Beautiful photos", "Smooth ride"]
      }
    ],

    routeStops: [
      {
        name: "Cubbon Park - Start Point",
        type: "start",
        time: "5:30 AM",
        description: "Meeting point for all riders"
      },
      {
        name: "Nandi Hills Base",
        type: "checkpoint", 
        time: "6:45 AM",
        description: "Quick stop before the climb"
      },
      {
        name: "Sunrise Point",
        type: "destination",
        time: "7:15 AM", 
        description: "Main viewpoint for sunrise"
      },
      {
        name: "Hilltop Cafe",
        type: "food",
        time: "8:00 AM",
        description: "Breakfast and refreshments"
      }
    ],

    riderTalks: [
      {
        id: 1,
        rider: "Vikram Raj",
        avatar: "VR",
        time: "2 days ago",
        message: "Just completed this route! The sunrise was absolutely breathtaking. Perfect weather and great company. Highly recommend starting early to catch the golden hour. 🌅",
        likes: 24,
        isLiked: false,
        photos: 3,
        comments: [
          { user: "Sneha", message: "Amazing shots! 📸" },
          { user: "Rajesh", message: "Next time count me in!" }
        ]
      },
      {
        id: 2,
        rider: "Sneha Reddy", 
        avatar: "SR",
        time: "1 week ago",
        message: "Third time doing this route and it never gets old! The cafe at the top has amazing filter coffee. Road conditions are good, just be careful on the winding sections. ☕🏍️",
        likes: 18,
        isLiked: true,
        photos: 1,
        comments: [
          { user: "Kiran", message: "That coffee is legendary!" },
          { user: "Amit", message: "Thanks for the tip about the roads" }
        ]
      },
      {
        id: 3,
        rider: "Kiran Kumar",
        avatar: "KK", 
        time: "2 weeks ago",
        message: "Perfect route for beginners! Not too challenging but scenic enough to be exciting. The group was very supportive and we had so much fun. 🎯",
        likes: 15,
        isLiked: false,
        photos: 2,
        comments: [
          { user: "Priya", message: "Great for newbies indeed!" }
        ]
      },
      {
        id: 4,
        rider: "Arjun Patel",
        avatar: "AP",
        time: "3 weeks ago", 
        message: "Monsoon ride was epic! Rain made it challenging but the mist-covered hills were magical. Proper rain gear is essential though. 🌧️⛰️",
        likes: 31,
        isLiked: true,
        photos: 5,
        comments: [
          { user: "Maya", message: "Brave souls! Looks incredible" },
          { user: "Dev", message: "Rain riding is next level" }
        ]
      }
    ],

    photos: [
      {
        id: 1,
        rider: "Rajesh Kumar",
        avatar: "RK",
        caption: "Sunrise view from Nandi Hills - Worth the early wake up! 🌄✨ #NandiHills #Sunrise #MotorcycleDiaries",
        likes: 32,
        isLiked: true,
        time: "Dec 15, 2024",
        comments: 8,
        location: "Nandi Hills, Bangalore"
      },
      {
        id: 2, 
        rider: "Priya Singh",
        avatar: "PS",
        caption: "Group photo at the summit 📸 Amazing company makes every ride memorable! 🏍️👥 #RidersTurn #GroupRide",
        likes: 28,
        isLiked: false,
        time: "Nov 28, 2024",
        comments: 5,
        location: "Nandi Hills Summit"
      },
      {
        id: 3,
        rider: "Amit Patel",
        avatar: "AP",
        caption: "The winding roads up to Nandi Hills 🛣️ Perfect for a Sunday morning cruise #WindingRoads #MorningRide",
        likes: 21,
        isLiked: true,
        time: "Nov 10, 2024",
        comments: 3,
        location: "Nandi Hills Road"
      },
      {
        id: 4,
        rider: "Vikram Raj", 
        avatar: "VR",
        caption: "Coffee break at hilltop cafe ☕ Nothing beats hot coffee after a long ride! #CoffeeBreak #HilltopCafe",
        likes: 19,
        isLiked: false,
        time: "Dec 8, 2024",
        comments: 12,
        location: "Hilltop Cafe, Nandi Hills"
      },
      {
        id: 5,
        rider: "Maya Sharma",
        avatar: "MS", 
        caption: "Golden hour magic 🌅 These moments make every early morning worth it #GoldenHour #Photography",
        likes: 45,
        isLiked: true,
        time: "Dec 20, 2024",
        comments: 15,
        location: "Nandi Hills Viewpoint"
      },
      {
        id: 6,
        rider: "Dev Kumar",
        avatar: "DK",
        caption: "Fog rolling in over the hills 🌫️ Nature's own special effects! #FoggyMorning #NaturePhotography",
        likes: 38,
        isLiked: false,
        time: "Dec 5, 2024",
        comments: 9,
        location: "Nandi Hills"
      }
    ],

    tips: [
      "Start early (5:30 AM) to catch the sunrise",
      "Carry warm clothes - it gets chilly at the top",
      "Tank up fuel before starting the climb",
      "The cafe serves excellent South Indian breakfast"
    ]
  };

  const getStopIcon = (type: string) => {
    switch (type) {
      case 'start': return Flag;
      case 'checkpoint': return Navigation;
      case 'destination': return Mountain;
      case 'food': return Coffee;
      case 'fuel': return Fuel;
      default: return MapPin;
    }
  };
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50">
        <GlobalHeader 
          title="Route Discovery"
          showBack={true}
          showNotifications={true}
          notificationCount={3}
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading route details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <GlobalHeader 
        title="Route Discovery"
        subtitle="Explore amazing routes"
        showBack={true}
        showNotifications={true}
        notificationCount={3}
      />

      <div className="p-3 space-y-4 pb-20">

        {/* Route Header */}
        <Card className="overflow-hidden">
          <div className="relative">
            <div className="h-48 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center">
              <div className="text-center text-white">
                <Mountain className="w-16 h-16 mx-auto mb-2 opacity-80" />
                <h3 className="text-2xl font-bold">{rideData.title}</h3>
                <p className="text-orange-100 text-sm">{rideData.route}</p>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{rideData.completedRides}</div>
                    <div className="text-xs text-gray-600">Past Rides</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {rideData.rating}
                    </div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{rideData.distance}</div>
                    <div className="text-xs text-gray-600">Distance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-orange-500" />
              <div>
                <div className="text-sm font-medium">{rideData.estimatedTime}</div>
                <div className="text-xs text-gray-500">Duration</div>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium">{rideData.bestTime}</div>
                <div className="text-xs text-gray-500">Best Time</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {rideData.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="route" className="text-xs">Route</TabsTrigger>
            <TabsTrigger value="talks" className="text-xs">Talks</TabsTrigger>
            <TabsTrigger value="photos" className="text-xs">Photos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  Recent Completions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rideData.pastGroups.map((group) => (
                  <div key={group.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-sm">{group.organizer}</div>
                        <div className="text-xs text-gray-500">{group.date} • {group.participants} riders</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium">{group.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {group.highlights.map((highlight, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-white">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tips Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎯 Pro Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rideData.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Route Tab */}
          <TabsContent value="route" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Route className="w-5 h-5 text-blue-500" />
                  Route Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rideData.routeStops.map((stop, index) => {
                    const Icon = getStopIcon(stop.type);
                    return (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            stop.type === 'start' ? 'bg-green-100 text-green-600' :
                            stop.type === 'destination' ? 'bg-red-100 text-red-600' :
                            stop.type === 'food' ? 'bg-orange-100 text-orange-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {index < rideData.routeStops.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm">{stop.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{stop.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {stop.time}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rider Talks Tab - Instagram-like Feed */}
          <TabsContent value="talks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  Rider Stories & Experiences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {rideData.riderTalks.map((talk) => (
                  <div key={talk.id} className="border-b pb-6 last:border-b-0">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-orange-100 text-orange-700 text-sm font-bold">
                            {talk.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-sm">{talk.rider}</h4>
                          <p className="text-xs text-gray-500">{talk.time}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Post Content */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-700 leading-relaxed">{talk.message}</p>
                    </div>

                    {/* Photo Indicator */}
                    {talk.photos > 0 && (
                      <div className="mb-3">
                        <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-48 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <Camera className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">{talk.photos} photo{talk.photos > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-8 px-2 ${talk.isLiked ? 'text-red-500' : 'text-gray-600'}`}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${talk.isLiked ? 'fill-red-500' : ''}`} />
                          {talk.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {talk.comments?.length || 0}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Comments */}
                    {talk.comments && talk.comments.length > 0 && (
                      <div className="space-y-2">
                        {talk.comments.map((comment, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                            <span className="text-sm text-gray-700">{comment.message}</span>
                          </div>
                        ))}
                        {talk.comments.length > 2 && (
                          <Button variant="ghost" size="sm" className="h-6 px-0 text-gray-500 text-xs">
                            View all comments
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                          You
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex items-center bg-gray-50 rounded-full px-3 py-2">
                        <input 
                          placeholder="Add a comment..." 
                          className="flex-1 bg-transparent text-sm outline-none"
                        />
                        <Smile className="w-4 h-4 text-gray-400 ml-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          {/* Photos Tab - Instagram-like Gallery */}
          <TabsContent value="photos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-500" />
                  Photo Memories ({rideData.photos.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {rideData.photos.map((photo) => (
                  <div key={photo.id} className="space-y-3">
                    {/* Photo Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
                            {photo.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-sm">{photo.rider}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {photo.location}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Photo */}
                    <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <Camera className="w-12 h-12 text-gray-400" />
                      {/* Photo placeholder - in real app this would be actual image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Photo Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-8 px-2 ${photo.isLiked ? 'text-red-500' : 'text-gray-600'}`}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${photo.isLiked ? 'fill-red-500' : ''}`} />
                          {photo.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {photo.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Caption */}
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-semibold">{photo.rider}</span>{" "}
                        <span className="text-gray-700">{photo.caption}</span>
                      </p>
                      <p className="text-xs text-gray-500">{photo.time}</p>
                    </div>

                    {/* View Comments */}
                    {photo.comments > 0 && (
                      <Button variant="ghost" size="sm" className="h-6 px-0 text-gray-500 text-xs">
                        View all {photo.comments} comments
                      </Button>
                    )}

                    {/* Add Comment */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                          You
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex items-center bg-gray-50 rounded-full px-3 py-1">
                        <input 
                          placeholder="Add a comment..." 
                          className="flex-1 bg-transparent text-sm outline-none"
                        />
                        <Smile className="w-3 h-3 text-gray-400 ml-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button 
            onClick={() => navigate('/plan-ride')}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Plan This Route
          </Button>
          <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
            <Share2 className="w-4 h-4 mr-2" />
            Share Route
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RideDiscoveryScreen;