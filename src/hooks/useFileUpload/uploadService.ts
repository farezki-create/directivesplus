
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
        
        console.log(`Type du document: ${documentType}`);
        console.log(`Type de fichier: ${fileType}`);
        
        try {
          let data;
          let error;
          
          if (documentType === 'medical') {
            // Enregistrer dans la table medical_documents
            const documentData = {
              file_name: finalFileName,
              file_path: dataUrl,
              description: `Document médical ajouté le ${new Date().toLocaleString('fr-FR')}`,
              file_type: fileType,
              file_size: file.size,
              user_id: userId
            };
            
            console.log('Enregistrement du document dans la table: medical_documents');
            
            const result = await supabase
              .from('medical_documents')
              .insert([documentData])
              .select();
            
            data = result.data;
            error = result.error;
          } else if (saveToDirectives) {
            // Enregistrer dans pdf_documents pour les directives
            const documentData = {
              file_name: finalFileName,
              file_path: dataUrl,
              description: `Document directive ajouté le ${new Date().toLocaleString('fr-FR')}`,
              file_type: fileType,
              content_type: fileType,
              file_size: file.size,
              user_id: userId
            };
            
            console.log('Enregistrement du document dans la table: pdf_documents');
            
            const result = await supabase
              .from('pdf_documents')
              .insert([documentData])
              .select();
            
            data = result.data;
            error = result.error;
          } else {
            // Enregistrer dans uploaded_documents pour les autres cas
            const documentData = {
              file_name: finalFileName,
              file_path: dataUrl,
              description: `Document ajouté le ${new Date().toLocaleString('fr-FR')}`,
              file_type: fileType,
              file_size: file.size,
              user_id: userId
            };
            
            console.log('Enregistrement du document dans la table: uploaded_documents');
            
            const result = await supabase
              .from('uploaded_documents')
              .insert([documentData])
              .select();
            
            data = result.data;
            error = result.error;
          }

          if (error) {
            console.error("Erreur lors de l'enregistrement:", error);
            throw error;
          }

          if (data && data[0]) {
            console.log("Document enregistré avec succès:", data[0]);
            onUploadComplete(dataUrl, finalFileName, isPrivate);
            toast({
              title: "Document enregistré",
              description: `Votre document ${finalFileName} a été enregistré avec succès`,
            });
          }
          resolve(data);
        } catch (error) {
          console.error("Erreur lors de l'enregistrement du document:", error);
          toast({
            title: "Erreur",
            description: `Impossible d'enregistrer le document. ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
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
