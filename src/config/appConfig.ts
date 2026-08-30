/**
 * Client configuration, fetched from `GET /api/config`.
 *
 * The server owns the option lists, limits and feature flags. This file holds a
 * bundled copy used as the starting value so the app can render before — or
 * without — that request completing. Config must never block first paint, and a
 * failed fetch must not break the app.
 *
 * The bundled defaults are a fallback, NOT a second source of truth: whenever
 * the server responds, its values win.
 */

export interface AppConfig {
    version: number;
    enums: {
        visibilities: string[];
        vehicleTypes: string[];
        mediaTypes: string[];
        /** Value/label pairs: the value is persisted and validated, the label is display text. */
        rideTypes: { value: string; label: string }[];
        difficulties: string[];
        ridingStyles: string[];
        bikeBrands: string[];
        currencies: string[];
    };
    limits: {
        maxRidesPerPage: number;
        maxCommentLength: number;
        maxBioLength: number;
        maxCaptionLength: number;
        upload: { contentType: string; maxBytes: number }[];
    };
    features: {
        notifications: boolean;
        explore: boolean;
        rideDiscovery: boolean;
        stories: boolean;
        /** Explore sub-sections — each waits on its own backend. */
        crews: boolean;
        mentors: boolean;
        rideMoments: boolean;
        communityInitiatives: boolean;
        invites: boolean;
        passwordReset: boolean;
        travelDiary: boolean;
        locationPlanner: boolean;
    };
}

/**
 * Conservative defaults.
 *
 * Every feature flag is OFF: if the server cannot be reached we would rather
 * hide a screen than show one whose endpoints may not exist. The enums are
 * small, safe subsets — enough to render a form, not a full catalog.
 */
export const FALLBACK_CONFIG: AppConfig = {
    version: 0,
    enums: {
        visibilities: ['public', 'private', 'mutuals', 'invite_only'],
        vehicleTypes: ['bike', 'car', 'all'],
        mediaTypes: ['image', 'video'],
        // Must stay in step with the server's catalog — these are the values a
        // ride is created with if the config fetch has not landed yet.
        rideTypes: [
            { value: 'breakfast', label: 'Breakfast Ride' },
            { value: 'offroad', label: 'Off-road Adventure' },
            { value: 'long', label: 'Long Distance' },
            { value: 'beginner', label: 'Beginner Friendly' },
        ],
        difficulties: ['Easy', 'Moderate', 'Hard'],
        ridingStyles: [],
        bikeBrands: [],
        currencies: ['INR'],
    },
    limits: {
        maxRidesPerPage: 20,
        maxCommentLength: 2000,
        maxBioLength: 500,
        maxCaptionLength: 500,
        upload: [],
    },
    features: {
        notifications: false,
        explore: false,
        rideDiscovery: false,
        stories: false,
        crews: false,
        mentors: false,
        rideMoments: false,
        communityInitiatives: false,
        invites: false,
        passwordReset: false,
        travelDiary: false,
        locationPlanner: false,
    },
};

const STORAGE_KEY = 'ridersturn.config';

/** Last known good config, so a cold start is not stuck on the fallback. */
export function readCachedConfig(): AppConfig | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as AppConfig) : null;
    } catch {
        // Private browsing, quota, or corrupt JSON — the fallback covers it.
        return null;
    }
}

export function cacheConfig(config: AppConfig): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
        // Caching is an optimisation; failing to cache is not an error.
    }
}
