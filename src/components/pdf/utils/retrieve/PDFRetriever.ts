
import { PDFGenerationService } from "@/utils/PDFGenerationService";
import { toast } from "@/hooks/use-toast";

export async function retrievePDFFromStorage(externalId: string): Promise<string | null> {
  try {
    console.log("[PDFRetriever] Retrieving external document:", externalId);
    return await PDFGenerationService.retrieveFromCloud(externalId);
  } catch (error) {
    console.error("[PDFRetriever] Error retrieving PDF:", error);
    toast({
      title: "Erreur",
      description: "Impossible de récupérer le document.",
      variant: "destructive",
    });
    return null;
  }
}
