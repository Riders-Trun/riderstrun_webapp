import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Clock, MapPin, Users, AlertCircle, CheckCircle, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import GlobalHeader from "@/components/GlobalHeader";
import { MOCK_NOTIFICATIONS } from "@/data/notifications";
import { mockOr, USE_MOCK } from "@/lib/mock";
import { notificationsApi } from "@/services/api";
import { toNotification, type ApiNotification } from "@/services/adapters";
import { useNavigate } from "react-router-dom";
import type { Notification } from "@/types";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState(mockOr(MOCK_NOTIFICATIONS, []));
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await notificationsApi.list();
      return ((res.data?.notifications ?? []) as ApiNotification[]).map(toNotification);
    },
    enabled: !USE_MOCK,
  });

  useEffect(() => {
    if (data) setNotifications(data);
  }, [data]);

  /** The header badge reads the same count, so it has to be refreshed too. */
  const refreshBadge = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
  };

  const markAllAsRead = async () => {
    // Optimistic: marking read is not worth a spinner, and a failure only means
    // the next load shows them unread again.
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    if (USE_MOCK) return;

    try {
      await notificationsApi.markAllRead();
    } finally {
      refreshBadge();
    }
  };

  /**
   * What the action button does. Every notification the backend sends is about a
   * ride, so the button opens it and marks the row read on the way. Without a
   * ride id there is nowhere to go, so it only marks read.
   */
  const openNotification = (notification: Notification) => {
    if (!notification.isRead) markAsRead(notification.id);
    if (notification.rideId) navigate(`/ride/${encodeURIComponent(notification.rideId)}`);
  };

  const markAsRead = async (id: string | number) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
    if (USE_MOCK) return;

    try {
      await notificationsApi.markRead(String(id));
    } finally {
      refreshBadge();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      // Types the API actually sends.
      case 'ride_join_request': return Users;
      case 'ride_join_approved': return CheckCircle;
      case 'ride_comment': return Bell;
      case 'ride_completed': return CheckCircle;
      case 'connection_request': return Users;
      case 'connection_accepted': return Users;
      // Demo-only categories.
      case 'reminder': return Clock;
      case 'update': return MapPin;
      case 'delay': return AlertCircle;
      case 'new_ride': return Bell;
      case 'rider_joined': return Users;
      default: return Bell;
    }
  };

  const getIconStyle = (type: string) => {
    switch (type) {
      case 'ride_join_request': return 'text-purple-600 bg-purple-50';
      case 'ride_join_approved': return 'text-green-600 bg-green-50';
      case 'ride_comment': return 'text-blue-600 bg-blue-50';
      case 'ride_completed': return 'text-green-600 bg-green-50';
      case 'connection_request': return 'text-purple-600 bg-purple-50';
      case 'connection_accepted': return 'text-green-600 bg-green-50';
      case 'reminder': return 'text-blue-600 bg-blue-50';
      case 'update': return 'text-orange-600 bg-orange-50';
      case 'delay': return 'text-red-500 bg-red-50';
      case 'new_ride': return 'text-green-600 bg-green-50';
      case 'rider_joined': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  return (
    <div className="bg-gray-50">
      <GlobalHeader
        title="Notifications"
        subtitle={`Stay updated on your rides${unreadCount > 0 ? ` · ${unreadCount} new` : ''}`}
        showBack={true}
      />

      <div className="p-3 space-y-4 max-w-2xl mx-auto">
        {/* Unread Section */}
        {unreadNotifications.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                New ({unreadCount})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 h-7 px-2"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Mark all read
              </Button>
            </div>

            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {unreadNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-3.5 bg-orange-50/40 hover:bg-orange-50/70 transition-colors cursor-pointer"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconStyle(notification.type)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900">{notification.title}</h3>
                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>
                            <span className="text-xs text-gray-400 mt-1 block">{notification.time}</span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs h-7 px-3 flex-shrink-0"
                            onClick={(e) => {
                              // The row itself marks read on click; without this
                              // the button would fire that too and double up.
                              e.stopPropagation();
                              openNotification(notification);
                            }}
                          >
                            {notification.action}
                          </Button>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-2" />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Read Section */}
        {readNotifications.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Earlier
              </span>
            </div>

            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {readNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-3.5 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 opacity-60 ${getIconStyle(notification.type)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm text-gray-700">{notification.title}</h3>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
                            <span className="text-xs text-gray-400 mt-1 block">{notification.time}</span>
                          </div>
                          {notification.action !== "Acknowledged" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7 px-3 flex-shrink-0 border-gray-200 text-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                openNotification(notification);
                              }}
                            >
                              {notification.action}
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-400 flex-shrink-0 mt-1">Done</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">All caught up!</h3>
            <p className="text-xs text-gray-500">No new notifications right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
