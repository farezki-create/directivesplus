
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PDFGenerationService } from "@/utils/PDFGenerationService";

/**
 * Uploads a PDF to cloud storage
 */
export async function uploadPDFToStorage(pdfDataUrl: string | Blob, userId: string, profile: any): Promise<string | null> {
  try {
    // Convert data URL to Blob if it's a string starting with "data:"
    let blob: Blob;
    if (typeof pdfDataUrl === 'string' && pdfDataUrl.startsWith('data:')) {
      const response = await fetch(pdfDataUrl);
      blob = await response.blob();
    } else if (pdfDataUrl instanceof Blob) {
      blob = pdfDataUrl;
    } else {
      throw new Error("Invalid PDF data format");
    }
    
    // Generate filename with metadata
    const firstName = profile.first_name || 'unknown';
    const lastName = profile.last_name || 'unknown';
    const birthDate = profile.birth_date 
      ? new Date(profile.birth_date).toISOString().split('T')[0]
      : 'unknown';
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
    
    const externalId = `${lastName}_${firstName}_${birthDate}_${timestamp}`;
    const sanitizedExternalId = externalId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${sanitizedExternalId}.pdf`;
    
    // Upload using our service
    const documentId = await PDFGenerationService.uploadToCloud(blob, fileName, {
      userId,
      firstName,
      lastName,
      birthDate,
      documentType: 'directives',
      createdAt: new Date().toISOString()
    });
    
    if (documentId) {
      // Save reference in database
      const { error: dbError } = await supabase
        .from('pdf_documents')
        .insert({
          user_id: userId,
          file_name: `${documentId}.pdf`,
          file_path: `external_storage/${documentId}.pdf`,
          content_type: 'application/pdf',
          description: `Directives anticipées de ${firstName} ${lastName}`,
          external_id: documentId
        });
          
      if (dbError) {
        console.error("[PDFUploader] Error saving reference to database:", dbError);
        throw dbError;
      }

      toast({
        title: "Document sauvegardé",
        description: "Votre document a été stocké en toute sécurité.",
      });
    }
    
    return documentId;
  } catch (error) {
    console.error("[PDFUploader] Error in uploadPDFToStorage:", error);
    toast({
      title: "Erreur de stockage",
      description: "Impossible de sauvegarder le document. Veuillez réessayer.",
      variant: "destructive",
    });
    return null;
  }
}
