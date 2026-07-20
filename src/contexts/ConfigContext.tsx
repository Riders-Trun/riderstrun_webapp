import { createContext, useContext, useEffect, useState } from "react";
import { configApi } from "@/services/api";
import {
  FALLBACK_CONFIG,
  readCachedConfig,
  cacheConfig,
  type AppConfig,
} from "@/config/appConfig";

/**
 * Makes the server's configuration available to the app.
 *
 * Deliberately non-blocking: children render immediately from the cached (or
 * bundled) config while the request is in flight. A config fetch that hangs or
 * fails must never leave the user staring at a spinner — the app simply runs on
 * the last known good values.
 */

interface ConfigContextValue {
  config: AppConfig;
  /** True until the first fetch settles. Rarely needed — the config is usable throughout. */
  isLoading: boolean;
  /** Convenience for the common `config.features.x` check. */
  isEnabled: (feature: keyof AppConfig["features"]) => boolean;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  // Start from cache so a returning user gets their real config on first paint.
  const [config, setConfig] = useState<AppConfig>(() => readCachedConfig() ?? FALLBACK_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    configApi
      .get()
      .then((res) => {
        if (cancelled || res.status !== "success" || !res.data) return;
        setConfig(res.data);
        cacheConfig(res.data);
      })
      .catch(() => {
        // Offline, or the API is down. Keep whatever we already have.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        config,
        isLoading,
        isEnabled: (feature) => config.features[feature],
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
