
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

serve(withErrorHandler(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return handleOptionsRequest();
  }

  if (req.method !== "POST") {
    return createErrorResponse("Method not allowed", 405);
  }

  try {
    const { error, userId, supabase, adminAuthClient } = await validateAuth(req);
    
    if (error) {
      return error;
    }

    await logAccountDeletion(supabase, userId, true, "Deletion process started");
    
    const deletionResults = await deleteUserData(supabase, userId);
    
    const criticalFailures = deletionResults.filter(result => 
      !result.success && ['profiles', 'directives', 'pdf_documents'].includes(result.table)
    );
    
    if (criticalFailures.length > 0) {
      console.error('Critical data deletion failures:', criticalFailures);
      await logAccountDeletion(supabase, userId, false, `Critical failures: ${criticalFailures.map(f => f.table).join(', ')}`);
      
      return createErrorResponse(
        "Failed to delete critical user data", 
        500, 
        `Critical tables failed: ${criticalFailures.map(f => f.table).join(', ')}`
      );
    }
    
    const { error: deleteError } = await adminAuthClient.deleteUser(userId);

    if (deleteError) {
      console.error('Auth deletion failed:', deleteError);
      await logAccountDeletion(supabase, userId, false, `Auth deletion error: ${deleteError.message}`);
      
      return createErrorResponse(
        "Failed to delete user account from authentication system", 
        500, 
        deleteError.message
      );
    }

    await logAccountDeletion(supabase, userId, true, "Account deletion completed successfully");
    
    return createSuccessResponse({
      message: "Account and associated data successfully deleted",
      deletionResults,
      deletedUserId: userId
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Unexpected error during account deletion:', errorMessage);
    
    return createErrorResponse(
      "An unexpected error occurred during account deletion", 
      500, 
      errorMessage
    );
  }
}));
