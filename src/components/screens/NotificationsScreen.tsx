
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Clock, MapPin, Users, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import GlobalHeader from "@/components/GlobalHeader";
import { MOCK_NOTIFICATIONS } from "@/data/notifications";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder': return Clock;
      case 'update': return MapPin;
      case 'delay': return AlertCircle;
      case 'new_ride': return Bell;
      case 'rider_joined': return Users;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'text-blue-600 bg-gradient-to-br from-blue-100 to-blue-200';
      case 'update': return 'text-orange-600 bg-gradient-to-br from-orange-100 to-orange-200';
      case 'delay': return 'text-red-600 bg-gradient-to-br from-red-100 to-red-200';
      case 'new_ride': return 'text-green-600 bg-gradient-to-br from-green-100 to-green-200';
      case 'rider_joined': return 'text-purple-600 bg-gradient-to-br from-purple-100 to-purple-200';
      default: return 'text-gray-600 bg-gradient-to-br from-gray-100 to-gray-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <GlobalHeader 
        title="Notifications"
        subtitle={`Stay updated on your rides${unreadCount > 0 ? ` • ${unreadCount} new` : ''}`}
        showBack={true}
      />

      <div className="p-3 space-y-3">
        {/* Actions */}
        <div className="flex justify-end mb-4">
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="hover:bg-orange-50 hover:text-orange-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark all
            </Button>
          )}
        </div>
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type);
            
            return (
              <Card 
                key={notification.id} 
                className={`transition-all duration-300 hover:shadow-lg hover:scale-[1.01] border-0 shadow-md bg-white/90 backdrop-blur-sm ${
                  !notification.isRead ? 'ring-2 ring-orange-200 bg-orange-50/50' : ''
                }`}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${colorClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900">{notification.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{notification.message}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-xs text-gray-500 font-medium">{notification.time}</span>
                            {!notification.isRead && (
                              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant={notification.action === "Acknowledged" ? "secondary" : "default"}
                          className={
                            notification.action !== "Acknowledged" 
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105" 
                              : "bg-gray-100 text-gray-600"
                          }
                          disabled={notification.action === "Acknowledged"}
                        >
                          {notification.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="p-8 text-center shadow-lg bg-white/90 backdrop-blur-sm border-0">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
