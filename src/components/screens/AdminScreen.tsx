import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Bike,
  MapPin,
  Activity,
  Shield,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader,
  BarChart3,
  Database,
  Globe,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { healthApi, api } from "@/services/api";

// Admin API calls
const adminApi = {
  getUsers: () =>
    api.get<{ status: string; data: { users: AdminUser[]; meta: { total: number; limit: number; offset: number } } }>("/api/admin/users"),
  getRides: () =>
    api.get<{ status: string; data: { rides: AdminRide[]; meta: { total: number; limit: number; offset: number } } }>(
      "/api/admin/rides"
    ),
  getStats: () =>
    api.get<{ status: string; data: { stats: DashboardStats } }>("/api/admin/stats"),
  toggleUserBlock: (userId: number, block: boolean) =>
    api.post<{ status: string }>(`/api/admin/users/${userId}/${block ? "block" : "unblock"}`, {}),
  updateRideStatus: (rideId: string, status: string) =>
    api.put<{ status: string }>(`/api/admin/rides/${rideId}`, { status }),
  deleteRide: (rideId: string) =>
    api.delete<{ status: string }>(`/api/admin/rides/${rideId}`),
};

interface AdminUser {
  id: number;
  email: string;
  role: string;
  is_blocked: boolean;
  created_at: string;
  username?: string;
  full_name?: string;
  city?: string;
}

interface AdminRide {
  id: string;
  title: string;
  organizer_name: string;
  start_date: string;
  start_location: string;
  status: string;
  participant_count: number;
  max_riders: number | null;
}

interface DashboardStats {
  totalUsers: number;
  totalRides: number;
  activeRides: number;
  completedRides: number;
  totalConnections: number;
  newUsersThisWeek: number;
}

interface HealthData {
  status: string;
  data?: {
    status: string;
    uptime: number;
    memory: {
      rss_mb: number;
      heap_used_mb: number;
      heap_total_mb: number;
    };
  };
}

const AdminScreen = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userSearch, setUserSearch] = useState("");
  const [rideSearch, setRideSearch] = useState("");
  const queryClient = useQueryClient();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-orange-400" />
            <div>
              <h1 className="text-lg font-bold">RidersTurn Admin</h1>
              <p className="text-xs text-gray-400">Management Dashboard</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => navigate("/")}
          >
            Back to App
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard" className="gap-1">
              <BarChart3 className="w-4 h-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1">
              <Users className="w-4 h-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="rides" className="gap-1">
              <Bike className="w-4 h-4" /> Rides
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-1">
              <Activity className="w-4 h-4" /> System
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UsersTab search={userSearch} onSearchChange={setUserSearch} />
          </TabsContent>

          {/* Rides Tab */}
          <TabsContent value="rides">
            <RidesTab search={rideSearch} onSearchChange={setRideSearch} />
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <SystemTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Dashboard Tab
const DashboardTab = () => {
  const { data: statsRes, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminApi.getStats,
    retry: false,
  });

  const stats = statsRes?.data?.stats;

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers ?? "—", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Total Rides", value: stats?.totalRides ?? "—", icon: Bike, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Active Rides", value: stats?.activeRides ?? "—", icon: Activity, color: "text-green-500", bg: "bg-green-50" },
    { label: "Completed", value: stats?.completedRides ?? "—", icon: CheckCircle, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Connections", value: stats?.totalConnections ?? "—", icon: Globe, color: "text-cyan-500", bg: "bg-cyan-50" },
    { label: "New This Week", value: stats?.newUsersThisWeek ?? "—", icon: Users, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!stats && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <div>
              <p className="font-medium text-amber-800">Admin API endpoints needed</p>
              <p className="text-sm text-amber-600">
                Create <code className="bg-amber-100 px-1 rounded">/api/admin/stats</code>,{" "}
                <code className="bg-amber-100 px-1 rounded">/api/admin/users</code>, and{" "}
                <code className="bg-amber-100 px-1 rounded">/api/admin/rides</code> in the backend.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Users Tab
const UsersTab = ({ search, onSearchChange }: { search: string; onSearchChange: (v: string) => void }) => {
  const queryClient = useQueryClient();
  const { data: usersRes, isLoading, error } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminApi.getUsers,
    retry: false,
  });

  const blockMutation = useMutation({
    mutationFn: ({ userId, block }: { userId: number; block: boolean }) =>
      adminApi.toggleUserBlock(userId, block),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  const users = usersRes?.data?.users || [];
  const filteredUsers = users.filter(
    (u) =>
      !search ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search users by email, username, or name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["admin", "users"] })}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {error && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-sm text-amber-700">
            Admin users endpoint not available yet. Add <code className="bg-amber-100 px-1 rounded">GET /api/admin/users</code> to the backend.
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-48" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <Card key={user.id} className={user.is_blocked ? "border-red-200 bg-red-50" : ""}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">
                      {(user.full_name || user.email)[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {user.full_name || user.email}
                      </span>
                      {user.username && (
                        <span className="text-xs text-gray-400">@{user.username}</span>
                      )}
                      <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {user.role}
                      </Badge>
                      {user.is_blocked && (
                        <Badge variant="destructive" className="text-xs">Blocked</Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.email} {user.city && `• ${user.city}`} • Joined{" "}
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button
                  variant={user.is_blocked ? "outline" : "destructive"}
                  size="sm"
                  className="text-xs"
                  onClick={() =>
                    blockMutation.mutate({ userId: user.id, block: !user.is_blocked })
                  }
                  disabled={user.role === "admin"}
                >
                  {user.is_blocked ? "Unblock" : "Block"}
                </Button>
              </CardContent>
            </Card>
          ))}
          {filteredUsers.length === 0 && !error && (
            <p className="text-center text-gray-500 py-8">No users found</p>
          )}
        </div>
      )}
    </div>
  );
};

