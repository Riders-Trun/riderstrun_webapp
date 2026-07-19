/**
 * Whether the app renders built-in demo data instead of talking to the API.
 *
 * Single source of truth for the flag: it used to be read inline in one hook,
 * while every other screen imported demo data unconditionally — so turning
 * mocks "off" still left the UI full of fake rides, riders and notifications.
 *
 * Defaults to ON so the app runs standalone with no backend. Set
 * VITE_USE_MOCK=false to see real data, and empty states wherever an endpoint
 * does not exist yet.
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

/**
 * Return demo data only in mock mode, otherwise the real (usually empty) value.
 *
 * Keeps the intent legible at the call site — `mockOr(MENTORS, [])` reads as
 * "mentors are demo-only" — and makes every remaining piece of fake data
 * greppable in one step.
 */
export function mockOr<T>(demo: T, real: T): T {
    return USE_MOCK ? demo : real;
}
