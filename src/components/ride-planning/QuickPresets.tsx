
import { Utensils, Mountain, Route, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PresetData } from "@/types";

interface PresetRide {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  preset: {
    title: string;
    type: string;
    time: string;
    maxRiders: string;
    description: string;
    pitStops: string[];
    rules: string[];
  };
}

interface QuickPresetsProps {
  onPresetSelect: (preset: PresetData) => void;
}

const QuickPresets = ({ onPresetSelect }: QuickPresetsProps) => {
  const presetRides: PresetRide[] = [
    {
      id: "breakfast",
      title: "Breakfast Ride",
      icon: Utensils,
      color: "bg-orange-100 text-orange-600",
      preset: {
        title: "Weekend Breakfast Ride",
        type: "breakfast",
        time: "06:00",
        maxRiders: "12",
        description: "Join us for a scenic morning ride followed by delicious breakfast at a cozy cafe.",
        pitStops: ["breakfast", "fuel"],
        rules: ["Helmet mandatory for all riders", "No stunts or reckless riding", "Stay with the group at all times"]
      }
    },
    {
      id: "offroad",
      title: "Off-road Adventure",
      icon: Mountain,
      color: "bg-green-100 text-green-600",
      preset: {
        title: "Trail Adventure",
        type: "offroad",
        time: "07:00",
        maxRiders: "8",
        description: "Explore dirt trails and scenic off-road paths. Intermediate riding skills recommended.",
        pitStops: ["fuel", "scenic"],
        rules: ["Helmet mandatory for all riders", "Off-road capable bike required", "Follow trail etiquette", "Stay with the group at all times"]
      }
    },
    {
      id: "long",
      title: "Long Distance",
      icon: Route,
      color: "bg-blue-100 text-blue-600",
      preset: {
        title: "Highway Cruise",
        type: "long",
        time: "05:30",
        maxRiders: "15",
        description: "Long distance highway ride for experienced riders. Multiple pit stops planned.",
        pitStops: ["fuel", "breakfast", "scenic"],
        rules: ["Helmet mandatory for all riders", "Fuel up before the ride starts", "Highway riding experience required", "Stay with the group at all times"]
      }
    },
    {
      id: "beginner",
      title: "Beginner Friendly",
      icon: Zap,
      color: "bg-purple-100 text-purple-600",
      preset: {
        title: "New Rider Welcome",
        type: "beginner",
        time: "08:00",
        maxRiders: "6",
        description: "Perfect for new riders! Short, easy route with experienced guides to help you learn.",
        pitStops: ["breakfast"],
        rules: ["Helmet mandatory for all riders", "No stunts or reckless riding", "Guides will assist new riders", "Stay with the group at all times"]
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Start Options</CardTitle>
        <p className="text-sm text-gray-600">Choose a preset to auto-fill your ride details</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {presetRides.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                onClick={() => onPresetSelect(preset.preset)}
                className={`p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors ${preset.color}`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium text-center">{preset.title}</div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickPresets;
