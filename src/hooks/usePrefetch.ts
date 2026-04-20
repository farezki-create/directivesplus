import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Returns hover/focus handlers that prefetch a React Query in the background.
 *
 * Usage:
 *   const prefetch = usePrefetchOnHover(["users"], fetchUsers);
 *   <Link to="/admin/users" {...prefetch}>Users</Link>
 */
export function usePrefetchOnHover<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  options?: { staleTime?: number }
) {
  const qc = useQueryClient();
  const prefetch = useCallback(() => {
    qc.prefetchQuery({
      queryKey: [...queryKey],
      queryFn,
      staleTime: options?.staleTime ?? 5 * 60 * 1000,
    });
  }, [qc, queryKey, queryFn, options?.staleTime]);

  return {
    onMouseEnter: prefetch,
    onFocus: prefetch,
    onTouchStart: prefetch,
  };
}

/**
 * Prefetch a lazy-imported route module on hover. Call the dynamic import
 * factory you already pass to React.lazy(), e.g.:
 *   const handlers = usePrefetchRoute(() => import("@/pages/AdminUsers"));
 */
export function usePrefetchRoute(loader: () => Promise<unknown>) {
  const prefetch = useCallback(() => {
    // Fire-and-forget — webpack/vite will cache the chunk
    loader().catch(() => {});
  }, [loader]);

  return {
    onMouseEnter: prefetch,
    onFocus: prefetch,
    onTouchStart: prefetch,
  };
}
