
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoProps {
  formData: {
    title: string;
    type: string;
    date: string;
    time: string;
  };
  onFormDataChange: (updates: Partial<{ title: string; type: string; date: string; time: string }>) => void;
}

const BasicInfo = ({ formData, onFormDataChange }: BasicInfoProps) => {
  const rideTypes = [
    { value: "breakfast", label: "Breakfast Ride" },
    { value: "offroad", label: "Off-road Adventure" },
    { value: "long", label: "Long Distance" },
    { value: "beginner", label: "Beginner Friendly" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Ride Title</Label>
          <Input
            id="title"
            placeholder="e.g., Nandi Sunrise Sprint"
            value={formData.title}
            maxLength={100}
            onChange={(e) => onFormDataChange({title: e.target.value})}
          />
        </div>
        
        <div>
          <Label htmlFor="type">Ride Type</Label>
          <Select value={formData.type} onValueChange={(value) => onFormDataChange({type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select ride type" />
            </SelectTrigger>
            <SelectContent>
              {rideTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => onFormDataChange({date: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="time">Start Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => onFormDataChange({time: e.target.value})}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfo;
