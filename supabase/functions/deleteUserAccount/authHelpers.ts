
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders, createErrorResponse } from "./corsHelpers.ts";

// Validate and extract user information from the authorization token
export async function validateAuth(req: Request) {
  // Extract the token from authorization header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return { error: createErrorResponse("Autorisation manquante", 401) };
  }

  // Verify Supabase configuration
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (!supabaseUrl || !supabaseServiceKey) {
    return { error: createErrorResponse("Configuration Supabase manquante", 500) };
  }

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Verify user from token
  const { data: userResponse, error: userError } = await supabase.auth.getUser(
    authHeader.replace("Bearer ", "")
  );

  if (userError || !userResponse.user) {
    return { 
      error: createErrorResponse("Utilisateur non autorisé ou invalide", 401) 
    };
  }

  return { 
    userId: userResponse.user.id,
    supabase,
    adminAuthClient: supabase.auth.admin
  };
}
