import { useQuery } from "@tanstack/react-query";
import { AVAILABLE_RIDES, UPCOMING_RIDES, PAST_RIDES, ORGANIZED_RIDES } from "@/data/rides";
import type { Ride, MyRide } from "@/types";

// Simulate API delay for mock data
const simulateDelay = <T>(data: T, ms = 500): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

// When backend is ready, replace these fetch functions with real API calls:
// const fetchRides = () => api.get<Ride[]>("/rides");

const fetchRides = (): Promise<Ride[]> => simulateDelay(AVAILABLE_RIDES);
const fetchUpcomingRides = (): Promise<MyRide[]> => simulateDelay(UPCOMING_RIDES);
const fetchPastRides = (): Promise<MyRide[]> => simulateDelay(PAST_RIDES);
const fetchOrganizedRides = (): Promise<MyRide[]> => simulateDelay(ORGANIZED_RIDES);

export const useRides = () =>
  useQuery({
    queryKey: ["rides"],
    queryFn: fetchRides,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