// Rides Tab
const RidesTab = ({ search, onSearchChange }: { search: string; onSearchChange: (v: string) => void }) => {
  const queryClient = useQueryClient();
  const { data: ridesRes, isLoading, error } = useQuery({
    queryKey: ["admin", "rides"],
    queryFn: adminApi.getRides,
    retry: false,
  });

  const cancelRide = useMutation({
    mutationFn: (rideId: string) => adminApi.updateRideStatus(rideId, "cancelled"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "rides"] }),
  });

  const rides = ridesRes?.data?.rides || [];
  const filteredRides = rides.filter(
    (r) =>
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.organizer_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.start_location?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "ongoing": return "bg-green-100 text-green-700";
      case "completed": return "bg-gray-100 text-gray-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search rides by title, organizer, or location..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["admin", "rides"] })}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {error && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-sm text-amber-700">
            Admin rides endpoint not available yet. Add <code className="bg-amber-100 px-1 rounded">GET /api/admin/rides</code> to the backend.
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-64" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredRides.map((ride) => (
            <Card key={ride.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{ride.title}</span>
                    <Badge className={`text-xs ${getStatusColor(ride.status)}`}>
                      {ride.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {ride.organizer_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {ride.start_location}
                    </span>
                    <span>
                      {new Date(ride.start_date).toLocaleDateString()}
                    </span>
                    <span>
                      {ride.participant_count}
                      {ride.max_riders ? `/${ride.max_riders}` : ""} riders
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {ride.status === "scheduled" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-red-500 border-red-200"
                      disabled={cancelRide.isPending}
                      onClick={() => cancelRide.mutate(ride.id)}
                    >
                      {cancelRide.isPending ? "Cancelling..." : "Cancel"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredRides.length === 0 && !error && (
            <p className="text-center text-gray-500 py-8">No rides found</p>
          )}
        </div>
      )}
    </div>
  );
};

// System Tab
const SystemTab = () => {
  const { data: healthRes, isLoading: healthLoading, refetch: refetchHealth } = useQuery({
    queryKey: ["admin", "health"],
    queryFn: healthApi.check,
    refetchInterval: 30000,
  });

  const { data: dbRes, isLoading: dbLoading } = useQuery({
    queryKey: ["admin", "health", "db"],
    queryFn: healthApi.dbCheck,
    refetchInterval: 30000,
  });

  const { data: metricsRes } = useQuery({
    queryKey: ["admin", "metrics"],
    queryFn: healthApi.metrics,
    retry: false,
  });

  const health = (healthRes as HealthData)?.data;
  const db = (dbRes as unknown as { status: string; data?: { connected: boolean; latency_ms: number; pool: { total: number; idle: number; waiting: number } } })?.data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">System Health</h2>
        <Button variant="outline" size="sm" onClick={() => refetchHealth()}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* API Health */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" /> API Server
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : health ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {health.status === "up" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="font-medium">Status: {health.status}</span>
                </div>
                <div className="text-gray-500">
                  Uptime: {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m
                </div>
                <div className="text-gray-500">
                  Memory: {health.memory.heap_used_mb.toFixed(1)}MB / {health.memory.heap_total_mb.toFixed(1)}MB
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500">
                <XCircle className="w-4 h-4" />
                <span>API server unreachable</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Health */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="w-4 h-4" /> Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dbLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : db ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {db.connected ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="font-medium">
                    {db.connected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="text-gray-500">Latency: {db.latency_ms}ms</div>
                {db.pool && (
                  <div className="text-gray-500">
                    Pool: {db.pool.idle} idle / {db.pool.total} total / {db.pool.waiting} waiting
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500">
                <XCircle className="w-4 h-4" />
                <span>Database unreachable</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* API Metrics */}
      {metricsRes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> API Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-64">
              {JSON.stringify(metricsRes, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminScreen;
