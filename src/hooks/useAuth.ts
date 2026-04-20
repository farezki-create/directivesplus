/**
 * Unified auth hook — single source of truth.
 * Re-exports from AuthContext so all consumers share the same shape.
 *
 * Usage:
 *   import { useAuth } from "@/hooks/useAuth";
 *   // or
 *   import { useAuth } from "@/contexts/AuthContext";
 *
 * Both return the same instance (user, session, isAuthenticated, isLoading,
 * isAdmin, signOut, profile).
 */
export { useAuth } from "@/contexts/AuthContext";
