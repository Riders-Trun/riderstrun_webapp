import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Star } from "lucide-react";
import type { PastGroup } from "@/data/rideDiscovery";

interface OverviewTabProps {
  pastGroups: PastGroup[];
  tips: string[];
}

const OverviewTab = ({ pastGroups, tips }: OverviewTabProps) => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-500" />
          Recent Completions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pastGroups.map((group) => (
          <div key={group.id} className="border rounded-lg p-3 bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium text-sm">{group.organizer}</div>
                <div className="text-xs text-gray-500">
                  {group.date} • {group.participants} riders
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium">{group.rating}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {(group.highlights ?? []).map((highlight, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs bg-white">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pro Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shrink-0"></div>
              <p className="text-sm text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default OverviewTab;
