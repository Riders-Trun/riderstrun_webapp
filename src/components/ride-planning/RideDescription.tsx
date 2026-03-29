
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RideDescriptionProps {
  description: string;
  onDescriptionChange: (description: string) => void;
}

const RideDescription = ({ description, onDescriptionChange }: RideDescriptionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Additional Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Tell riders what to expect, what to bring, or any special instructions..."
          value={description}
          maxLength={500}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
        />
        <p className="text-xs text-gray-400 mt-1">{description.length}/500</p>
      </CardContent>
    </Card>
  );
};

export default RideDescription;
