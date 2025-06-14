
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useCallback } from 'react';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  cacheTime?: number;
  staleTime?: number;
}

export const useOptimizedQuery = <T>(
  queryKey: any[],
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
) => {
  const {
    cacheTime = 10 * 60 * 1000, // 10 minutes
    staleTime = 5 * 60 * 1000,  // 5 minutes
    retry = 3,
    retryDelay = (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...restOptions
  } = options;

  return useQuery({
    queryKey,
    queryFn,
    gcTime: cacheTime,
    staleTime,
    retry,
    retryDelay,
    ...restOptions
  });
};

// Hook pour les requêtes avec pagination
export const usePaginatedQuery = <T>(
  baseKey: string,
  queryFn: (page: number, limit: number) => Promise<T>,
  page: number = 1,
  limit: number = 10,
  options: OptimizedQueryOptions<T> = {}
) => {
  const queryKey = [baseKey, 'paginated', page, limit];
  
  return useOptimizedQuery(
    queryKey,
    () => queryFn(page, limit),
    {
      keepPreviousData: true,
      ...options
    }
  );
};

// Hook pour les requêtes fréquentes avec cache plus long
export const useFrequentQuery = <T>(
  queryKey: any[],
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
) => {
  return useOptimizedQuery(
    queryKey,
    queryFn,
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      ...options
    }
  );
};
