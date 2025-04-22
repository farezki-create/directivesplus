
import { CloudStorageProvider, CloudProviderConfig } from './types';
import { SupabaseStorageProvider } from './providers/SupabaseProvider';
import { toast } from "@/hooks/use-toast";

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
      
      const documentId = await this.storageProvider.uploadFile(
        pdfDataUrl,
        fileName,
        {
          userId,
          profileName: `${firstName} ${lastName}`,
          documentType: 'directives_anticipees'
        }
      );
      
      return documentId;
    } catch (error) {
      console.error("[PDFStorageService] Cloud upload error:", error);
      return null;
    }
  }
  
  static async retrieveFromCloud(documentId: string): Promise<string | null> {
    try {
      return await this.storageProvider.retrieveFile(documentId);
    } catch (error) {
      console.error("[PDFStorageService] Cloud retrieval error:", error);
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
