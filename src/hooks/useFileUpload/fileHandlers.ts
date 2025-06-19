
import { RefObject } from "react";
import { toast } from "@/hooks/use-toast";

export const createFileHandlers = (
  setFile: (file: File | null) => void,
  setCustomFileName: (name: string) => void,
  fileInputRef: RefObject<HTMLInputElement>,
  cameraInputRef: RefObject<HTMLInputElement>
) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      // Initialiser le nom personnalisé avec le nom du fichier (sans l'extension)
      const fileName = selectedFile.name;
      const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      setCustomFileName(fileNameWithoutExtension);
    }
  };

  const activateCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const clearFile = () => {
    setFile(null);
    setCustomFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const initiateUpload = (file: File | null, setShowRenameDialog: (show: boolean) => void) => {
    if (!file) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier à télécharger",
        variant: "destructive"
      });
      return;
    }
    
    setShowRenameDialog(true);
  };

  const previewFile = (file: File | null, setPreviewUrl: (url: string | null) => void, setPreviewDialogOpen: (open: boolean) => void) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreviewDialogOpen(true);
    }
  };

  return {
    handleFileChange,
    activateCamera,
    clearFile,
    initiateUpload,
    previewFile
  };
};
