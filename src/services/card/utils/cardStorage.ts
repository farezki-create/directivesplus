
import { supabase } from "@/integrations/supabase/client";
import { ScalingoHDSStorageProvider } from "@/utils/cloud/ScalingoHDSStorageProvider";
import { UserProfile } from "@/components/pdf/types";

export async function saveCardToStorage(
  cardPdfUrl: string, 
  userId: string,
  profile: UserProfile
) {
  try {
    // Convert data URL to Blob
    const response = await fetch(cardPdfUrl);
    const blob = await response.blob();
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
    const fileName = `carte-directives-${timestamp}.pdf`;
    const filePath = `${userId}/cards/${fileName}`;
    
    // Upload to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('directives_pdfs')
      .upload(filePath, blob, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) throw error;

    // Save reference in database
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { error: dbError } = await supabase
      .from('pdf_documents')
      .insert({
        user_id: userId,
        file_name: fileName,
        file_path: filePath,
        content_type: 'application/pdf',
        description: 'Carte format bancaire - Directives anticipées'
      });

    if (dbError) throw dbError;

    // Try to save to Scalingo HDS storage
    try {
      const scalingoProvider = new ScalingoHDSStorageProvider();
      const externalId = await scalingoProvider.uploadFile(
        blob,
        fileName,
        {
          userId,
          firstName: profile.first_name,
          lastName: profile.last_name,
          documentType: 'carte_directive',
          createdAt: new Date().toISOString()
        }
      );

      if (externalId) {
        await supabase
          .from('pdf_documents')
          .update({ 
            description: `Carte format bancaire - Directives anticipées (ID externe: ${externalId})`,
            external_id: externalId
          })
          .eq('file_name', fileName)
          .eq('user_id', userId);
      }
    } catch (externalError) {
      console.error("[CardStorage] External storage error:", externalError);
      // Continue even if external storage fails
    }

    return { fileName, filePath };
  } catch (error) {
    console.error("[CardStorage] Error saving card:", error);
    throw error;
  }
}
