import type { AppConfig } from "@/config/appConfig";

// In dev, Vite proxy forwards /api to localhost:3000
// In prod, set VITE_API_URL to backend URL
const API_URL = import.meta.env.VITE_API_URL || "";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === "success" && data.data?.accessToken) {
      accessToken = data.data.accessToken;
      return accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

async function request<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean; allowStatuses?: number[] }
): Promise<T> {
  const { skipAuth, allowStatuses, ...fetchOptions } = options || {};

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!skipAuth && accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  // If 401, try refreshing the token once (even if accessToken is null — e.g. after page reload)
  if (res.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
        credentials: "include",
      });
    }
  }

  // Some endpoints answer a non-2xx with a body worth reading rather than an
  // error worth throwing: /api/health reports 503 *and* describes the
  // degradation. Throwing there would leave the caller unable to tell a sick
  // server apart from an absent one.
  if (!res.ok && !allowStatuses?.includes(res.status)) {
    const errorData = await res.json().catch(() => null);
    const message = errorData?.message || `API error: ${res.status} ${res.statusText}`;
    throw new ApiError(message, res.status, errorData);
  }

  return res.json();
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  message?: string;
}

/**
 * The backend wraps every list in an object — `{ rides, meta }`, `{ comments, meta }`,
 * `{ connections, meta }` and so on — while the UI just wants the array. This pulls
 * the named collection out so callers can keep treating `res.data` as a list.
 */
async function requestList<T>(
  endpoint: string,
  key: string,
  options?: RequestInit & { skipAuth?: boolean }
): Promise<ApiResponse<T[]>> {
  const res = await request<ApiResponse<Record<string, unknown>>>(endpoint, options);
  const items = (res.data?.[key] as T[] | undefined) ?? [];
  return { status: res.status, data: items, message: res.message };
}

// Auth API
export const authApi = {
  // `inviteCode` is attribution only: an unknown code is ignored by the server
  // rather than refusing the account.
  signup: (email: string, password: string, inviteCode?: string) =>
    request<ApiResponse<{ accessToken: string; user: { id: number; email: string; role: string } }>>(
      "/api/auth/signup",
      {
        method: "POST",
        body: JSON.stringify({ email, password, ...(inviteCode ? { invite_code: inviteCode } : {}) }),
        skipAuth: true,
      }
    ),
  login: (email: string, password: string) =>
    request<ApiResponse<{ accessToken: string; user: { id: number; email: string; role: string } }>>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }), skipAuth: true }
    ),
  logout: () =>
    request<ApiResponse<null>>("/api/auth/logout", { method: "POST" }),
  // Returns the user alongside the token: the access token is issued by Cognito
  // and carries neither our user id nor our role, so the server is the only
  // authority on identity. Never decode the token to find out who you are.
  refresh: () =>
    request<ApiResponse<{ accessToken: string; user: { id: number; email: string; role: string } }>>(
      "/api/auth/refresh",
      { method: "POST", skipAuth: true }
    ),
  forgotPassword: (email: string) =>
    request<ApiResponse<null>>(
      "/api/auth/forgot-password",
      { method: "POST", body: JSON.stringify({ email }), skipAuth: true }
    ),
  resetPassword: (token: string, newPassword: string) =>
    request<ApiResponse<null>>(
      "/api/auth/reset-password",
      { method: "POST", body: JSON.stringify({ token, newPassword }), skipAuth: true }
    ),
};

