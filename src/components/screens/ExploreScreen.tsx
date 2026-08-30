import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Crown,
  Camera,
  Heart,
  UserPlus,
  Filter
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { mockOr, USE_MOCK } from "@/lib/mock";
import { socialApi } from "@/services/api";
import { toNearbyRider, type ApiRider } from "@/services/adapters";
import { useConfig } from "@/contexts/ConfigContext";
import { useToast } from "@/hooks/use-toast";
import type { StoryContent, NearbyRider } from "@/types";

// Riders are real: they come from /api/social/suggestions and /api/social/search.
// Everything else on this screen — crews, mentors, moments, initiatives, stories,
// invites — has no endpoint behind it, so each sits behind its own feature flag
// and stays hidden until one exists. The demo data below renders only in mock mode.
const crewIntents = mockOr(CREW_INTENTS, []);
const mentors = mockOr(MENTORS, []);

// Demo data for ride moments
const DEMO_RIDE_MOMENTS = [
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
const DEMO_COMMUNITY_INITIATIVES = [
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
const DEMO_STORIES = [
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

const DEMO_STORY_DATA = [
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

// Everything above is demo-only. Gating it here — rather than at each usage —
// keeps the rest of the component unchanged and makes the whole screen fall
// back to empty in one place.
const rideMoments = mockOr(DEMO_RIDE_MOMENTS, []);
const communityInitiatives = mockOr(DEMO_COMMUNITY_INITIATIVES, []);
const stories = mockOr(DEMO_STORIES, []);
const mockStoryData = mockOr(DEMO_STORY_DATA, []);

/**
 * Stands in for a tab whose backend does not exist. Saying so is better than an
 * empty panel that reads as a bug, and better than demo content that reads as real.
 */
const SectionComingSoon = ({ title, note }: { title: string; note: string }) => (
  <div className="bg-white rounded-xl p-8 text-center shadow-sm">
    <h3 className="text-base font-semibold text-gray-900">{title} is coming soon</h3>
    <p className="text-sm text-gray-500 mt-1">{note}</p>
  </div>
);

const ExploreScreen = () => {
  const { isEnabled } = useConfig();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Two riders in this screen, one list. With no search term the backend's
  // suggestions are the "nearby" riders; typing switches to a name search.
  // `trim().length >= 2` matches the server, which answers an empty list below
  // two characters rather than scanning every profile.
  const trimmedQuery = searchQuery.trim();
  const isSearching = trimmedQuery.length >= 2;

  const suggestionsQuery = useQuery({
    queryKey: ["social", "suggestions"],
    queryFn: () => socialApi.suggestions(),
    enabled: !USE_MOCK && !isSearching,
  });

  const searchResults = useQuery({
    queryKey: ["social", "search", trimmedQuery],
    queryFn: () => socialApi.search(trimmedQuery),
    enabled: !USE_MOCK && isSearching,
  });

  const activeQuery = isSearching ? searchResults : suggestionsQuery;

  const riders: NearbyRider[] = USE_MOCK
    ? NEARBY_RIDERS
    : ((activeQuery.data ?? []) as ApiRider[]).map(toNearbyRider);

  const connect = useMutation({
    mutationFn: (riderId: number) => socialApi.connectionAction(riderId, "request"),
    onSuccess: () => {
      toast({ title: "Request sent", description: "They'll see your connection request." });
      // The suggestion list is ranked partly by who you are not yet connected to.
      queryClient.invalidateQueries({ queryKey: ["social", "suggestions"] });
    },
    onError: (error: Error) => {
      toast({ title: "Could not send request", description: error.message, variant: "destructive" });
    },
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

  // These filters read `status` and `rideStyle`, and the backend stores neither —
  // the adapter leaves both neutral. Applying them to real riders would hide
  // every one of them, so the whole panel is offered only where the fields
  // actually exist. Restore it when presence and riding styles are stored.
  const canFilterRiders = USE_MOCK;

  const filteredRiders = canFilterRiders
    ? riders.filter(rider => {
        if (riderFilters.status !== "all" && rider.status !== riderFilters.status) return false;
        if (riderFilters.rideStyle !== "all" && !rider.rideStyle.some(style =>
          style.toLowerCase().includes(riderFilters.rideStyle.toLowerCase())
        )) return false;
        return true;
      })
    : riders;

  return (    <div className="bg-gray-50">
      {/* Search Header */}
      <ExploreSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Stories — no endpoint yet, so hidden unless the flag says otherwise. */}
      {isEnabled("stories") && (
        <StoriesCarousel
          stories={stories}
          onStoryClick={handleStoryClick}
          onAddStory={handleAddStory}
        />
      )}

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
            {canFilterRiders && (
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
            )}

            {/* Mentors — no endpoint yet. */}
            {isEnabled("mentors") && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Mentor Highlights
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {mentors.map((mentor) => (
                  <MentorHighlightCard key={mentor.id} mentor={mentor} />
                ))}
              </div>
            </div>
            )}

            {/* Nearby Riders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  {isSearching ? "Search Results" : "Riders for You"} ({filteredRiders.length})
                </h2>
              </div>

              {activeQuery.isPending && !USE_MOCK ? (
                <p className="text-sm text-gray-500 py-6 text-center">Finding riders…</p>
              ) : activeQuery.isError && !USE_MOCK ? (
                <p className="text-sm text-red-600 py-6 text-center">
                  Could not load riders. Check your connection and try again.
                </p>
              ) : filteredRiders.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">
                  {isSearching
                    ? `No riders match "${trimmedQuery}".`
                    : "No suggestions yet — join a ride to start meeting riders."}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredRiders.map((rider, index) => (
                    <NearbyRiderCard
                      key={rider.id || `${rider.name}-${index}`}
                      rider={rider}
                      // A rider with no id came from search, which projects only
                      // public profile columns. There is nothing to send a request
                      // about, so the action is withheld rather than shown broken.
                      onConnect={rider.id ? (id) => connect.mutate(id) : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Crew Finder Tab */}
          <TabsContent value="crew" className="px-4 space-y-6 mt-6">
            {isEnabled("crews") ? (
              <CrewFinder crewIntents={crewIntents} />
            ) : (
              <SectionComingSoon
                title="Crew Finder"
                note="Forming crews needs a backend that does not exist yet."
              />
            )}
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="px-4 space-y-6 mt-6">
            {/* Ride Moments — no endpoint yet. */}
            {isEnabled("rideMoments") && (
            <div>              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-500" />
                  Featured Ride Moments
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {rideMoments.map((moment) => (
                  <RideMomentCard key={moment.id} moment={moment} />
                ))}
              </div>
            </div>
            )}

            {/* Community Initiatives — no endpoint yet. */}
            {isEnabled("communityInitiatives") && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Community Initiatives
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {communityInitiatives.map((initiative) => (
                  <CommunityInitiativeCard key={initiative.id} initiative={initiative} />
                ))}
              </div>
            </div>
            )}

            {/* Invites — no endpoint yet: invite codes are not issued or tracked. */}
            {isEnabled("invites") && (
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
              />
            </div>
            )}

            {!isEnabled("rideMoments") &&
              !isEnabled("communityInitiatives") &&
              !isEnabled("invites") && (
                <SectionComingSoon
                  title="Community"
                  note="Ride moments, initiatives and invites are not built yet."
                />
              )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Story Viewer Modal */}
      {isEnabled("stories") && showStoryViewer && (
        <StoryViewer
          stories={mockStoryData}
          initialStoryIndex={selectedStoryIndex}
          onClose={() => setShowStoryViewer(false)}
        />
      )}

      {/* Story Creator Modal */}
      {isEnabled("stories") && showStoryCreator && (
        <StoryCreator onClose={() => setShowStoryCreator(false)} />
      )}
    </div>
  );
};

export default ExploreScreen;