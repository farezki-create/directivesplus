
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useFileUpload = (userId: string, onUploadComplete: (url: string, fileName: string, isPrivate: boolean) => void, documentType = "directive") => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const uploadFile = async () => {
    if (!file) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier à télécharger",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);

      // Convertir le fichier en data URI
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = async () => {
        if (!reader.result) {
          throw new Error("Échec de la lecture du fichier");
        }

        const dataUrl = reader.result.toString();
        const fileType = file.type;
        const tableName = documentType === 'medical' ? 'medical_documents' : 'pdf_documents';
        
        console.log(`Enregistrement du document dans la table: ${tableName}`);
        console.log(`Type du document: ${fileType}`);
        
        try {
          // Create document record without the is_private field for medical_documents
          const documentData = {
            file_name: file.name,
            file_path: dataUrl,
            description: `Document ${documentType === 'medical' ? 'médical' : ''} (${new Date().toLocaleString('fr-FR')})`,
            file_type: fileType,
            file_size: file.size,
            user_id: userId
          };
          
          const { data, error } = await supabase
            .from(tableName)
            .insert([documentData])
            .select();

          if (error) {
            throw error;
          }

          clearFile();
          if (data && data[0]) {
            // Still pass isPrivate to the callback for UI display purposes
            // even though it's not stored in the database
            onUploadComplete(dataUrl, file.name, isPrivate);
          }
        } catch (error) {
          console.error("Erreur lors de l'enregistrement du document:", error);
          toast({
            title: "Erreur",
            description: `Impossible d'enregistrer le document. ${error instanceof Error ? error.message : ''}`,
            variant: "destructive"
          });
        }
      };

      reader.onerror = () => {
        throw new Error("Erreur lors de la lecture du fichier");
      };
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Le téléchargement a échoué",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const previewFile = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    }
  };

  return {
    file,
    uploading,
    fileInputRef,
    cameraInputRef,
    handleFileChange,
    clearFile,
    uploadFile,
    previewFile,
    setIsPrivate,
    isPrivate
  };
};
