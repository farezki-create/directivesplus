
import { PDFGenerationService } from "@/utils/PDFGenerationService";

/**
 * Service for retrieving PDFs from storage
 */
export class PDFRetrievalService {
  /**
   * Retrieves a PDF from storage based on its external ID
   * @param externalId - The external document ID
   * @returns The retrieved PDF URL or null
   */
  static async retrievePDFFromStorage(externalId: string): Promise<string | null> {
    try {
      console.log("[PDFStorage] Retrieving external document:", externalId);
      
      // Use the PDFGenerationService to retrieve from cloud
      return await PDFGenerationService.retrieveFromCloud(externalId);
    } catch (error) {
      console.error("[PDFStorage] Error in retrievePDFFromStorage:", error);
      return null;
    }
  }
}
