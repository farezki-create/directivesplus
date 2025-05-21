
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";
import { logAccessEvent, notifyAccessLogged } from "@/utils/accessLoggingUtils";

interface CardDownloadOptions {
  cardRef: React.RefObject<HTMLDivElement>;
  userId: string;
  firstName: string;
  lastName: string;
  includeDirective: boolean;
  includeMedical: boolean;
  directiveCode?: string | null;
  medicalCode?: string | null;
}

export const downloadCard = async ({
  cardRef,
  userId,
  firstName,
  lastName,
  includeDirective,
  includeMedical,
  directiveCode,
  medicalCode
}: CardDownloadOptions): Promise<void> => {
  if (!cardRef.current) return;
  
  try {
    const canvas = await html2canvas(cardRef.current, {
      scale: 3, // Higher resolution
      useCORS: true,
      logging: false
    });
    
    const imageUrl = canvas.toDataURL("image/png");
    
    // Create a link and trigger download
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `carte-access-${lastName.toLowerCase()}-${firstName.toLowerCase()}.png`;
    link.click();
    
    // Journal d'accès pour téléchargement
    let logged = false;
    
    if (includeDirective && directiveCode) {
      logged = await logAccessEvent({
        userId,
        accessCodeId: directiveCode,
        resourceType: "directive",
        action: "download",
        success: true
      });
    }
    
    if (includeMedical && medicalCode) {
      logged = await logAccessEvent({
        userId,
        accessCodeId: medicalCode,
        resourceType: "medical",
        action: "download",
        success: true
      });
    }
    
    notifyAccessLogged("téléchargement", logged);
    
    toast({
      title: "Carte téléchargée",
      description: "La carte d'accès a été téléchargée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la génération de la carte:", error);
    toast({
      title: "Erreur",
      description: "Impossible de générer la carte d'accès",
      variant: "destructive"
    });
  }
};
