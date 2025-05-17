
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
  directiveCode?: string;
  medicalCode?: string;
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
        accessCodeId: directiveCode, // Utilise le code comme ID pour simplifier
        resourceType: "directive",
        action: "download"
      });
    }
    
    if (includeMedical && medicalCode) {
      logged = await logAccessEvent({
        userId,
        accessCodeId: medicalCode, // Utilise le code comme ID pour simplifier
        resourceType: "medical",
        action: "download"
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

export const printCard = async ({
  cardRef,
  userId,
  includeDirective,
  includeMedical,
  directiveCode,
  medicalCode,
  firstName,
  lastName
}: CardDownloadOptions): Promise<void> => {
  if (!cardRef.current) return;
  
  try {
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
      logging: false
    });
    
    const imageUrl = canvas.toDataURL("image/png");
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir la fenêtre d'impression. Vérifiez les bloqueurs de popup.",
        variant: "destructive"
      });
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Carte d'accès - ${firstName} ${lastName}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              text-align: center;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" alt="Carte d'accès" />
          <script>
            window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Journal d'accès pour impression
    let logged = false;
    
    if (includeDirective && directiveCode) {
      logged = await logAccessEvent({
        userId,
        accessCodeId: directiveCode,
        resourceType: "directive",
        action: "print"
      });
    }
    
    if (includeMedical && medicalCode) {
      logged = await logAccessEvent({
        userId,
        accessCodeId: medicalCode,
        resourceType: "medical",
        action: "print"
      });
    }
    
    notifyAccessLogged("impression", logged);
  } catch (error) {
    console.error("Erreur lors de l'impression de la carte:", error);
    toast({
      title: "Erreur",
      description: "Impossible d'imprimer la carte d'accès",
      variant: "destructive"
    });
  }
};

export const shareCard = async ({
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
          action: "share"
        });
      }
      
      if (includeMedical && medicalCode) {
        logged = await logAccessEvent({
          userId,
          accessCodeId: medicalCode,
          resourceType: "medical",
          action: "share"
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

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Non renseignée";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  } catch (e) {
    return "Non renseignée";
  }
};
