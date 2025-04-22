
import { supabase } from "@/integrations/supabase/client";
import { BaseStorageProvider } from './BaseStorageProvider';

export class SupabaseStorageProvider extends BaseStorageProvider {
  async uploadFile(fileData: string | Blob, fileName: string, metadata?: any): Promise<string | null> {
    try {
      const blob = await this.convertToBlob(fileData);
      const filePath = `external_storage/${fileName}`;
      
      const { data, error } = await supabase
        .storage
        .from('directives_pdfs')
        .upload(filePath, blob, {
          contentType: 'application/pdf',
          upsert: false
        });
          
      if (error) {
        console.error("[SupabaseStorageProvider] Error uploading file:", error);
        throw error;
      }
      
      return fileName.replace(".pdf", "");
    } catch (error) {
      console.error("[SupabaseStorageProvider] Upload error:", error);
      return null;
    }
  }
  
  async retrieveFile(documentId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .ilike('file_name', `%${documentId}%`)
        .single();
          
      if (error || !data) {
        console.error("[SupabaseStorageProvider] Error finding document:", error);
        throw new Error("Document non trouvé");
      }
      
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from('directives_pdfs')
        .download(data.file_path);
          
      if (fileError || !fileData) {
        console.error("[SupabaseStorageProvider] Error downloading file:", fileError);
        throw new Error("Impossible de télécharger le fichier");
      }
      
      return URL.createObjectURL(fileData);
    } catch (error) {
      console.error("[SupabaseStorageProvider] Retrieval error:", error);
      return null;
    }
  }
}
