
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentScannerProps {
  open: boolean;
  onClose: () => void;
}

export const DocumentScanner = ({ open, onClose }: DocumentScannerProps) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, isUpload: boolean) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Here you would typically upload the file to your backend
      // For now, we'll just simulate a process with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: isUpload ? "Document téléchargé avec succès" : "Document scanné avec succès",
        description: `Le document ${file.name} a été ${isUpload ? 'téléchargé' : 'scanné'} et sauvegardé.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: isUpload ? "Erreur lors du téléchargement" : "Erreur lors du scan",
        description: "Une erreur est survenue lors du traitement du document.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleUploadClick = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un document de santé</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
          <input
            type="file"
            ref={cameraInputRef}
            onChange={(e) => handleFileChange(e, false)}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
          <input
            type="file"
            ref={uploadInputRef}
            onChange={(e) => handleFileChange(e, true)}
            accept="image/*,.pdf"
            className="hidden"
          />
          <Button
            onClick={handleCameraClick}
            disabled={uploading}
            className="w-full"
          >
            <Camera className="mr-2 h-4 w-4" />
            {uploading ? "Traitement en cours..." : "Prendre une photo"}
          </Button>
          <Button
            onClick={handleUploadClick}
            disabled={uploading}
            variant="outline"
            className="w-full"
          >
            <FileUp className="mr-2 h-4 w-4" />
            {uploading ? "Téléchargement en cours..." : "Télécharger un document"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
