
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const useFileUpload = (userId: string, onUploadComplete: (url: string, fileName: string, isPrivate: boolean) => void, documentType = "directive") => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [customFileName, setCustomFileName] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const initiateUpload = () => {
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

  const uploadFile = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      setShowRenameDialog(false);

      // Préparer le nom du fichier
      const originalName = file.name;
      const extension = originalName.substring(originalName.lastIndexOf('.')) || "";
      const finalFileName = customFileName ? (customFileName + extension) : originalName;

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
          // Create document record
          const documentData = {
            file_name: finalFileName,
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
            // Passer isPrivate pour les besoins de l'UI même si non stocké dans la DB
            onUploadComplete(dataUrl, finalFileName, isPrivate);
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

  const RenameDialog = () => (
    <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renommer le document</DialogTitle>
          <DialogDescription>
            Vous pouvez renommer le document avant de l'enregistrer.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="fileName">Nom du document</Label>
          <Input 
            id="fileName" 
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
            className="mt-2"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowRenameDialog(false)}>Annuler</Button>
          <Button onClick={uploadFile}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return {
    file,
    uploading,
    fileInputRef,
    cameraInputRef,
    handleFileChange,
    clearFile,
    initiateUpload,
    previewFile,
    setIsPrivate,
    isPrivate,
    RenameDialog
  };
};
