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
  options?: RequestInit & { skipAuth?: boolean }
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options || {};

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

  if (!res.ok) {
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
  signup: (email: string, password: string) =>
    request<ApiResponse<{ accessToken: string; user: { id: number; email: string; role: string } }>>(
      "/api/auth/signup",
      { method: "POST", body: JSON.stringify({ email, password }), skipAuth: true }
    ),
  login: (email: string, password: string) =>
    request<ApiResponse<{ accessToken: string; user: { id: number; email: string; role: string } }>>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }), skipAuth: true }
    ),
  logout: () =>
    request<ApiResponse<null>>("/api/auth/logout", { method: "POST" }),
  refresh: () =>
    request<ApiResponse<{ accessToken: string }>>(
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
  join: (id: string) =>
    request<ApiResponse<Record<string, unknown>>>(
      `/api/rides/${encodeURIComponent(id)}/join`,
      { method: "POST" }
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
  connectionAction: (targetUserId: number, action: string) =>
    request<ApiResponse<Record<string, unknown>>>(
      "/api/social/connections",
      { method: "POST", body: JSON.stringify({ targetUserId, action }) }
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

// Health API
export const healthApi = {
  check: () =>
    request<ApiResponse<Record<string, unknown>>>("/api/health", { skipAuth: true }),
  dbCheck: () =>
    request<ApiResponse<Record<string, unknown>>>("/api/health/db", { skipAuth: true }),
  dependencies: () =>
    request<ApiResponse<Record<string, unknown>>>("/api/health/dependencies", { skipAuth: true }),
  metrics: () =>
    request<ApiResponse<Record<string, unknown>>>("/api/admin/metrics"),
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
