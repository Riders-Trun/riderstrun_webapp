import { useState } from "react";
import { 
  Users, 
  Crown, 
  Camera, 
  Heart,
  UserPlus,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import explore components
import ExploreSearchBar from "@/components/explore/sections/ExploreSearchBar";
import StoriesCarousel from "@/components/explore/sections/StoriesCarousel";
import NearbyRiderCard from "@/components/explore/cards/NearbyRiderCard";
import CrewFinder from "@/components/explore/sections/CrewFinder";
import MentorHighlightCard from "@/components/explore/cards/MentorHighlightCard";
import RideMomentCard from "@/components/explore/cards/RideMomentCard";
import CommunityInitiativeCard from "@/components/explore/cards/CommunityInitiativeCard";
import InviteSystem from "@/components/explore/sections/InviteSystem";
import StoryViewer from "@/components/explore/stories/StoryViewer";
import StoryCreator from "@/components/explore/stories/StoryCreator";
import { NEARBY_RIDERS, CREW_INTENTS, MENTORS } from "@/data/explore";
import type { StoryContent } from "@/types";

// Mock data for ride moments
const rideMoments = [
  {
    id: 1,
    rider: {
      name: "Alex Johnson",
      avatar: "/api/placeholder/40/40"
    },
    image: "/api/placeholder/400/300",
    location: "Coorg Coffee Plantations",
    rideTitle: "Weekend Coorg Adventure",
    date: "Jan 6, 2024",
    participantsCount: 8,
    taggedRiders: ["Priya", "Vikram", "Sarah", "Mike"],
    hasUpcomingRide: true,
    upcomingRideDate: "Jan 20, 2024"
  },
  {
    id: 2,
    rider: {
      name: "Maya Patel",
      avatar: "/api/placeholder/40/40"
    },
    image: "/api/placeholder/400/300",
    location: "Wayanad Hills",
    rideTitle: "Misty Mountain Escape",
    date: "Jan 4, 2024",
    participantsCount: 6,
    taggedRiders: ["Arjun", "Sneha", "Rohit"],
    hasUpcomingRide: false
  }
];

// Mock data for community initiatives
const communityInitiatives = [
  {
    id: 1,
    title: "Blood Donation Drive - Riders for Life",
    description: "Join us for a blood donation camp organized by the riding community. Save lives while building bonds.",
    image: "/api/placeholder/400/200",
    type: "blood-donation" as const,
    organizer: {
      name: "Dr. Venkat",
      avatar: "/api/placeholder/40/40",
      organization: "Community Health Initiative"
    },
    date: "Jan 15, 2024, 9:00 AM",
    location: "Brigade Road Community Center",
    participantsCount: 45,
    maxParticipants: 100,
    registrationDeadline: "Jan 14, 2024",
    requirements: ["Age 18-65", "Weight >50kg", "Valid ID"],
    impact: "Each donation can save up to 3 lives"
  },
  {
    id: 2,
    title: "Women Riders Safety Workshop",
    description: "Comprehensive safety workshop covering defensive riding, bike maintenance, and emergency response.",
    image: "/api/placeholder/400/200",
    type: "women-only" as const,
    organizer: {
      name: "Priya Sharma",
      avatar: "/api/placeholder/40/40",
      organization: "Women on Wheels"
    },
    date: "Jan 21, 2024, 10:00 AM",
    location: "Royal Enfield Service Center, Koramangala",
    participantsCount: 28,
    maxParticipants: 40,
    requirements: ["Women Only", "Own Bike", "Basic Riding License"],
    impact: "Empowering 40+ women riders with safety knowledge"
  }
];

// Stories data
const stories = [
  {
    id: 1,
    user: { name: "Alex", avatar: "/api/placeholder/40/40", isViewed: false },
    preview: "/api/placeholder/80/80"
  },
  {
    id: 2,
    user: { name: "Maya", avatar: "/api/placeholder/40/40", isViewed: true },
    preview: "/api/placeholder/80/80"
  }
];

const mockStoryData = [
  {
    id: 1,
    user: { name: "Alex", avatar: "/api/placeholder/40/40" },
    content: [
      {
        type: "image" as const,
        url: "/api/placeholder/400/600",
        caption: "Morning ride through the hills! 🏍️"
      }
    ],
    timestamp: "2h ago"
  }
];

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTab, setSelectedTab] = useState("nearby");
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [showStoryCreator, setShowStoryCreator] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [riderFilters, setRiderFilters] = useState({
    status: "all",
    rideStyle: "all",
    distance: "all"
  });

  // Event handlers
  const handleStoryClick = (storyId: number) => {
    const storyIndex = mockStoryData.findIndex(story => story.id === storyId);
    if (storyIndex !== -1) {
      setSelectedStoryIndex(storyIndex);
      setShowStoryViewer(true);
    }
  };

  const handleAddStory = () => {
    setShowStoryCreator(true);
  };

  const handlePublishStory = (storyContent: StoryContent) => {
    console.log("Publishing story:", storyContent);
  };

  const handleConnectRider = (riderId: number) => {
    console.log("Connecting with rider:", riderId);
  };

  const handleInviteRider = (riderId: number) => {
    console.log("Inviting rider:", riderId);
  };

  const handleJoinCrew = (crewId: number) => {
    console.log("Joining crew:", crewId);
  };

  const handleCreateCrewIntent = (intent: { title: string; description: string; lookingFor: number; rideType: string }) => {
    console.log("Creating crew intent:", intent);
  };

  const handleFollowMentor = (mentorId: number) => {
    console.log("Following mentor:", mentorId);
  };

  const handleInviteCollaborate = (mentorId: number) => {
    console.log("Inviting mentor to collaborate:", mentorId);
  };  const handleAskGuidance = (mentorId: number) => {
    console.log("Asking guidance from mentor:", mentorId);
  };

  const handleJoinNextRide = (momentId: number) => {
    console.log("Joining next ride:", momentId);
  };

  const handleAskForRoute = (momentId: number) => {
    console.log("Asking for route:", momentId);
  };

  const handleRegisterInitiative = (initiativeId: number) => {
    console.log("Registering for initiative:", initiativeId);
  };

  const handleShowInterest = (initiativeId: number) => {
    console.log("Showing interest in initiative:", initiativeId);
  };

  const handleShareInviteCode = (method: string) => {
    console.log("Sharing invite code via:", method);
  };

  const handleFilterClick = () => {
    console.log("Opening filters");
  };

  // Filter nearby riders based on selected filters
  const filteredRiders = NEARBY_RIDERS.filter(rider => {
    if (riderFilters.status !== "all" && rider.status !== riderFilters.status) return false;
    if (riderFilters.rideStyle !== "all" && !rider.rideStyle.some(style => 
      style.toLowerCase().includes(riderFilters.rideStyle.toLowerCase())
    )) return false;
    return true;
  });

  return (    <div className="bg-gray-50">
      {/* Search Header */}
      <ExploreSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onFilterClick={handleFilterClick}
      />

      {/* Stories Section */}
      <StoriesCarousel
        stories={stories}
        onStoryClick={handleStoryClick}
        onAddStory={handleAddStory}
      />

      {/* Main Content Tabs */}
      <div className="flex-1">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="nearby">
              <Users className="w-4 h-4 mr-1" />
              Nearby
            </TabsTrigger>
            <TabsTrigger value="crew">
              <Users className="w-4 h-4 mr-1" />
              Crew
            </TabsTrigger>
            <TabsTrigger value="community">
              <Heart className="w-4 h-4 mr-1" />
              Community
            </TabsTrigger>
          </TabsList>

          {/* Nearby Riders Tab */}          <TabsContent value="nearby" className="px-4 space-y-6 mt-6">
            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter Riders</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Select value={riderFilters.status} onValueChange={(value) => 
                  setRiderFilters(prev => ({ ...prev, status: value }))
                }>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Now</SelectItem>
                    <SelectItem value="looking">Looking for Crew</SelectItem>
                    <SelectItem value="upcoming">Upcoming Rides</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={riderFilters.rideStyle} onValueChange={(value) => 
                  setRiderFilters(prev => ({ ...prev, rideStyle: value }))
                }>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Styles</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="scenic">Scenic</SelectItem>                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="long">Long Distance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={riderFilters.distance} onValueChange={(value) => 
                  setRiderFilters(prev => ({ ...prev, distance: value }))
                }>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Distance</SelectItem>
                    <SelectItem value="1km">Within 1km</SelectItem>
                    <SelectItem value="5km">Within 5km</SelectItem>
                    <SelectItem value="10km">Within 10km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mentors Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Mentor Highlights
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {MENTORS.map((mentor) => (
                  <MentorHighlightCard
                    key={mentor.id}
                    mentor={mentor}
                    onFollow={handleFollowMentor}
                    onInviteCollaborate={handleInviteCollaborate}
                    onAskGuidance={handleAskGuidance}
                  />
                ))}
              </div>
            </div>
            {/* Nearby Riders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  Nearby Riders ({filteredRiders.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {filteredRiders.map((rider) => (
                  <NearbyRiderCard
                    key={rider.id}
                    rider={rider}
                    onConnect={handleConnectRider}
                    onInvite={handleInviteRider}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Crew Finder Tab */}
          <TabsContent value="crew" className="px-4 space-y-6 mt-6">
            <CrewFinder
              crewIntents={CREW_INTENTS}
              onJoinCrew={handleJoinCrew}
              onCreateIntent={handleCreateCrewIntent}
            />
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="px-4 space-y-6 mt-6">
            {/* Ride Moments */}
            <div>              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-500" />
                  Featured Ride Moments
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {rideMoments.map((moment) => (
                  <RideMomentCard
                    key={moment.id}
                    moment={moment}
                    onJoinNextRide={handleJoinNextRide}
                    onAskForRoute={handleAskForRoute}
                  />
                ))}
              </div>
            </div>

            {/* Community Initiatives */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Community Initiatives
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {communityInitiatives.map((initiative) => (
                  <CommunityInitiativeCard
                    key={initiative.id}
                    initiative={initiative}
                    onRegister={handleRegisterInitiative}
                    onShowInterest={handleShowInterest}
                  />
                ))}
              </div>
            </div>
            {/* Invite System */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-500" />
                  Grow the Community
                </h2>
              </div>
              
              <InviteSystem
                userInviteCode="RIDE2024"
                communityPoints={1250}
                invitedRiders={8}
                completedInvites={5}
                onShareCode={handleShareInviteCode}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Story Viewer Modal */}
      {showStoryViewer && (
        <StoryViewer
          stories={mockStoryData}
          initialStoryIndex={selectedStoryIndex}
          onClose={() => setShowStoryViewer(false)}
        />
      )}

      {/* Story Creator Modal */}
      {showStoryCreator && (
        <StoryCreator
          onClose={() => setShowStoryCreator(false)}
          onPublish={handlePublishStory}
        />
      )}
    </div>
  );
};

export default ExploreScreen;