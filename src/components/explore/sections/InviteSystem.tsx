import { useState } from "react";
import { Share2, QrCode, Copy, Gift, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InviteSystemProps {
  userInviteCode: string;
  communityPoints: number;
  invitedRiders: number;
  completedInvites: number;
  onGenerateCode?: () => void;
  onShareCode?: (method: string) => void;
}

const InviteSystem = ({ 
  userInviteCode, 
  communityPoints, 
  invitedRiders, 
  completedInvites,
  onGenerateCode,
  onShareCode 
}: InviteSystemProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Join Weekend Wheels Unite with my invite code: ${userInviteCode}\nDownload the app: https://weekendwheels.app/invite/${userInviteCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const inviteLink = `https://weekendwheels.app/invite/${userInviteCode}`;
  const inviteMessage = `🏍️ Join me on Weekend Wheels Unite!\n\nDiscover amazing rides, connect with fellow riders, and explore new routes together.\n\nUse my invite code: ${userInviteCode}\n\nDownload: ${inviteLink}`;

  const shareOptions = [
    { 
      name: "WhatsApp", 
      color: "bg-green-500", 
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(inviteMessage)}`) 
    },
    { 
      name: "Telegram", 
      color: "bg-blue-500", 
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(inviteMessage)}`) 
    },
    { 
      name: "SMS", 
      color: "bg-gray-500", 
      action: () => window.open(`sms:?body=${encodeURIComponent(inviteMessage)}`) 
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Invite Fellow Riders</h2>
        <p className="text-gray-600 text-sm">
          Grow the community and earn rewards for bringing quality riders to the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{communityPoints}</div>
          <div className="text-xs text-gray-600">Community Points</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{invitedRiders}</div>
          <div className="text-xs text-gray-600">Riders Invited</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{completedInvites}</div>
          <div className="text-xs text-gray-600">Active Riders</div>
        </div>
      </div>

      {/* Invite Code */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Invite Code
        </label>
        <div className="flex gap-2">
          <Input
            value={userInviteCode}
            readOnly
            className="flex-1 font-mono text-center text-lg font-bold bg-gray-50"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className={cn(
              "px-3",
              copied && "bg-green-50 border-green-200 text-green-600"
            )}
          >
            {copied ? "✓" : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Rewards Info */}
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="w-5 h-5 text-orange-600" />
          <span className="font-semibold text-orange-900">Reward System</span>
        </div>
        <div className="space-y-1 text-sm text-orange-800">
          <div className="flex items-center justify-between">
            <span>• Invite a rider:</span>
            <Badge variant="outline" className="border-orange-300 text-orange-700">+50 points</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>• They complete 3 rides:</span>
            <Badge variant="outline" className="border-green-300 text-green-700">+200 points</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>• Bonus streak for both:</span>
            <Badge variant="outline" className="border-blue-300 text-blue-700">+7 days</Badge>
          </div>
        </div>
      </div>

      {/* Share Options */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Share Your Invite
        </label>
        <div className="grid grid-cols-3 gap-3">
          {shareOptions.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => {
                option.action();
                onShareCode?.(option.name.toLowerCase());
              }}
              className="flex flex-col items-center gap-2 h-16 border-gray-200 hover:bg-gray-50"
            >
              <div className={cn("w-6 h-6 rounded flex items-center justify-center", option.color)}>
                <Share2 className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs">{option.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* QR Code Section */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => onShareCode?.("qr")}
          className="w-full border-gray-200 hover:bg-gray-50"
        >
          <QrCode className="w-4 h-4 mr-2" />
          Generate QR Code
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Perfect for sharing at meetups and events
        </p>
      </div>

      {/* Community Message */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-900">Community Goal</span>
        </div>
        <p className="text-sm text-blue-800">
          "Expose potential. Bring more riders to the tribe."
        </p>
        <p className="text-xs text-blue-700 mt-1">
          Help us build a community of quality riders who prioritize safety, respect, and adventure.
        </p>
      </div>
    </div>
  );
};

export default InviteSystem;