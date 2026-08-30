
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RouteDetailsProps {
  formData: {
    startPoint: string;
    destination: string;
    maxRiders: string;
  };
  onFormDataChange: (updates: Partial<{ startPoint: string; destination: string; maxRiders: string }>) => void;
  /** Field name → message, from validateRideForm. Empty until a publish is attempted. */
  errors?: Record<string, string>;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-xs text-red-600 mt-1">{message}</p> : null;

const RouteDetails = ({ formData, onFormDataChange, errors = {} }: RouteDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Route Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="startPoint">Start Point</Label>
          <Input
            id="startPoint"
            placeholder="e.g., Cubbon Park, Bangalore"
            value={formData.startPoint}
            onChange={(e) => onFormDataChange({startPoint: e.target.value})}
            aria-invalid={Boolean(errors.startPoint)}
          />
          <FieldError message={errors.startPoint} />
        </div>
        
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            placeholder="e.g., Nandi Hills"
            value={formData.destination}
            onChange={(e) => onFormDataChange({destination: e.target.value})}
            aria-invalid={Boolean(errors.destination)}
          />
          <FieldError message={errors.destination} />
        </div>

        <div>
          <Label htmlFor="maxRiders">Maximum Riders</Label>
          <Input
            id="maxRiders"
            type="number"
            min={2}
            max={50}
            placeholder="Leave blank for no limit"
            value={formData.maxRiders}
            onChange={(e) => onFormDataChange({maxRiders: e.target.value})}
            aria-invalid={Boolean(errors.maxRiders)}
          />
          <FieldError message={errors.maxRiders} />
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteDetails;
