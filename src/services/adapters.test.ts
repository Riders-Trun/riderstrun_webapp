import { describe, it, expect } from "vitest";
import { toRide, toMyRide, toRideDetail, formatDistance, composeLocation, type ApiRide } from "./adapters";
import { stableSeed } from "@/lib/rideUtils";

/**
 * The fixture mirrors a real row from GET /api/rides, including the quirks that
 * bite in practice: a UUID id, an ISO timestamp, and Postgres handing back
 * COUNT(*) / DECIMAL columns as strings rather than numbers.
 */
const apiRow: ApiRide = {
  id: "9f8c1e2a-7b3d-4c5e-8a1f-2d3e4f5a6b7c",
  title: "Sunrise run to Nandi Hills",
  start_date: "2030-06-01T05:30:00.000Z",
  start_location: "Hebbal Flyover",
  end_location: "Nandi Hills Summit",
  distance_km: "61.4", // DECIMAL → string
  ride_type: "breakfast-ride",
  status: "scheduled",
  max_riders: 20,
  pillion_slots: "3",
  trip_code: "NANDI-7788",
  brand_filter: "Royal Enfield",
  organizer_id: 42,
  organizer_name: "ghost_rider",
  participant_count: "12", // COUNT(*) → bigint string
  created_at: "2026-01-05T10:00:00.000Z",
};

describe("toRide", () => {
  it("maps snake_case columns onto the view model", () => {
    const ride = toRide(apiRow);

    expect(ride.id).toBe(apiRow.id);
    expect(ride.title).toBe("Sunrise run to Nandi Hills");
    expect(ride.organizer).toBe("ghost_rider");
    expect(ride.type).toBe("breakfast-ride");
    expect(ride.location).toBe("Hebbal Flyover → Nandi Hills Summit");
    expect(ride.tripCode).toBe("NANDI-7788");
    expect(ride.brand).toBe("Royal Enfield");
    expect(ride.createdAt).toBe("2026-01-05T10:00:00.000Z");
  });

  it("coerces the string numbers Postgres returns", () => {
    const ride = toRide(apiRow);

    expect(ride.joinedCount).toBe(12);
    expect(typeof ride.joinedCount).toBe("number");
    expect(ride.maxRiders).toBe(20);
    expect(ride.pillionSlots).toBe(3);
    expect(ride.pillionAvailable).toBe(true);
    expect(ride.distance).toBe("61.4 km");
  });

  it("computes isOrganizer from the viewer, not the row", () => {
    expect(toRide(apiRow, 42).isOrganizer).toBe(true);
    expect(toRide(apiRow, 99).isOrganizer).toBe(false);
    // Logged out — nobody is the organizer
    expect(toRide(apiRow).isOrganizer).toBe(false);
  });

  it("leaves fields with no backend source undefined rather than blank", () => {
    const ride = toRide(apiRow);
    expect(ride.distanceFromUser).toBeUndefined();
    expect(ride.rating).toBeUndefined();
    expect(ride.minimumCC).toBeUndefined();
  });

  it("survives a sparse row without throwing", () => {
    const sparse: ApiRide = {
      id: "abc",
      title: "Bare ride",
      start_date: "2030-01-01T00:00:00.000Z",
      start_location: "Somewhere",
    };
    const ride = toRide(sparse);

    expect(ride.organizer).toBe("");
    expect(ride.distance).toBe(""); // no distance_km recorded
    expect(ride.location).toBe("Somewhere"); // no end_location to compose
    expect(ride.joinedCount).toBe(0);
    expect(ride.pillionAvailable).toBe(false);
  });
});

describe("toMyRide", () => {
  it("carries status and organizer ownership", () => {
    const mine = toMyRide(apiRow, 42);

    expect(mine.id).toBe(apiRow.id);
    expect(mine.status).toBe("scheduled");
    expect(mine.isCurrentUserOrganizer).toBe(true);
    expect(mine.joinedCount).toBe(12);
    expect(toMyRide(apiRow, 7).isCurrentUserOrganizer).toBe(false);
  });
});

