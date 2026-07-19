import { mockOr } from "@/lib/mock";

import { Badge } from "@/components/ui/badge";

const TrendingSection = () => {
  // "Trending" is a claim about real activity, and nothing computes it — there
  // is no endpoint behind this. Empty outside mock mode rather than presenting a
  // curated list as if it were measured.
  const trendingDestinations = mockOr(
    [
      { name: "Nandi Hills", emoji: "🌄" },
      { name: "Coorg", emoji: "☕" },
      { name: "Chikmagalur", emoji: "🏔️" },
      { name: "Wayanad", emoji: "🌿" },
      { name: "Hampi", emoji: "🏛️" },
      { name: "Gokarna", emoji: "🏖️" },
    ],
    []
  );

  return (
    <div className="p-4 pb-2 bg-white/50">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-bold text-gray-900">🔥 Trending This Weekend</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-orange-300 to-transparent"></div>
      </div>
      <div className="flex flex-wrap gap-2">
        {trendingDestinations.map((destination) => (
          <Badge 
            key={destination.name}
            variant="outline" 
            className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 text-orange-700 hover:from-orange-100 hover:to-orange-200 transition-all cursor-pointer hover:scale-105"
          >
            <span className="mr-1">{destination.emoji}</span>
            {destination.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
