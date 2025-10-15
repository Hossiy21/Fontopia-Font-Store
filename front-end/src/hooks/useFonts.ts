import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

/**
 * React Query hook for fetching fonts with caching and error handling
 */
export const useFonts = () => {
  return useQuery({
    queryKey: ["fonts"],
    queryFn: () => apiClient.getFonts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
