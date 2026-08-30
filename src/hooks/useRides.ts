import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ridesApi } from "@/services/api";
import { toRide, toMyRide, toRideDetail, type ApiRide, type ApiParticipant } from "@/services/adapters";
import { useAuth } from "@/contexts/AuthContext";
import { AVAILABLE_RIDES, UPCOMING_RIDES, PAST_RIDES, ORGANIZED_RIDES } from "@/data/rides";
import type { Ride, MyRide } from "@/types";

// Flag to switch between mock and real API
// Shared with every other screen — see src/lib/mock.ts. This used to be the
// only place the flag was read, which is why turning mocks off still left the
// rest of the UI full of demo data.
import { USE_MOCK } from "@/lib/mock";

// The API speaks snake_case rows; the UI renders view models. Everything that
// crosses that boundary goes through the adapters rather than being cast.
const fetchRides = async (userId?: number): Promise<Ride[]> => {
  if (USE_MOCK) return AVAILABLE_RIDES;
  const res = await ridesApi.list();
  return ((res.data ?? []) as unknown as ApiRide[]).map((r) => toRide(r, userId));
};

const fetchMyRides = async (bucket: string, userId?: number): Promise<MyRide[]> => {
  const res = await ridesApi.list({ status: bucket, mine: true });
  return ((res.data ?? []) as unknown as ApiRide[]).map((r) => toMyRide(r, userId));
};

export const useRides = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["rides", user?.id],
    queryFn: () => fetchRides(user?.id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRideById = (id: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["rides", id, user?.id],
    queryFn: async () => {
      if (USE_MOCK) return null;
      // The endpoint returns { ride, participants }; the screen wants a view model
      const res = await ridesApi.getById(id);
      if (!res.data?.ride) return null;
      return toRideDetail(
        res.data.ride as unknown as ApiRide,
        (res.data.participants ?? []) as unknown as ApiParticipant[],
        user?.id
      );
    },
    enabled: !!id && !USE_MOCK,
  });
};

/** Shared by the three My Rides buckets — each hits ?mine=true&status=<bucket>. */
const useMyRides = (bucket: "upcoming" | "past" | "organized", fallback: MyRide[], staleTime: number) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["rides", bucket, user?.id],
    queryFn: () => (USE_MOCK ? Promise.resolve(fallback) : fetchMyRides(bucket, user?.id)),
    staleTime,
  });
};

export const useUpcomingRides = () => useMyRides("upcoming", UPCOMING_RIDES, 2 * 60 * 1000);
export const usePastRides = () => useMyRides("past", PAST_RIDES, 5 * 60 * 1000);
export const useOrganizedRides = () => useMyRides("organized", ORGANIZED_RIDES, 5 * 60 * 1000);

export const useCreateRide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => ridesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
};

export const useUpdateRide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      ridesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
};

export const useJoinRide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // `tripCode` is only needed for invite-only rides; the server ignores it otherwise.
    mutationFn: ({ rideId, tripCode }: { rideId: string; tripCode?: string }) =>
      ridesApi.join(rideId, tripCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
};

export const useLeaveRide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rideId: string) => ridesApi.leave(rideId),
    onSuccess: () => {
      // Invalidate the whole tree: leaving changes the My Rides buckets and the
      // participant count shown on the public feed and the detail screen.
      queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
};

/**
 * Look up a ride by its invite code.
 *
 * A mutation rather than a query: it runs when the rider submits a code, not on
 * render, and firing a rate-limited lookup on every keystroke would burn the
 * budget the server sets aside for a real attempt.
 */
export const useRideByTripCode = () =>
  useMutation({
    mutationFn: async (code: string) => {
      const res = await ridesApi.lookupByCode(code);
      const ride = res.data?.ride;
      if (!ride) throw new Error("No ride found for that trip code");
      return ride as { id: string; title?: string };
    },
  });
