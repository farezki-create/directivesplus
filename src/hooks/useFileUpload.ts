
import { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useFileUpload = (
  userId: string, 
  onUploadComplete: (url: string, fileName: string, isPrivate: boolean) => void,
  documentType: "directive" | "medical"
) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Format non supporté",
          description: "Veuillez sélectionner un document PDF ou une image (JPEG/PNG)",
          variant: "destructive"
        });
        return;
      }
      
      // Vérifier la taille du fichier (max 10 MB)
      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale autorisée est de 10 MB",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
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

  const previewFile = () => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = URL.createObjectURL(file);
      window.open(url, "_blank");
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async () => {
    if (!file || !userId) {
      toast({
        title: "Aucun fichier sélectionné",
        description: "Veuillez sélectionner un document à enregistrer",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const table = documentType === 'medical' ? 'medical_documents' : 'pdf_documents';
        
        console.log(`Enregistrement du document dans la table: ${table}`);
        console.log(`Type du document: ${file.type}`);
        
        // Créer un nouvel enregistrement dans la table appropriée
        const { data, error } = await supabase
          .from(table)
          .insert({
            user_id: userId,
            file_name: file.name,
            file_path: base64data, // Stocker directement en base64 data URI
            content_type: file.type,
            file_size: file.size,
            is_private: isPrivate,
            description: documentType === 'medical' 
              ? 'Document médical importé le ' + new Date().toLocaleDateString('fr-FR')
              : 'Document importé le ' + new Date().toLocaleDateString('fr-FR'),
            created_at: new Date().toISOString()
          })
          .select();
        
        if (error) {
          console.error("Erreur lors de l'enregistrement du document:", error);
          throw error;
        }
        
        console.log("Document enregistré avec succès:", data);
        
        // Appeler onUploadComplete avec le chemin du fichier, le nom et le statut privé
        onUploadComplete(base64data, file.name, isPrivate);
        
        // Réinitialiser le state du composant
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (cameraInputRef.current) {
          cameraInputRef.current.value = '';
        }
        
        toast({
          title: "Document enregistré",
          description: "Votre document a été importé avec succès"
        });
      };
    } catch (error: any) {
      console.error("Erreur lors de l'upload du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return {
    file,
    uploading,
    fileInputRef,
    cameraInputRef,
    isPrivate,
    setIsPrivate,
    handleFileChange,
    clearFile,
    uploadFile,
    previewFile
  };
};
