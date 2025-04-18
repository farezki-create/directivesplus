
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserProfile, TrustedPerson } from "@/components/pdf/types";
import { CardGenerationService } from "@/services/card/CardGenerationService";
import { generateAccessCodes } from "@/services/card/utils/accessCodeGenerator";
import { saveCardToStorage } from "@/services/card/utils/cardStorage";

export function useCardGeneration(userId: string | null) {
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [cardPdfUrl, setCardPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateCard = async (profile: UserProfile | null, trustedPersons: TrustedPerson[]) => {
    if (!profile || !userId) {
      toast({
        title: "Erreur",
        description: "Informations de profil incomplètes",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingCard(true);
      toast({
        title: "Génération en cours",
        description: "Veuillez patienter pendant la génération de votre carte",
      });
      
      // Generate the card PDF
      const cardUrl = await CardGenerationService.generateCard(profile, trustedPersons);
      
      if (cardUrl) {
        // Store the URL for immediate use
        setCardPdfUrl(cardUrl);
        
        try {
          // Save to storage and get document ID
          const { fileName } = await saveCardToStorage(cardUrl, userId, profile);
          
          // Generate and save access codes
          await generateAccessCodes(userId);
          
          toast({
            title: "Succès",
            description: "Carte format bancaire générée et sauvegardée dans vos documents",
          });
        } catch (storageError) {
          console.error("Storage error:", storageError);
          toast({
            title: "Carte générée localement uniquement",
            description: "La carte n'a pas pu être sauvegardée dans le stockage cloud, mais vous pouvez la télécharger.",
          });
        }
      }
    } catch (error) {
      console.error("[GeneratePDF] Error generating card:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la carte format bancaire",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleDownloadCard = () => {
    if (cardPdfUrl) {
      try {
        const link = document.createElement('a');
        link.href = cardPdfUrl;
        link.download = 'carte-directives-anticipees.pdf';
        link.type = 'application/pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Téléchargement démarré",
          description: "La carte au format PDF est en cours de téléchargement"
        });
      } catch (error) {
        console.error("Erreur lors du téléchargement:", error);
        toast({
          title: "Erreur",
          description: "Impossible de télécharger le fichier PDF. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Erreur", 
        description: "Aucun PDF généré à télécharger", 
        variant: "destructive"
      });
    }
  };

  return {
    isGeneratingCard,
    cardPdfUrl,
    generateCard,
    handleDownloadCard
  };
}
