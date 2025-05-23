
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates a shared access code for a directive
 * @param directiveId The ID of the directive
 * @param expiresInDays Number of days until the shared access expires
 * @returns Object containing success status and shared code
 */
export const generateSharedCode = async (
  directiveId: string, 
  expiresInDays: number = 7
): Promise<{ success: boolean; code?: string; error?: string }> => {
  try {
    // Generate a random 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    
    // Update the directive with the shared code
    const { error } = await supabase
      .from('directives')
      .update({
        shared_code: code,
        shared_code_expires_at: expiresAt.toISOString()
      })
      .eq('id', directiveId);
    
    if (error) {
      console.error("Error generating shared code:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, code };
  } catch (err: any) {
    console.error("Exception generating shared code:", err);
    return { success: false, error: err.message };
  }
};

/**
 * Revokes a shared access code for a directive
 * @param directiveId The ID of the directive
 * @returns Object containing success status
 */
export const revokeSharedCode = async (
  directiveId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Remove the shared code by setting it to null
    const { error } = await supabase
      .from('directives')
      .update({
        shared_code: null,
        shared_code_expires_at: null
      })
      .eq('id', directiveId);
    
    if (error) {
      console.error("Error revoking shared code:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err: any) {
    console.error("Exception revoking shared code:", err);
    return { success: false, error: err.message };
  }
};

/**
 * Extends the expiration date of a shared code
 * @param directiveId The ID of the directive
 * @param additionalDays Number of additional days to extend
 * @returns Object containing success status
 */
export const extendSharedCodeExpiration = async (
  directiveId: string,
  additionalDays: number = 7
): Promise<{ success: boolean; newExpiry?: string; error?: string }> => {
  try {
    // First get the current directive to check if it has a shared code
    const { data: directive, error: fetchError } = await supabase
      .from('directives')
      .select('id, shared_code, shared_code_expires_at')
      .eq('id', directiveId)
      .single();
      
    if (fetchError || !directive || !directive.shared_code) {
      return { success: false, error: "Directive not found or no shared code exists" };
    }
    
    // Calculate new expiration date
    const currentExpiry = directive.shared_code_expires_at 
      ? new Date(directive.shared_code_expires_at) 
      : new Date();
    currentExpiry.setDate(currentExpiry.getDate() + additionalDays);
    
    // Update the expiration date
    const { error } = await supabase
      .from('directives')
      .update({
        shared_code_expires_at: currentExpiry.toISOString()
      })
      .eq('id', directiveId);
    
    if (error) {
      console.error("Error extending shared code expiration:", error);
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      newExpiry: currentExpiry.toISOString() 
    };
  } catch (err: any) {
    console.error("Exception extending shared code expiration:", err);
    return { success: false, error: err.message };
  }
};
