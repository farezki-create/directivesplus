
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";
import { logAccessEvent, notifyAccessLogged } from "@/utils/accessLoggingUtils";

interface CardPrintOptions {
  cardRef: React.RefObject<HTMLDivElement>;
  userId: string;
  firstName: string;
  lastName: string;
  includeDirective: boolean;
  includeMedical: boolean;
  directiveCode?: string | null;
  medicalCode?: string | null;
}

export const printCard = async ({
  cardRef,
  userId,
  includeDirective,
  includeMedical,
  directiveCode,
  medicalCode,
  firstName,
  lastName
}: CardPrintOptions): Promise<void> => {
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
