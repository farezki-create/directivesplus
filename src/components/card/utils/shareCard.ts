
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";
import { logAccessEvent, notifyAccessLogged } from "@/utils/accessLoggingUtils";

interface CardShareOptions {
  cardRef: React.RefObject<HTMLDivElement>;
  userId: string;
  firstName: string;
  lastName: string;
  includeDirective: boolean;
  includeMedical: boolean;
  directiveCode?: string | null;
  medicalCode?: string | null;
}

export const shareCard = async ({
  cardRef,
  userId,
  firstName,
  lastName,
  includeDirective,
  includeMedical,
  directiveCode,
  medicalCode
}: CardShareOptions): Promise<void> => {
  if (!cardRef.current) return;
  
  try {
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imageUrl = canvas.toDataURL("image/png");
    
    // Check if Web Share API is available
    if (navigator.share) {
      const blob = await (await fetch(imageUrl)).blob();
      const file = new File([blob], `carte-access-${lastName.toLowerCase()}-${firstName.toLowerCase()}.png`, { type: "image/png" });
      
      await navigator.share({
        title: "Carte d'accès aux documents médicaux",
        text: "Carte d'accès pour directives anticipées et données médicales",
        files: [file]
      });
      
      // Journal d'accès pour partage
      let logged = false;
      
      if (includeDirective && directiveCode) {
        logged = await logAccessEvent({
          userId,
          accessCodeId: directiveCode,
          resourceType: "directive",
          action: "share",
          success: true // Add success property
        });
      }
      
      if (includeMedical && medicalCode) {
        logged = await logAccessEvent({
          userId,
          accessCodeId: medicalCode,
          resourceType: "medical",
          action: "share",
          success: true // Add success property
        });
      }
      
      notifyAccessLogged("partage", logged);
    } else {
      // Fallback if Web Share API is not available
      toast({
        title: "Partage non disponible",
        description: "Votre navigateur ne prend pas en charge le partage direct. Utilisez la fonction de téléchargement.",
        variant: "destructive"
      });
    }
  } catch (error) {
    console.error("Erreur lors du partage de la carte:", error);
    toast({
      title: "Erreur",
      description: "Impossible de partager la carte d'accès",
      variant: "destructive"
    });
  }
};
