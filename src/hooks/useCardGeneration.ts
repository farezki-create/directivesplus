
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PDFCardGenerator } from "@/components/pdf/utils/PDFCardGenerator";
import { UserProfile, TrustedPerson } from "@/components/pdf/types";

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
      const profileWithId = {
        ...profile,
        unique_identifier: userId
      };
      
      const cardUrl = await PDFCardGenerator.generate(profileWithId, trustedPersons);
      setCardPdfUrl(cardUrl);
      
      if (cardUrl) {
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
        const fileName = `carte-directives-${timestamp}.pdf`;
        
        const { error } = await supabase
          .from('pdf_documents')
          .insert({
            user_id: userId,
            file_name: fileName,
            file_path: `cards/${fileName}`,
            content_type: 'application/pdf',
            description: 'Carte format bancaire - Directives anticipées',
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error("Error saving card to documents:", error);
          toast({
            title: "Attention",
            description: "La carte a été générée mais n'a pas pu être sauvegardée dans vos documents",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Succès",
            description: "Carte format bancaire générée et sauvegardée dans vos documents",
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
      const link = document.createElement('a');
      link.href = cardPdfUrl;
      link.download = 'carte-directives-anticipees.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return {
    isGeneratingCard,
    cardPdfUrl,
    generateCard,
    handleDownloadCard
  };
}
