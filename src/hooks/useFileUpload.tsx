
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

export const useFileUpload = (
  userId: string, 
  onUploadComplete: (url: string, fileName: string, isPrivate: boolean) => void, 
  documentType = "directive",
  saveToDirectives = true // Contrôle où sauver le document
) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [customFileName, setCustomFileName] = useState("");
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
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
        
        // Choisir la table selon le type de document et le paramètre saveToDirectives
        let tableName = 'uploaded_documents'; // Par défaut
        
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

          clearFile();
          if (data && data[0]) {
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
      setPreviewUrl(url);
      setPreviewDialogOpen(true);
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

  const PreviewDialog = () => (
    <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prévisualisation du document</DialogTitle>
          <DialogDescription>
            {file && file.type.includes('image') && "Prévisualisation de l'image"}
            {file && file.type.includes('pdf') && "Prévisualisation du PDF"}
            {file && !file.type.includes('image') && !file.type.includes('pdf') && "Prévisualisation du document"}
          </DialogDescription>
        </DialogHeader>
        
        {previewUrl && file && file.type.includes('image') && (
          <div className="flex justify-center">
            <img 
              src={previewUrl} 
              alt="Prévisualisation" 
              className="max-h-[70vh] object-contain" 
            />
          </div>
        )}
        
        {previewUrl && file && file.type.includes('pdf') && (
          <iframe 
            src={previewUrl} 
            className="w-full h-[70vh]" 
            title="Prévisualisation PDF"
          />
        )}
        
        {previewUrl && file && !file.type.includes('image') && !file.type.includes('pdf') && (
          <div className="flex justify-center p-4 border rounded bg-gray-50">
            <p>Le type de fichier ({file.type}) ne peut pas être prévisualisé directement.</p>
          </div>
        )}
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
    RenameDialog,
    PreviewDialog,
    activateCamera
  };
};
