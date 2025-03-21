import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentScannerProps {
  open: boolean;
  onClose: () => void;
}

export const DocumentScanner = ({ open, onClose }: DocumentScannerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, isUpload: boolean) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const action = isUpload ? setUploading : setScanning;
    action(true);

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
      action(false);
    }
  };

  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
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
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e, false)}
            accept="image/*,.pdf"
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
            onClick={handleScanClick}
            disabled={scanning || uploading}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {scanning ? "Scan en cours..." : "Scanner un document"}
          </Button>
          <Button
            onClick={handleUploadClick}
            disabled={scanning || uploading}
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