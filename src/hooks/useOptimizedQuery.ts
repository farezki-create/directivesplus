
import { useQuery, UseQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { cacheManager } from '@/utils/performance/cacheStrategy';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  cacheTime?: number;
  staleTime?: number;
  enableMemoryCache?: boolean;
  memoryCacheKey?: string;
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
    enableMemoryCache = false,
    memoryCacheKey,
    ...restOptions
  } = options;

  // Fonction de requête optimisée avec cache mémoire
  const optimizedQueryFn = async (): Promise<T> => {
    const cacheKey = memoryCacheKey || queryKey.join('_');
    
    // Vérifier le cache mémoire d'abord
    if (enableMemoryCache) {
      const cachedData = cacheManager.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }
    
    // Exécuter la requête
    const startTime = performance.now();
    const result = await queryFn();
    const endTime = performance.now();
    
    // Mettre en cache si activé
    if (enableMemoryCache && result) {
      cacheManager.set(cacheKey, result, staleTime);
    }
    
    return result;
  };

  return useQuery({
    queryKey,
    queryFn: optimizedQueryFn,
    gcTime: cacheTime,
    staleTime,
    retry,
    retryDelay,
    ...restOptions
  });
};

// Hook pour les requêtes avec pagination optimisée
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
      placeholderData: keepPreviousData,
      enableMemoryCache: true,
      memoryCacheKey: `${baseKey}_page_${page}_limit_${limit}`,
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
      enableMemoryCache: true,
      memoryCacheKey: queryKey.join('_'),
      ...options
    }
  );
};

// Hook pour les requêtes critiques avec priorité
export const useCriticalQuery = <T>(
  queryKey: any[],
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
) => {
  return useOptimizedQuery(
    queryKey,
    queryFn,
    {
      staleTime: 0, // Toujours frais
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: 1, // Retry immédiat
      enableMemoryCache: false, // Pas de cache pour les données critiques
      ...options
    }
  );
};
