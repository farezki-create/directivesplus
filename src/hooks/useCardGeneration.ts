
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PDFCardGenerator } from "@/components/pdf/utils/PDFCardGenerator";
import { UserProfile, TrustedPerson } from "@/components/pdf/types";
import { ScalingoHDSStorageProvider } from "@/utils/cloud/ScalingoHDSStorageProvider";

export function useCardGeneration(userId: string | null) {
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [cardPdfUrl, setCardPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Initialize the Scalingo HDS Storage Provider
  const scalingoProvider = new ScalingoHDSStorageProvider();

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
      
      const profileWithId = {
        ...profile,
        unique_identifier: userId
      };
      
      // Generate the card PDF
      const cardUrl = await PDFCardGenerator.generate(profileWithId, trustedPersons);
      
      if (cardUrl) {
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
        const fileName = `carte-directives-${timestamp}.pdf`;
        
        // Convert data URL to Blob
        const response = await fetch(cardUrl);
        const blob = await response.blob();
        
        // Stocker d'abord en local dans l'application pour permettre le téléchargement immédiat
        const objectUrl = URL.createObjectURL(blob);
        setCardPdfUrl(objectUrl);

        try {
          // Upload to Supabase storage in a "cards" folder with user_id in the path
          // Ceci assure la compatibilité avec les politiques RLS qui requièrent généralement
          // que l'utilisateur soit propriétaire du chemin de fichier via son ID
          const filePath = `${userId}/cards/${fileName}`;
          const { data, error } = await supabase
            .storage
            .from('directives_pdfs')
            .upload(filePath, blob, {
              contentType: 'application/pdf',
              upsert: true // Change from false to true to allow overwriting
            });

          if (error) {
            console.error("Error uploading card to storage:", error);
            // On continue malgré l'erreur pour permettre le téléchargement local
          } else {
            // Save reference in Supabase database with a delay to ensure storage has completed
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const { error: dbError } = await supabase
              .from('pdf_documents')
              .insert({
                user_id: userId,
                file_name: fileName,
                file_path: filePath,
                content_type: 'application/pdf',
                description: 'Carte format bancaire - Directives anticipées',
                created_at: new Date().toISOString()
              });

            if (dbError) {
              console.error("Error saving card to documents:", dbError);
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
              
              // Attempt to save to external Scalingo HDS storage as well
              try {
                // Upload to Scalingo HDS storage
                const externalId = await scalingoProvider.uploadFile(
                  cardUrl,
                  fileName,
                  {
                    userId,
                    firstName: profile.first_name,
                    lastName: profile.last_name,
                    documentType: 'carte_directive',
                    createdAt: new Date().toISOString()
                  }
                );
                
                if (externalId) {
                  console.log(`Card saved to Scalingo HDS storage with ID: ${externalId}`);
                  
                  // Store the external ID in the description field
                  const updatedDescription = `Carte format bancaire - Directives anticipées (ID externe: ${externalId})`;
                  
                  await supabase
                    .from('pdf_documents')
                    .update({ 
                      description: updatedDescription,
                      external_id: externalId
                    })
                    .eq('file_name', fileName)
                    .eq('user_id', userId);
                }
              } catch (externalError) {
                console.error("Error saving to external storage:", externalError);
                // Continue even if external storage fails - we already have it in Supabase
              }
            }
          }
        } catch (storageError) {
          console.error("Storage error:", storageError);
          // La carte est quand même générée localement
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
    // Cette fonction n'est plus utilisée directement,
    // le téléchargement est géré dans CardGenerationSection
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