describe("toRideDetail", () => {
  it("maps the fields the details screen can actually show", () => {
    const detail = toRideDetail(apiRow, [], 42);

    expect(detail.title).toBe("Sunrise run to Nandi Hills");
    expect(detail.startLocation).toBe("Hebbal Flyover");
    expect(detail.destination).toBe("Nandi Hills Summit");
    expect(detail.status).toBe("scheduled");
    expect(detail.isOrganizer).toBe(true);
    expect(detail.startTime).toMatch(/[AP]M$/);
    expect(detail.difficulty).toBe("Moderate"); // 61.4 km → 50..100
  });

  it("counts participants from the participants array when present", () => {
    const detail = toRideDetail(apiRow, [{ username: "a" }, { username: "b" }]);
    expect(detail.participantCount).toBe(2);
  });

  it("omits every section the backend cannot supply", () => {
    // These drive whole UI blocks; they must be absent, not faked, so the
    // screen hides those sections instead of rendering invented data.
    const detail = toRideDetail(apiRow) as Record<string, unknown>;

    for (const field of [
      "costs",
      "route",
      "weather",
      "safetyGear",
      "schedule",
      "rules",
      "previousTrips",
      "reviews",
      "organizerRating",
      "organizerRides",
      "organizerPhone",
    ]) {
      expect(detail[field], `${field} must not be invented`).toBeUndefined();
    }
  });

  it("derives difficulty across the distance buckets", () => {
    expect(toRideDetail({ ...apiRow, distance_km: 30 }).difficulty).toBe("Easy");
    expect(toRideDetail({ ...apiRow, distance_km: 150 }).difficulty).toBe("Hard");
    expect(toRideDetail({ ...apiRow, distance_km: null }).difficulty).toBe("");
  });
});

describe("formatting helpers", () => {
  it("formats distance only when present", () => {
    expect(formatDistance(80)).toBe("80 km");
    expect(formatDistance("61.4")).toBe("61.4 km");
    expect(formatDistance(null)).toBe("");
    expect(formatDistance(undefined)).toBe("");
  });

  it("composes the location from whichever endpoints exist", () => {
    expect(composeLocation("A", "B")).toBe("A → B");
    expect(composeLocation("A", null)).toBe("A");
    expect(composeLocation(null, "B")).toBe("B");
    expect(composeLocation(null, null)).toBe("");
  });

  it("renders relative dates for today and tomorrow", () => {
    const today = new Date();
    today.setHours(6, 0, 0, 0);
    expect(toRide({ ...apiRow, start_date: today.toISOString() }).date).toMatch(/^Today, /);

    const tomorrow = new Date(Date.now() + 86_400_000);
    tomorrow.setHours(6, 0, 0, 0);
    expect(toRide({ ...apiRow, start_date: tomorrow.toISOString() }).date).toMatch(/^Tomorrow, /);
  });

  it("does not produce 'Invalid Date' for a missing timestamp", () => {
    const ride = toRide({ ...apiRow, start_date: "" });
    expect(ride.date).toBe("");
  });
});

describe("stableSeed", () => {
  it("turns a UUID into a stable non-negative number", () => {
    const seed = stableSeed(apiRow.id);
    expect(Number.isFinite(seed)).toBe(true);
    expect(seed).toBeGreaterThanOrEqual(0);
    // Deterministic — the same ride must not change rating/photos between renders
    expect(stableSeed(apiRow.id)).toBe(seed);
  });

  it("still handles the numeric ids mock data uses", () => {
    expect(stableSeed(7)).toBe(7);
  });

  it("keeps derived placeholders in range for UUIDs", () => {
    // The RideCard placeholders: `4.${(seed % 4) + 5}`, photos, stops
    const seed = stableSeed(apiRow.id);
    expect((seed % 4) + 5).toBeGreaterThanOrEqual(5);
    expect((seed % 4) + 5).toBeLessThanOrEqual(8);
    expect(((seed * 7) % 30) + 10).toBeGreaterThanOrEqual(10);
    expect((seed % 3) + 1).toBeGreaterThanOrEqual(1);
  });
});
