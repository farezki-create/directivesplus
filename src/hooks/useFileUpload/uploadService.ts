
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const uploadFileToSupabase = async (
  file: File,
  customFileName: string,
  userId: string,
  documentType: string,
  saveToDirectives: boolean,
  isPrivate: boolean,
  onUploadComplete: (url: string, fileName: string, isPrivate: boolean) => void
) => {
  try {
    // Préparer le nom du fichier
    const originalName = file.name;
    const extension = originalName.substring(originalName.lastIndexOf('.')) || "";
    const finalFileName = customFileName ? (customFileName + extension) : originalName;

    // Convertir le fichier en data URI
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        if (!reader.result) {
          reject(new Error("Échec de la lecture du fichier"));
          return;
        }

        const dataUrl = reader.result.toString();
        const fileType = file.type;
        
        // Choisir la table selon le type de document et le paramètre saveToDirectives
        let tableName: 'uploaded_documents' | 'medical_documents' | 'pdf_documents' = 'uploaded_documents'; // Par défaut
        
        if (saveToDirectives) {
          if (documentType === 'medical') {
            tableName = 'medical_documents';
          } else {
            tableName = 'pdf_documents';
          }
        }
        
        console.log(`Enregistrement du document dans la table: ${tableName}`);
        console.log(`Type du document: ${fileType}`);
        
        try {
          // Créer les données du document selon la table
          let documentData: any = {
            file_name: finalFileName,
            file_path: dataUrl,
            description: `Document ${documentType === 'medical' ? 'médical' : ''} (${new Date().toLocaleString('fr-FR')})`,
            file_type: fileType,
            content_type: fileType,
            file_size: file.size,
            user_id: userId
          };

          // Ajouter des champs spécifiques aux documents médicaux
          if (tableName === 'medical_documents') {
            documentData = {
              ...documentData,
              is_visible_to_institutions: false, // Par défaut privé
              antivirus_status: 'pending'
            };
          }
          
          const { data, error } = await supabase
            .from(tableName)
            .insert([documentData])
            .select();

          if (error) {
            throw error;
          }

          if (data && data[0]) {
            onUploadComplete(dataUrl, finalFileName, isPrivate);
          }
          resolve(data);
        } catch (error) {
          console.error("Erreur lors de l'enregistrement du document:", error);
          toast({
            title: "Erreur",
            description: `Impossible d'enregistrer le document. ${error instanceof Error ? error.message : ''}`,
            variant: "destructive"
          });
          reject(error);
        }
      };

      reader.onerror = () => {
        const error = new Error("Erreur lors de la lecture du fichier");
        reject(error);
      };
    });
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    toast({
      title: "Erreur",
      description: "Le téléchargement a échoué",
      variant: "destructive"
    });
    throw error;
  }
};
