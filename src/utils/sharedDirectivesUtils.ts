
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
    const { data: codeData, error: codeError } = await supabase.rpc("generate_random_code", { length: 6 });
    
    if (codeError) {
      console.error("Error generating random code:", codeError);
      return { success: false, error: codeError.message };
    }
    
    const code = codeData;
    
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
    // We'll update the content JSONB field directly
    const content = directive.content || {};
    const updatedContent = {
      ...content,
      shared_code: code,
      shared_code_expires_at: expiresAt.toISOString()
    };

    const { error: updateError } = await supabase
      .from('directives')
      .update({
        content: updatedContent
      })
      .eq('id', directiveId);
    
    if (updateError) {
      console.error("Error updating directive with shared code:", updateError);
      return { success: false, error: updateError.message };
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
    // First, get the current directive
    const { data: directive, error: fetchError } = await supabase
      .from('directives')
      .select('*')
      .eq('id', directiveId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching directive:", fetchError);
      return { success: false, error: fetchError.message };
    }

    // Remove the shared code from the content JSONB
    const content = directive.content || {};
    const { shared_code, shared_code_expires_at, ...remainingContent } = content;

    const { error: updateError } = await supabase
      .from('directives')
      .update({
        content: remainingContent
      })
      .eq('id', directiveId);
    
    if (updateError) {
      console.error("Error revoking shared code:", updateError);
      return { success: false, error: updateError.message };
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
    // First, get the current directive
    const { data: directive, error: fetchError } = await supabase
      .from('directives')
      .select('*')
      .eq('id', directiveId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching directive:", fetchError);
      return { success: false, error: fetchError.message };
    }

    // Calculate new expiration date
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + additionalDays);
    const newExpiryDate = newDate.toISOString();
    
    // Update the expiration date in the content JSONB
    const content = directive.content || {};
    if (!content.shared_code) {
      return { success: false, error: "No shared code exists for this directive" };
    }

    const updatedContent = {
      ...content,
      shared_code_expires_at: newExpiryDate
    };

    const { error: updateError } = await supabase
      .from('directives')
      .update({
        content: updatedContent
      })
      .eq('id', directiveId);
    
    if (updateError) {
      console.error("Error extending shared code expiration:", updateError);
      return { success: false, error: updateError.message };
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
