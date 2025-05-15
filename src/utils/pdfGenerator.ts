
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PdfData {
  profileData: any;
  responses: Record<string, any>;
  examplePhrases: string[];
  customPhrases: string[];
  trustedPersons: any[];
  freeText: string;
  signature: string;
  userId?: string;
}

// Cette fonction utiliserait normalement une bibliothèque de génération de PDF comme jsPDF
// Pour l'instant, nous allons créer un espace réservé qui télécharge la signature en tant qu'image
export const generatePDF = async (data: PdfData): Promise<any> => {
  try {
    console.log("Génération du PDF avec les données:", data);
    
    // Pour les besoins de la démonstration, nous téléchargeons simplement la signature
    // Dans une implémentation réelle, vous utiliseriez jsPDF ou similaire pour créer un PDF complet
    
    // Créer un élément de lien temporaire
    const link = document.createElement('a');
    link.href = data.signature;
    link.download = `directives-anticipees-${new Date().toISOString().split('T')[0]}.png`;
    
    // Ajouter au document, cliquer dessus et le supprimer
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Stocker des informations sur la génération du PDF dans la base de données
    if (data.userId) {
      const fileName = `directives-anticipees-${new Date().toISOString().split('T')[0]}.pdf`;
      const pdfRecord = {
        user_id: data.userId,
        file_name: fileName,
        file_path: data.signature, // Dans une implémentation réelle, ce serait l'URL vers le PDF stocké
        content_type: "application/pdf",
        file_size: 0, // Dans une implémentation réelle, ce serait la taille réelle du fichier
        description: "Directives anticipées générées",
        created_at: new Date().toISOString()
      };
      
      const { data: insertedData, error } = await supabase
        .from('pdf_documents')
        .insert(pdfRecord)
        .select();
      
      if (error) {
        console.error("Erreur lors de l'enregistrement du PDF:", error);
        throw error;
      }
      
      return insertedData;
    }
    
    return Promise.resolve(null);
  } catch (error) {
    console.error("Erreur dans la génération du PDF:", error);
    return Promise.reject(error);
  }
};
