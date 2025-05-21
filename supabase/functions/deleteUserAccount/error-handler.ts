
import { corsHeaders, createErrorResponse } from "./corsHelpers.ts";

/**
 * Capture and handle errors in edge functions
 * @param fn Function to execute with error handling
 */
export function withErrorHandler(fn: (req: Request) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    try {
      // Execute the function with error handling
      return await fn(req);
    } catch (error) {
      console.error("Unhandled error:", error);
      
      // Determine appropriate HTTP status
      const status = error instanceof URIError || error instanceof SyntaxError ? 400 : 500;
      
      // Create standardized error response
      return createErrorResponse(
        "An error occurred while processing the request", 
        status, 
        error instanceof Error ? error.message : String(error)
      );
    }
  };
}
