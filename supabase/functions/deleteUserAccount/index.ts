
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { validateAuth } from "./authHelpers.ts";
import { deleteUserData } from "./dataDeleteHelpers.ts";
import { 
  corsHeaders, 
  handleOptionsRequest, 
  createErrorResponse, 
  createSuccessResponse 
} from "./corsHelpers.ts";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return handleOptionsRequest();
  }

  try {
    // Verify request method is POST
    if (req.method !== "POST") {
      return createErrorResponse("Méthode non autorisée", 405);
    }

    // Validate auth token and get user information
    const { error, userId, supabase, adminAuthClient } = await validateAuth(req);
    if (error) return error;

    console.log(`Début de la suppression du compte pour l'utilisateur: ${userId}`);
    
    // Delete all user data from database tables
    const deletionResults = await deleteUserData(supabase, userId);
    
    // Finally, delete the user account itself
    console.log("Tentative de suppression du compte utilisateur");
    const { error: deleteError } = await adminAuthClient.deleteUser(userId);

    if (deleteError) {
      console.error("Erreur lors de la suppression du compte:", deleteError);
      throw deleteError;
    }

    console.log("Compte utilisateur supprimé avec succès");
    return createSuccessResponse({
      success: true,
      message: "Compte et données associées supprimés avec succès",
      deletionResults
    });
    
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    
    return createErrorResponse(
      "Une erreur est survenue lors de la suppression du compte", 
      500, 
      error instanceof Error ? error.message : String(error)
    );
  }
});
