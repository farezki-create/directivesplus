
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

/**
 * Create a Supabase client with admin rights
 * @returns Client Supabase configured
 */
export function createSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase configuration");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}
