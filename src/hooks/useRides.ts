import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ridesApi } from "@/services/api";
import { AVAILABLE_RIDES, UPCOMING_RIDES, PAST_RIDES, ORGANIZED_RIDES } from "@/data/rides";
import type { Ride, MyRide } from "@/types";

// Flag to switch between mock and real API
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

const fetchRides = async (): Promise<Ride[]> => {
  if (USE_MOCK) return AVAILABLE_RIDES;
  const res = await ridesApi.list();
  return (res.data || []) as unknown as Ride[];
};

const fetchUpcomingRides = async (): Promise<MyRide[]> => {
  if (USE_MOCK) return UPCOMING_RIDES;
  const res = await ridesApi.list({ status: "upcoming", mine: true });
  return (res.data || []) as unknown as MyRide[];
};

const fetchPastRides = async (): Promise<MyRide[]> => {
  if (USE_MOCK) return PAST_RIDES;
  const res = await ridesApi.list({ status: "past", mine: true });
  return (res.data || []) as unknown as MyRide[];
};

const fetchOrganizedRides = async (): Promise<MyRide[]> => {
  if (USE_MOCK) return ORGANIZED_RIDES;
  const res = await ridesApi.list({ status: "organized", mine: true });
  return (res.data || []) as unknown as MyRide[];
};

export const useRides = () =>
  useQuery({
    queryKey: ["rides"],
    queryFn: fetchRides,
    staleTime: 5 * 60 * 1000,
  });

export const useRideById = (id: string) =>
  useQuery({
    queryKey: ["rides", id],
    queryFn: async () => {
      if (USE_MOCK) return null;
      const res = await ridesApi.getById(id);
      return res.data;
    },
    enabled: !!id && !USE_MOCK,
  });

export const useUpcomingRides = () =>
  useQuery({
    queryKey: ["rides", "upcoming"],
    queryFn: fetchUpcomingRides,
    staleTime: 2 * 60 * 1000,
  });

export const usePastRides = () =>
  useQuery({
    queryKey: ["rides", "past"],
    queryFn: fetchPastRides,
    staleTime: 5 * 60 * 1000,
  });

export const useOrganizedRides = () =>
  useQuery({
    queryKey: ["rides", "organized"],
    queryFn: fetchOrganizedRides,
    staleTime: 5 * 60 * 1000,
  });

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
