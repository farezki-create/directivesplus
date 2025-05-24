
import { useSharing } from "@/hooks/sharing/useSharing";
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument } from "@/types/sharing";

export const generateInstitutionCode = async (directiveId: string): Promise<string | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get the directive to create a shareable document
    const { data: directive, error } = await supabase
      .from('directives')
      .select('id, content, created_at')
      .eq('id', directiveId)
      .eq('user_id', user.id)
      .single();

    if (error || !directive) {
      throw new Error("Directive not found");
    }

    // Create a shareable document object
    const shareableDocument: ShareableDocument = {
      id: directive.id,
      file_name: "Directives anticipées",
      file_path: "",
      created_at: directive.created_at,
      user_id: user.id,
      file_type: "directive",
      source: "directives",
      content: directive.content
    };

    // Use the unified sharing service
    const { generateInstitutionCode } = useSharing();
    const code = await generateInstitutionCode(shareableDocument, 30);
    return code;
  } catch (error) {
    console.error("Error generating institution code:", error);
    throw error;
  }
};
