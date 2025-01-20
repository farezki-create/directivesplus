import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentScannerProps {
  open: boolean;
  onClose: () => void;
}

export const DocumentScanner = ({ open, onClose }: DocumentScannerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setScanning(true);
    try {
      // Here you would typically upload the file to your backend
      // For now, we'll just simulate a scan with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Document scanné avec succès",
        description: `Le document ${file.name} a été scanné et sauvegardé.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erreur lors du scan",
        description: "Une erreur est survenue lors du scan du document.",
        variant: "destructive",
      });
    } finally {
      setScanning(false);
    }
  };

  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scanner un document de santé</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf"
            className="hidden"
          />
          <Button
            onClick={handleScanClick}
            disabled={scanning}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {scanning ? "Scan en cours..." : "Scanner un document"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};