// Profile API
export const profileApi = {
  getMyProfile: () =>
    request<ApiResponse<Record<string, unknown>>>("/api/profile"),
  updateProfile: (data: Record<string, unknown>) =>
    request<ApiResponse<Record<string, unknown>>>("/api/profile", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPublicProfile: (username: string) =>
    request<ApiResponse<Record<string, unknown>>>(
      `/api/profile/${encodeURIComponent(username)}`,
      { skipAuth: true }
    ),
};

export const notificationsApi = {
  list: (limit = 20, offset = 0) =>
    request<ApiResponse<{ notifications: unknown[]; meta: { unread: number } }>>(
      `/api/notifications?limit=${limit}&offset=${offset}`
    ),
  // Just the badge — the header needs the number, not the list.
  unreadCount: () =>
    request<ApiResponse<{ unread: number }>>("/api/notifications/unread-count"),
  markRead: (id: string) =>
    request<ApiResponse<null>>(`/api/notifications/${encodeURIComponent(id)}/read`, {
      method: "POST",
    }),
  markAllRead: () =>
    request<ApiResponse<{ updated: number }>>("/api/notifications/read-all", {
      method: "POST",
    }),
};

// Rides API
export const ridesApi = {
  // `mine: true` switches to the caller's own rides (needs a token); the public
  // feed works without one, so auth is only skipped when we are not asking for
  // "my rides" — otherwise the request would 401.
  list: (params?: Record<string, string | boolean>) => {
    const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
    const isMine = params?.mine === true || params?.mine === "true";
    return requestList<Record<string, unknown>>(
      `/api/rides${qs}`,
      "rides",
      isMine ? undefined : { skipAuth: true }
    );
  },
  create: (data: Record<string, unknown>) =>
    request<ApiResponse<Record<string, unknown>>>("/api/rides", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  // No skipAuth: a private ride is only visible to its organizer/participants.
  getById: (id: string) =>
    request<ApiResponse<{ ride: Record<string, unknown>; participants: Record<string, unknown>[] }>>(
      `/api/rides/${encodeURIComponent(id)}`
    ),
  /**
   * Resolve an invite code to the ride it opens.
   *
   * The join endpoint needs a ride id, and someone holding only a trip code has
   * no way to get one — this is that step. Returns identity fields only, and is
   * rate-limited server-side, so it cannot be used to enumerate rides.
   */
  lookupByCode: (code: string) =>
    request<ApiResponse<{ ride: Record<string, unknown> }>>(
      `/api/rides/by-code/${encodeURIComponent(code)}`
    ),
  // `tripCode` is required for invite-only rides and ignored for public ones.
  join: (id: string, tripCode?: string) =>
    request<ApiResponse<Record<string, unknown>>>(
      `/api/rides/${encodeURIComponent(id)}/join`,
      {
        method: "POST",
        ...(tripCode ? { body: JSON.stringify({ trip_code: tripCode }) } : {}),
      }
    ),
  update: (id: string, data: Record<string, unknown>) =>
    request<ApiResponse<Record<string, unknown>>>(`/api/rides/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  /** Withdraw from a ride. Mirrors `join` — DELETE removes what POST created. */
  leave: (id: string) =>
    request<ApiResponse<Record<string, unknown>>>(
      `/api/rides/${encodeURIComponent(id)}/join`,
      { method: "DELETE" }
    ),
  complete: (id: string) =>
    request<ApiResponse<Record<string, unknown>>>(
      `/api/rides/${encodeURIComponent(id)}/complete`,
      { method: "POST" }
    ),
  // No skipAuth: private/invite-only rides need the token to read comments.
  getComments: (id: string) =>
    requestList<Record<string, unknown>>(
      `/api/rides/${encodeURIComponent(id)}/comments`,
      "comments"
    ),
  addComment: (id: string, content: string, parentId?: string) =>
    request<ApiResponse<Record<string, unknown>>>(
      `/api/rides/${encodeURIComponent(id)}/comments`,
      { method: "POST", body: JSON.stringify({ content, parent_id: parentId }) }
    ),
  getMedia: (id: string) =>
    requestList<Record<string, unknown>>(
      `/api/rides/${encodeURIComponent(id)}/media`,
      "media"
    ),
  addMedia: (id: string, mediaUrl: string, mediaType: string, caption?: string) =>
    request<ApiResponse<Record<string, unknown>>>(
      `/api/rides/${encodeURIComponent(id)}/media`,
      { method: "POST", body: JSON.stringify({ media_url: mediaUrl, media_type: mediaType, caption }) }
    ),
};

// Social API
export const socialApi = {
  getConnections: (status?: string) =>
    requestList<Record<string, unknown>>(
      `/api/social/connections${status ? `?status=${encodeURIComponent(status)}` : ""}`,
      "connections"
    ),
  /**
   * Act on a connection, naming the rider by whichever identifier you hold.
   *
   * Suggestions carry a numeric id; search results carry only a username,
   * because the id is internal and the search endpoint does not return it. The
   * API accepts exactly one of the two, so this sends exactly one.
   */
  connectionAction: (target: { userId: number } | { username: string }, action: string) =>
    request<ApiResponse<Record<string, unknown>>>(
      "/api/social/connections",
      {
        method: "POST",
        body: JSON.stringify(
          "userId" in target
            ? { targetUserId: target.userId, action }
            : { targetUsername: target.username, action }
        ),
      }
    ),
  search: (query: string) =>
    requestList<Record<string, unknown>>(
      `/api/social/search?q=${encodeURIComponent(query)}`,
      "users"
    ),
  suggestions: () =>
    requestList<Record<string, unknown>>("/api/social/suggestions", "suggestions"),
  mutuals: (userId: number) =>
    request<ApiResponse<Record<string, unknown>>>(
      `/api/social/mutuals/${userId}`
    ),
};

/**
 * Stories — 24-hour posts from the caller and their connections.
 *
 * A story is addressed by author *and* id: the id alone does not locate it
 * server-side. Every listing returns the author alongside, so this is never
 * something the client has to look up.
 */
export interface ApiStoryItem {
  id: string;
  story_type: "image" | "text";
  content: string;
  caption: string | null;
  background_color: string | null;
  text_color: string | null;
  created_at: string;
  expires_at: string;
  is_viewed: boolean;
}

export interface ApiStoryGroup {
  user_id: number;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_self: boolean;
  all_viewed: boolean;
  items: ApiStoryItem[];
}

export const storiesApi = {
  list: () =>
    request<ApiResponse<{ stories: ApiStoryGroup[] }>>("/api/stories"),
  create: (story: {
    story_type: "image" | "text";
    content: string;
    caption?: string;
    background_color?: string;
    text_color?: string;
  }) =>
    request<ApiResponse<{ story: ApiStoryItem }>>("/api/stories", {
      method: "POST",
      body: JSON.stringify(story),
    }),
  // Idempotent server-side, so this is safe to fire on every slide change.
  markViewed: (authorId: number, storyId: string) =>
    request<ApiResponse<{ viewed: boolean }>>(
      `/api/stories/${authorId}/${encodeURIComponent(storyId)}/view`,
      { method: "POST" }
    ),
  views: (authorId: number, storyId: string) =>
    request<ApiResponse<{ views: number }>>(
      `/api/stories/${authorId}/${encodeURIComponent(storyId)}/views`
    ),
  remove: (authorId: number, storyId: string) =>
    request<ApiResponse<{ deleted: boolean }>>(
      `/api/stories/${authorId}/${encodeURIComponent(storyId)}`,
      { method: "DELETE" }
    ),
};

/**
 * Ride moments — photos from rides that have finished.
 *
 * Assembled server-side from media, rides and participants; nothing is stored
 * as a moment. Readable without a token.
 */
export interface ApiMoment {
  id: string;
  ride_id: string;
  ride_title: string;
  image: string;
  caption: string | null;
  location: string | null;
  date: string;
  participant_count: number;
  rider: {
    user_id: number;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
  tagged_riders: string[];
  tagged_overflow: number;
  next_ride: { id: string; title: string; start_date: string } | null;
}

export const momentsApi = {
  list: (limit?: number) =>
    request<ApiResponse<{ moments: ApiMoment[] }>>(
      `/api/moments${limit ? `?limit=${limit}` : ""}`,
      { skipAuth: true }
    ),
};

/**
 * Travel diary — the caller's own record of trips.
 *
 * Private throughout: there is no route here that takes another rider's id, and
 * somebody else's entry answers 404 rather than 403.
 */
export interface ApiDiaryPhoto {
  id: string;
  entry_id: string;
  photo_url: string;
  caption: string | null;
  created_at: string;
}

export interface ApiDiaryEntry {
  id: string;
  title: string;
  body: string | null;
  location: string | null;
  distance_km: number | null;
  rating: number | null;
  weather: string | null;
  tags: string[];
  entry_date: string;
  ride_id: string | null;
  created_at: string;
  photos: ApiDiaryPhoto[];
  photo_count: number;
}

export interface ApiDiaryStats {
  total_trips: number;
  total_distance_km: number;
  total_photos: number;
  average_rating: number | null;
}

export interface DiaryEntryInput {
  title: string;
  body?: string;
  location?: string;
  distance_km?: number;
  rating?: number;
  weather?: string;
  tags?: string[];
  entry_date: string;
  ride_id?: string;
}

export const diaryApi = {
  list: () => request<ApiResponse<{ entries: ApiDiaryEntry[] }>>("/api/diary"),
  stats: () => request<ApiResponse<{ stats: ApiDiaryStats }>>("/api/diary/stats"),
  photos: () => request<ApiResponse<{ photos: ApiDiaryPhoto[] }>>("/api/diary/photos"),
  create: (entry: DiaryEntryInput) =>
    request<ApiResponse<{ entry: ApiDiaryEntry }>>("/api/diary", {
      method: "POST",
      body: JSON.stringify(entry),
    }),
  update: (id: string, fields: Partial<DiaryEntryInput>) =>
    request<ApiResponse<{ entry: ApiDiaryEntry }>>(`/api/diary/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(fields),
    }),
  remove: (id: string) =>
    request<ApiResponse<{ deleted: boolean }>>(`/api/diary/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  addPhoto: (id: string, photoUrl: string, caption?: string) =>
    request<ApiResponse<{ photo: ApiDiaryPhoto }>>(
      `/api/diary/${encodeURIComponent(id)}/photos`,
      { method: "POST", body: JSON.stringify({ photo_url: photoUrl, caption }) }
    ),
};

/**
 * Crews — an open call for riders, before a ride exists.
 *
 * `looking_for` is how many *more* riders are wanted, not the total: the crew is
 * full at `looking_for + 1`, counting the creator.
 */
export interface ApiCrew {
  id: string;
  creator_id: number;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  title: string;
  description: string | null;
  looking_for: number;
  member_count: number;
  ride_type: string | null;
  time_preference: string | null;
  skill_level: string | null;
  route: string | null;
  speed: string | null;
  ride_date: string | null;
  requirements: string[];
  status: "open" | "closed";
  created_at: string;
}

export interface CrewInput {
  title: string;
  description?: string;
  looking_for: number;
  ride_type?: string;
  time_preference?: string;
  skill_level?: string;
  route?: string;
  speed?: string;
  requirements?: string[];
}

export const crewsApi = {
  list: () =>
    request<ApiResponse<{ crews: ApiCrew[] }>>("/api/crews", { skipAuth: true }),
  get: (id: string) =>
    request<ApiResponse<{ crew: ApiCrew; members: Record<string, unknown>[] }>>(
      `/api/crews/${encodeURIComponent(id)}`
    ),
  create: (crew: CrewInput) =>
    request<ApiResponse<{ crew: ApiCrew }>>("/api/crews", {
      method: "POST",
      body: JSON.stringify(crew),
    }),
  join: (id: string) =>
    request<ApiResponse<{ joined: boolean }>>(`/api/crews/${encodeURIComponent(id)}/join`, {
      method: "POST",
    }),
  leave: (id: string) =>
    request<ApiResponse<{ left: boolean }>>(`/api/crews/${encodeURIComponent(id)}/join`, {
      method: "DELETE",
    }),
};

/**
 * Community initiatives — blood drives, workshops, meetups, charity runs.
 *
 * A sign-up has two strengths: `registered` takes a place against capacity,
 * `interested` does not.
 */
export interface ApiInitiative {
  id: string;
  organizer_id: number;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  organization: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  initiative_type: "blood-donation" | "safety-workshop" | "women-only" | "meetup" | "charity";
  starts_at: string;
  location: string;
  max_participants: number | null;
  registered_count: number;
  interested_count: number;
  registration_deadline: string | null;
  requirements: string[];
  impact: string | null;
  status: "open" | "cancelled";
}

export const initiativesApi = {
  list: () =>
    request<ApiResponse<{ initiatives: ApiInitiative[] }>>("/api/initiatives", { skipAuth: true }),
  get: (id: string) =>
    request<ApiResponse<{
      initiative: ApiInitiative;
      registrations: Record<string, unknown>[];
      my_status: "registered" | "interested" | null;
    }>>(`/api/initiatives/${encodeURIComponent(id)}`),
  signUp: (id: string, status: "registered" | "interested") =>
    request<ApiResponse<{ status: string }>>(
      `/api/initiatives/${encodeURIComponent(id)}/register`,
      { method: "POST", body: JSON.stringify({ status }) }
    ),
  withdraw: (id: string) =>
    request<ApiResponse<{ withdrawn: boolean }>>(
      `/api/initiatives/${encodeURIComponent(id)}/register`,
      { method: "DELETE" }
    ),
};

/**
 * Community — invite codes and mentors.
 *
 * The mentor stats are deliberately sparse: only `rides_organized` and
 * `follower_count` have a source. A rating and a "safety streak" appear on the
 * card's demo data and nothing computes them, so the API does not send them.
 */
export interface ApiMentor {
  user_id: number;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  title: string | null;
  quote: string | null;
  specialties: string[];
  rides_organized: number;
  follower_count: number;
  is_following: boolean;
}

export const communityApi = {
  myInvite: () =>
    request<ApiResponse<{ code: string; invited: number; completed: number }>>(
      "/api/community/invite"
    ),
  mentors: () =>
    request<ApiResponse<{ mentors: ApiMentor[] }>>("/api/community/mentors"),
  followMentor: (mentorId: number) =>
    request<ApiResponse<{ following: boolean }>>(
      `/api/community/mentors/${mentorId}/follow`,
      { method: "POST" }
    ),
  unfollowMentor: (mentorId: number) =>
    request<ApiResponse<{ following: boolean }>>(
      `/api/community/mentors/${mentorId}/follow`,
      { method: "DELETE" }
    ),
};

// Health API
//
// Health endpoints are deliberately unenveloped — they answer with the payload
// at the top level rather than `{ status: 'success', data }` like every other
// route, so a probe never has to unwrap. Typed flat to match; reading `.data`
// off these yields undefined and reports a healthy server as unreachable.
export interface HealthCheck {
  status: string;
  uptime: number;
  timestamp: string;
  memory: {
    rss_mb: number;
    heap_used_mb: number;
    heap_total_mb: number;
    external_mb: number;
  };
  database: { connected: boolean; latency_ms: number };
}

export interface DbHealthCheck {
  status: string;
  connected: boolean;
  latency_ms: number;
  pool: { total: number; idle: number; waiting: number };
}

export const healthApi = {
  // 503 is the degraded answer, not a failure to answer — the body still carries
  // uptime, memory and the database verdict, which is exactly what the admin
  // System tab exists to show. Only a thrown error means genuinely unreachable.
  check: () => request<HealthCheck>("/api/health", { skipAuth: true, allowStatuses: [503] }),
  dbCheck: () =>
    request<DbHealthCheck>("/api/health/db", { skipAuth: true, allowStatuses: [503] }),
  dependencies: () =>
    request<{ status: string; dependencies: unknown[] }>("/api/health/dependencies", {
      skipAuth: true,
      allowStatuses: [503],
    }),
  // Enveloped, unlike the checks above — /api/admin/metrics goes through sendSuccess.
  metrics: () =>
    request<ApiResponse<Record<string, unknown>>>("/api/admin/metrics"),
};

/**
 * Server-owned option lists, limits and feature flags.
 *
 * `skipAuth` because the app needs this before anyone signs in — the sign-in
 * screen itself renders from it.
 */
export const configApi = {
  get: () =>
    request<ApiResponse<AppConfig>>("/api/config", { skipAuth: true }),
};

// Generic API (backward compat)
export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
};
