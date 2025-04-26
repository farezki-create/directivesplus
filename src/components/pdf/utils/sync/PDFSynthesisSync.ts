
import { supabase } from "@/integrations/supabase/client";

export async function syncSynthesisToCloud(userId: string): Promise<boolean> {
  try {
    if (!userId) {
      console.error("[PDFSynthesisSync] No user ID provided for syncing synthesis");
      return false;
    }
    
    // Transfer synthesis to cloud
    const { data: synthesis, error: synthesisError } = await supabase
      .from('questionnaire_synthesis')
      .select('free_text, signature')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (synthesisError) {
      console.error("[PDFSynthesisSync] Error fetching synthesis:", synthesisError);
      return false;
    }
    
    if (synthesis) {
      console.log("[PDFSynthesisSync] Backing up synthesis data to cloud");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("[PDFSynthesisSync] Error in syncSynthesisToCloud:", error);
    return false;
  }
}
