/**
 * Unified auth hook — single source of truth.
 * Re-exports from AuthContext with a backwards-compatible `loading` alias.
 *
 * Prefer importing from "@/contexts/AuthContext" directly in new code.
 */
import { useAuth as useAuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  const ctx = useAuthContext();
  return {
    ...ctx,
    // Backwards-compat alias used by some legacy components
    loading: ctx.isLoading,
  };
};
