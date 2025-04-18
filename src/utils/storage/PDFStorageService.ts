import { CloudStorageProvider, CloudProviderConfig } from './types';
import { SupabaseStorageProvider } from './providers/SupabaseProvider';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export class PDFStorageService {
  private static storageProvider: CloudStorageProvider = new SupabaseStorageProvider();
  
  static setStorageProvider(provider: CloudStorageProvider): void {
    this.storageProvider = provider;
  }
  
  static getStorageProvider(): CloudStorageProvider {
    return this.storageProvider;
  }

  static async uploadToCloud(
    pdfDataUrl: string, 
    userId: string, 
    profile: any
  ): Promise<string | null> {
    try {
      const firstName = profile.first_name || 'unknown';
      const lastName = profile.last_name || 'unknown';
      const birthDate = profile.birth_date 
        ? new Date(profile.birth_date).toISOString().split('T')[0]
        : 'unknown';
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
      
      const externalId = `${lastName}_${firstName}_${birthDate}_${timestamp}`;
      const sanitizedExternalId = externalId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `${sanitizedExternalId}.pdf`;
      const filePath = `${userId}/${fileName}`;
      
      // Convert data URL to Blob
      const response = await fetch(pdfDataUrl);
      const blob = await response.blob();

      // Upload to Supabase storage
      const { data, error } = await supabase
        .storage
        .from('directives_pdfs')
        .upload(filePath, blob, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (error) {
        console.error("[PDFStorageService] Error uploading file:", error);
        throw error;
      }

      // Save reference in the database
      const { error: dbError } = await supabase
        .from('pdf_documents')
        .insert({
          user_id: userId,
          file_name: fileName,
          file_path: filePath,
          content_type: 'application/pdf',
          description: `Directives anticipées de ${firstName} ${lastName}`,
          created_at: new Date().toISOString()
        });
          
      if (dbError) {
        console.error("[PDFStorageService] Error saving reference to database:", dbError);
        throw dbError;
      }
      
      return sanitizedExternalId;
    } catch (error) {
      console.error("[PDFStorageService] Cloud upload error:", error);
      return null;
    }
  }

  static async retrieveFromCloud(documentId: string): Promise<string | null> {
    try {
      // Find the document in the database
      const { data: document, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .ilike('file_name', `%${documentId}%`)
        .single();
          
      if (error || !document) {
        console.error("[PDFStorageService] Error finding document:", error);
        throw new Error("Document non trouvé");
      }
      
      // Download from storage
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('directives_pdfs')
        .download(document.file_path);
          
      if (downloadError || !fileData) {
        console.error("[PDFStorageService] Error downloading file:", downloadError);
        throw new Error("Impossible de télécharger le fichier");
      }
      
      return URL.createObjectURL(fileData);
    } catch (error) {
      console.error("[PDFStorageService] Retrieval error:", error);
      return null;
    }
  }

  static handlePrint(pdfUrl: string | null): void {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl);
      printWindow?.print();
    } else {
      toast({
        title: "Erreur",
        description: "Aucun document PDF à imprimer.",
        variant: "destructive",
      });
    }
  }
}
