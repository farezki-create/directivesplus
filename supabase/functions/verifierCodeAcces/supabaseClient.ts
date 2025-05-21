
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

/**
 * Créer un client Supabase avec les droits d'administrateur
 * @returns Client Supabase configuré
 */
export function createSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Configuration Supabase manquante");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}
