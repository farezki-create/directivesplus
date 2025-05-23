
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
    
    // First, check if the directive exists and fetch it
    const { data: directive, error: fetchError } = await supabase
      .from('directives')
      .select('*')
      .eq('id', directiveId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching directive:", fetchError);
      return { success: false, error: fetchError.message };
    }

    // Update the directive with the shared code
    // We need to use the PostgreSQL function since the columns don't exist in the table schema yet
    const { error } = await supabase.rpc('update_directive_shared_code', {
      directive_id: directiveId,
      code: code,
      expires_at: expiresAt.toISOString()
    });
    
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
    // Remove the shared code using the PostgreSQL function
    const { error } = await supabase.rpc('revoke_directive_shared_code', {
      directive_id: directiveId
    });
    
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
    // Calculate new expiration date
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + additionalDays);
    const newExpiryDate = newDate.toISOString();
    
    // Extend the expiration date using the PostgreSQL function
    const { data, error } = await supabase.rpc('extend_directive_shared_code', {
      directive_id: directiveId,
      new_expires_at: newExpiryDate
    });
    
    if (error) {
      console.error("Error extending shared code expiration:", error);
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      newExpiry: newExpiryDate
    };
  } catch (err: any) {
    console.error("Exception extending shared code expiration:", err);
    return { success: false, error: err.message };
  }
};
