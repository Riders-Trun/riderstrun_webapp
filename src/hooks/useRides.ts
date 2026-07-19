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

export const useJoinRide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rideId: string) => ridesApi.join(rideId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
};
