import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, setAccessToken } from "@/services/api";

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Try to restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await authApi.refresh();
        if (res.status === "success" && res.data) {
          setAccessToken(res.data.accessToken);

          // Take the user from the response, never from the token.
          //
          // This used to decode the JWT payload, which worked only while the
          // server signed its own tokens. Cognito tokens carry no `role` and a
          // `sub` that is Cognito's UUID rather than our user id, so decoding
          // silently produced a user with role `undefined` — losing admin
          // access on every page refresh while login still appeared to work.
          if (res.data.user) {
            setUser(res.data.user);
          } else {
            setAccessToken(null);
          }
        }
      } catch {
        // No valid session
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    if (res.status === "success" && res.data) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
    } else {
      throw new Error(res.message || "Login failed");
    }
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const res = await authApi.signup(email, password);
    if (res.status === "success" && res.data) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
    } else {
      throw new Error(res.message || "Signup failed");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Logout even if API fails
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
