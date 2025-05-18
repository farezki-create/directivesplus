
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
  const [isScanning, setIsScanning] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Implémentation simplifiée du scan de document
  const scanDocument = async () => {
    setIsScanning(true);
    
    try {
      // Simulation d'une intégration avec un scanner
      toast({
        title: "Scanner en cours d'initialisation",
        description: "Veuillez patienter..."
      });
      
      // Simule l'attente d'une opération de scan
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Scanner prêt",
        description: "Veuillez numériser votre document"
      });
      
      // Simule un scan terminé après quelques secondes (à remplacer par l'API réelle)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Dans un cas réel, l'image scannée serait récupérée depuis l'API du scanner
      // et convertie en File ou Blob
      const response = await fetch('/placeholder.svg');
      const blob = await response.blob();
      const scannedFile = new File([blob], 'document-scanné.png', { type: 'image/png' });
      
      setFile(scannedFile);
      toast({
        title: "Document numérisé avec succès",
        description: "Vous pouvez maintenant l'enregistrer"
      });
    } catch (error) {
      console.error("Erreur lors du scan:", error);
      toast({
        title: "Erreur de numérisation",
        description: "Impossible de numériser le document",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const uploadFile = async () => {
    if (!file || !userId) return;
    
    setUploading(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const table = documentType === 'medical' ? 'medical_documents' : 'pdf_documents';
        
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
          throw error;
        }
        
        // Appeler onUploadComplete avec le chemin du fichier, le nom et le statut privé
        onUploadComplete(base64data, file.name, isPrivate);
        
        // Réinitialiser le state du composant
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        toast({
          title: "Document téléchargé",
          description: "Votre document a été importé avec succès"
        });
      };
    } catch (error: any) {
      console.error("Erreur lors de l'upload du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return {
    file,
    uploading,
    isScanning,
    fileInputRef,
    isPrivate,
    setIsPrivate,
    handleFileChange,
    clearFile,
    uploadFile,
    previewFile,
    scanDocument
  };
};
