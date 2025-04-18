
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
        // Store the blob URL for immediate use
        setCardPdfUrl(cardUrl);
        
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
        const fileName = `carte-directives-${timestamp}.pdf`;
        
        try {
          // Fetch content from blob URL
          const response = await fetch(cardUrl);
          if (!response.ok) throw new Error("Failed to fetch generated PDF");
          
          const blob = await response.blob();
          if (!blob || blob.size === 0) throw new Error("Generated PDF is empty");
          
          // Upload to Supabase storage in a "cards" folder with user_id in the path
          const filePath = `${userId}/cards/${fileName}`;
          const { data, error } = await supabase
            .storage
            .from('directives_pdfs')
            .upload(filePath, blob, {
              contentType: 'application/pdf',
              upsert: true // Allow overwriting
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
              
              // Créer deux codes d'accès différents pour les deux types d'accès
              try {
                // Code pour directives anticipées seulement
                const directivesAccessCode = `DA-${userId.substring(0, 8)}`;
                
                // Trouver le premier document de type directives
                const { data: directivesDoc } = await supabase
                  .from('pdf_documents')
                  .select('id')
                  .ilike('description', '%directives anticipées%')
                  .eq('user_id', userId)
                  .order('created_at', { ascending: false })
                  .limit(1)
                  .single();
                
                if (directivesDoc) {
                  // Sauvegarder le code d'accès pour directives seulement
                  await supabase
                    .from('document_access_codes')
                    .insert({
                      user_id: userId,
                      access_code: directivesAccessCode,
                      is_full_access: false,
                      document_id: directivesDoc.id
                    });
                }
                
                // Code pour tous les documents
                const fullAccessCode = `DM-${userId.substring(0, 8)}`;
                
                // Sauvegarder le code d'accès pour tous les documents
                await supabase
                  .from('document_access_codes')
                  .insert({
                    user_id: userId,
                    access_code: fullAccessCode,
                    is_full_access: true
                  });
                
              } catch (accessCodeError) {
                console.error("Error creating access codes:", accessCodeError);
              }
              
              // Attempt to save to external Scalingo HDS storage as well
              try {
                // Upload to Scalingo HDS storage
                const externalId = await scalingoProvider.uploadFile(
                  blob,
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
    if (cardPdfUrl) {
      try {
        // Create a download link and trigger a click
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
