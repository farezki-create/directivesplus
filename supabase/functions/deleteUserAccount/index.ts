
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { validateAuth } from "./authHelpers.ts";
import { deleteUserData } from "./dataDeleteHelpers.ts";
import { 
  handleOptionsRequest, 
  createErrorResponse, 
  createSuccessResponse 
} from "./corsHelpers.ts";
import { withErrorHandler } from "./error-handler.ts";
import { logAccountDeletion } from "./loggingService.ts";

/**
 * Main function with global error handling
 */
serve(withErrorHandler(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return handleOptionsRequest();
  }

  // Verify request method is POST
  if (req.method !== "POST") {
    return createErrorResponse("Method not allowed", 405);
  }

  // Validate auth token and get user information
  const { error, userId, supabase, adminAuthClient } = await validateAuth(req);
  if (error) return error;

  console.log(`Starting account deletion for user: ${userId}`);
  
  try {
    // Log the beginning of the deletion process
    await logAccountDeletion(supabase, userId, true, "Deletion process started");
    
    // Delete all user data from database tables
    const deletionResults = await deleteUserData(supabase, userId);
    
    // Finally, delete the user account itself
    console.log("Attempting to delete user account");
    const { error: deleteError } = await adminAuthClient.deleteUser(userId);

    if (deleteError) {
      console.error("Error deleting user account:", deleteError);
      await logAccountDeletion(supabase, userId, false, `Error: ${deleteError.message}`);
      throw deleteError;
    }

    console.log("User account successfully deleted");
    return createSuccessResponse({
      message: "Account and associated data successfully deleted",
      deletionResults
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error during account deletion process:", errorMessage);
    
    // Attempt to log the failure
    try {
      await logAccountDeletion(supabase, userId, false, errorMessage);
    } catch (logError) {
      console.error("Additionally failed to log the error:", logError);
    }
    
    return createErrorResponse("Failed to delete account", 500, errorMessage);
  }
}));
