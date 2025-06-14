
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
 * Main function with enhanced error handling
 */
serve(withErrorHandler(async (req: Request) => {
  console.log('🚀 [DELETE-USER] Starting deletion process');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return handleOptionsRequest();
  }

  // Verify request method is POST
  if (req.method !== "POST") {
    console.error('❌ [DELETE-USER] Invalid method:', req.method);
    return createErrorResponse("Method not allowed", 405);
  }

  try {
    // Validate auth token and get user information
    console.log('🔐 [DELETE-USER] Validating authentication');
    const { error, userId, supabase, adminAuthClient } = await validateAuth(req);
    
    if (error) {
      console.error('❌ [DELETE-USER] Auth validation failed');
      return error;
    }

    console.log(`👤 [DELETE-USER] Starting deletion for user: ${userId}`);
    
    // Log the beginning of the deletion process
    await logAccountDeletion(supabase, userId, true, "Deletion process started");
    
    // Delete all user data from database tables
    console.log('🗄️ [DELETE-USER] Deleting user data from database');
    const deletionResults = await deleteUserData(supabase, userId);
    
    // Check if there were any critical failures in data deletion
    const criticalFailures = deletionResults.filter(result => 
      !result.success && ['profiles', 'directives', 'pdf_documents'].includes(result.table)
    );
    
    if (criticalFailures.length > 0) {
      console.error('❌ [DELETE-USER] Critical data deletion failures:', criticalFailures);
      await logAccountDeletion(supabase, userId, false, `Critical failures: ${criticalFailures.map(f => f.table).join(', ')}`);
      
      return createErrorResponse(
        "Failed to delete critical user data", 
        500, 
        `Critical tables failed: ${criticalFailures.map(f => f.table).join(', ')}`
      );
    }
    
    // Finally, delete the user account itself
    console.log('👤 [DELETE-USER] Deleting user account from auth');
    const { error: deleteError } = await adminAuthClient.deleteUser(userId);

    if (deleteError) {
      console.error('❌ [DELETE-USER] Auth deletion failed:', deleteError);
      await logAccountDeletion(supabase, userId, false, `Auth deletion error: ${deleteError.message}`);
      
      return createErrorResponse(
        "Failed to delete user account from authentication system", 
        500, 
        deleteError.message
      );
    }

    console.log('✅ [DELETE-USER] User account successfully deleted');
    
    await logAccountDeletion(supabase, userId, true, "Account deletion completed successfully");
    
    return createSuccessResponse({
      message: "Account and associated data successfully deleted",
      deletionResults,
      deletedUserId: userId
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('💥 [DELETE-USER] Unexpected error:', errorMessage);
    
    return createErrorResponse(
      "An unexpected error occurred during account deletion", 
      500, 
      errorMessage
    );
  }
}));
