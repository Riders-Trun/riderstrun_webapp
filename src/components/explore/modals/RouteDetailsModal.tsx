    participants: [
      { name: "Priya", avatar: "/api/placeholder/30/30", status: "confirmed" },
      { name: "Vikram", avatar: "/api/placeholder/30/30", status: "confirmed" },
      { name: "Sneha", avatar: "/api/placeholder/30/30", status: "maybe" },
      { name: "Rohit", avatar: "/api/placeholder/30/30", status: "confirmed" }
    ],
    nextRideDate: "This Sunday, 6:30 AM",
    requirements: ["Full helmet mandatory", "Fuel tank full", "Emergency contact shared"],
    tips: [
      "Carry warm clothes for early morning",
      "Phone fully charged for navigation",
      "Light breakfast before starting",
      "Check weather conditions"
    ],
    gallery: [
      "/api/placeholder/150/100",
      "/api/placeholder/150/100", 
      "/api/placeholder/150/100",
      "/api/placeholder/150/100"
    ]
  };

  const handleSaveRoute = () => {
    setIsSaved(!isSaved);
    onSaveRoute?.(routeId);
  };

  const getWaypointIcon = (type: string) => {
    switch (type) {
      case "start": return "🏁";
      case "stop": return "☕";
      case "milestone": return "🏔️";
      case "destination": return "🌅";
      default: return "📍";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="relative">
        <img
          src={route.coverImage}
          alt={route.title}
          loading="lazy"
          className="w-full h-64 object-cover"
        />
        
        {/* Header overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="bg-black/20 text-white hover:bg-black/40 rounded-full w-10 h-10 p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShareRoute?.(routeId)}
                className="bg-black/20 text-white hover:bg-black/40 rounded-full w-10 h-10 p-0"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveRoute}
                className="bg-black/20 text-white hover:bg-black/40 rounded-full w-10 h-10 p-0"
              >
                <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
              </Button>
            </div>
          </div>
          
          {/* Title overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-bold text-white mb-2">{route.title}</h1>
            <div className="flex items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {route.stats.distance}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {route.stats.duration}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                {route.stats.rating}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Creator info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={route.creator.avatar} />
            <AvatarFallback className="bg-orange-100 text-orange-600">
              {route.creator.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{route.creator.name}</span>
              {route.creator.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">{route.creator.rides} rides completed</p>
          </div>
          <Button variant="outline" size="sm" className="border-orange-200 text-orange-600">
            Follow
          </Button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{route.stats.distance}</div>
            <div className="text-xs text-gray-600">Distance</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{route.stats.duration}</div>
            <div className="text-xs text-gray-600">Duration</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{route.stats.elevation}</div>
            <div className="text-xs text-gray-600">Elevation</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{route.stats.completedBy}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
        </div>

        {/* Difficulty badge */}
        <div className="flex items-center gap-2 mb-4">
          <Badge 
            variant="outline" 
            className={cn(
              "text-sm",
              route.stats.difficulty === "Easy" && "border-green-300 text-green-700 bg-green-50",
              route.stats.difficulty === "Medium" && "border-yellow-300 text-yellow-700 bg-yellow-50",
              route.stats.difficulty === "Hard" && "border-red-300 text-red-700 bg-red-50"
            )}
          >
            <Zap className="w-3 h-3 mr-1" />
            {route.stats.difficulty}
          </Badge>
          <span className="text-sm text-gray-600">Difficulty Level</span>
        </div>

        {/* Next ride info */}
        {route.nextRideDate && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">Next Group Ride</span>
            </div>
            <p className="text-green-800 mb-3">{route.nextRideDate}</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-green-700">Participants:</span>
              <div className="flex -space-x-2">
                {route.participants.slice(0, 4).map((participant, index) => (
                  <Avatar key={index} className="w-6 h-6 border-2 border-white">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback className="text-xs">{participant.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
                {route.participants.length > 4 && (
                  <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">+{route.participants.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
            <Button 
              onClick={() => onJoinRide?.(routeId)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Join This Ride
            </Button>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="route">Route</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{route.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Highlights</h3>
              <div className="space-y-2">
                {route.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
              <div className="space-y-2">
                {route.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="route" className="space-y-4 mt-4">
            <div className="space-y-3">
              {route.waypoints.map((waypoint, index) => (
                <div key={waypoint.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{getWaypointIcon(waypoint.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{waypoint.name}</h4>
                      <span className="text-sm text-gray-500">{waypoint.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{waypoint.description}</p>
                  </div>
                  {index < route.waypoints.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 mt-1" />
                  )}
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
              <Route className="w-4 h-4 mr-2" />
              View in Maps
            </Button>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4 mt-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Pro Tips</h3>
              <div className="space-y-3">
                {route.tips.map((tip, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="text-sm text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {route.gallery.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  loading="lazy"
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onShareRoute?.(routeId)}
            className="flex-1 border-gray-300"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Route
          </Button>
          <Button
            onClick={() => onJoinRide?.(routeId)}
            className="flex-1 bg-orange-500 hover:bg-orange-600"
          >
            <Users className="w-4 h-4 mr-2" />
            Join Ride
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RouteDetailsModal;