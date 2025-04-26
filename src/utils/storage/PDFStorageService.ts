
import { CloudStorageProvider, CloudProviderConfig } from './types';
import { ScalingoHDSStorageProvider } from '../cloud/ScalingoHDSStorageProvider';
import { toast } from "@/hooks/use-toast";

export class PDFStorageService {
  private static storageProvider: CloudStorageProvider = new ScalingoHDSStorageProvider();
  
  static setStorageProvider(provider: CloudStorageProvider): void {
    this.storageProvider = provider;
  }
  
  static getStorageProvider(): CloudStorageProvider {
    return this.storageProvider;
  }

  static async uploadToCloud(
    pdfData: string | Blob, 
    fileName: string, 
    metadata?: any
  ): Promise<string | null> {
    try {
      // Convert data URL to Blob if necessary
      let blob: Blob;
      if (typeof pdfData === 'string' && pdfData.startsWith('data:')) {
        const response = await fetch(pdfData);
        blob = await response.blob();
      } else if (pdfData instanceof Blob) {
        blob = pdfData;
      } else {
        throw new Error("Invalid PDF data format");
      }
      
      // Upload using the storage provider
      const documentId = await this.storageProvider.uploadFile(blob, fileName, metadata);
      
      if (documentId) {
        toast({
          title: "Document sauvegardé",
          description: "Votre document a été stocké en toute sécurité.",
        });
      }
      
      return documentId;
    } catch (error) {
      console.error("[PDFStorageService] Cloud upload error:", error);
      toast({
        title: "Erreur de stockage",
        description: "Impossible de sauvegarder le document. Veuillez réessayer.",
        variant: "destructive",
      });
      return null;
    }
  }

  static async retrieveFromCloud(documentId: string): Promise<string | null> {
    try {
      return await this.storageProvider.retrieveFile(documentId);
    } catch (error) {
      console.error("[PDFStorageService] Cloud retrieval error:", error);
      toast({
        title: "Erreur de récupération",
        description: "Impossible de récupérer le document. Veuillez réessayer.",
        variant: "destructive",
      });
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
