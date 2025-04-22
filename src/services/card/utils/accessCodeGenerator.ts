
import { supabase } from "@/integrations/supabase/client";

export async function generateAccessCodes(userId: string, directivesDocId: string | null = null) {
  try {
    // Code for directives only
    const directivesAccessCode = `DA-${userId.substring(0, 8)}`;
    
    // Code for all documents
    const fullAccessCode = `DM-${userId.substring(0, 8)}`;
    
    // Save directives-only access code if we have a document ID
    if (directivesDocId) {
      await supabase
        .from('document_access_codes')
        .insert({
          user_id: userId,
          access_code: directivesAccessCode,
          is_full_access: false,
          document_id: directivesDocId
        });
    }
    
    // Save full access code
    await supabase
      .from('document_access_codes')
      .insert({
        user_id: userId,
        access_code: fullAccessCode,
        is_full_access: true
      });
      
    return { directivesAccessCode, fullAccessCode };
  } catch (error) {
    console.error("[AccessCodeGenerator] Error generating access codes:", error);
    throw error;
  }
}
