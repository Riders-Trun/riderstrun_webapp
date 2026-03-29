
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlobalHeader from "@/components/GlobalHeader";
import { QrCode, Hash, ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SUGGESTED_TRIP_CODES } from "@/constants";

const JoinRideScreen = () => {
  const [tripCode, setTripCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleJoinRideWithCode = async (code: string) => {
    if (!code.trim()) return;
    setIsLoading(true);
    toast({
      title: "🔍 Searching for ride...",
      description: `Looking for ride with code: ${code}`
    });
    // Simulate API call — replace setTimeout with real ridesApi lookup when available
    setTimeout(() => {
      toast({
        title: "🎉 Ride Found!",
        description: "Redirecting to ride details..."
      });
      setIsLoading(false);
      navigate(`/ride/${code}`);
    }, 1500);
  };

  const handleJoinRide = () => handleJoinRideWithCode(tripCode);

  const handleQuickCode = (code: string) => {
    setTripCode(code);
    handleJoinRideWithCode(code);
  };

  const suggestedCodes = [...SUGGESTED_TRIP_CODES];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Global Header */}
      <GlobalHeader 
        title="Join Ride"
        subtitle="Enter trip code to join"
        showBack={true}
        showNotifications={true}
      />

      <div className="p-4 sm:p-6">
        <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <QrCode className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">Join a Ride</CardTitle>
            <p className="text-sm text-gray-600">
              Get the trip code from your ride organizer and enter it below
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                placeholder="Enter trip code (e.g. NH001)"
                value={tripCode}
                onChange={(e) => setTripCode(e.target.value.toUpperCase())}
                className="pl-10 text-center text-lg font-mono tracking-wider border-2 focus:border-orange-300 transition-colors h-12"
                maxLength={6}
              />
            </div>
            
            {/* Enhanced Quick Access Codes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 justify-center">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <p className="text-sm font-medium text-gray-700">Quick access codes</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {suggestedCodes.map((code) => (
                  <Button
                    key={code}
                    variant="outline"
                    size="sm"
                    className="font-mono text-sm h-10 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 hover:scale-105"
                    onClick={() => handleQuickCode(code)}
                    disabled={isLoading}
                  >
                    #{code}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={handleJoinRide} 
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium h-12 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
              disabled={!tripCode.trim() || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Searching...
                </div>
              ) : (
                "Join Ride"
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                Don't have a trip code? Browse available rides or ask your organizer
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JoinRideScreen;
