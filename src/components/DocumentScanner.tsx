
import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Upload, FileUp, ScanSearch } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentScannerProps {
  open: boolean;
  onClose: () => void;
}

export const DocumentScanner = ({ open, onClose }: DocumentScannerProps) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasNativeScannerApp, setHasNativeScannerApp] = useState(false);

  // Check if device supports native scanner app integration
  useEffect(() => {
    // Check for various scanner APIs
    const checkScannerSupport = async () => {
      // Check for various scanner capabilities
      const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      
      // Check for specific scanner APIs (these are not fully standardized)
      const hasWebScanAPI = 'ScannerDetector' in window || 
                           'scanner' in navigator || 
                           'DocumentScanner' in window;
      
      // Set state based on checks
      setHasNativeScannerApp(hasWebScanAPI || hasMediaDevices);
    };
    
    checkScannerSupport();
  }, []);

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

  const launchNativeScannerApp = () => {
    setScanning(true);
    
    // Try to use available scanner API
    try {
      // For WebScan API
      if ('ScannerDetector' in window) {
        (window as any).ScannerDetector.scan({
          success: handleScanSuccess,
          error: handleScanError,
          // Prefer rear camera for document scanning
          cameraDirection: 'environment'
        });
      } 
      // For navigator.scanner API
      else if ('scanner' in navigator) {
        (navigator as any).scanner.scan({
          success: handleScanSuccess,
          error: handleScanError,
          // Options for better document scanning
          quality: 'high',
          cameraFacing: 'environment' // Rear camera
        });
      }
      // For Android Intent-based scanning
      else if ('startActivity' in (window as any)) {
        // Use Android Intent system to launch scanner app if available
        (window as any).startActivity({
          action: 'android.media.action.IMAGE_CAPTURE',
          flags: ['FLAG_ACTIVITY_NEW_TASK'],
          success: handleScanSuccess,
          error: handleScanError
        });
      }
      // For iOS Document Scanner
      else if ('DocumentScanner' in window) {
        (window as any).DocumentScanner.scanDoc({
          sourceType: 1, // camera
          fileName: "scan",
          quality: 1.0,
          returnBase64: true,
          success: handleScanSuccess,
          error: handleScanError
        });
      }
      // Fallback to regular camera input with environment facing preference
      else {
        // Use a special input tag with "capture" attribute to try to invoke native camera app
        if (cameraInputRef.current) {
          cameraInputRef.current.click();
        }
      }
    } catch (error) {
      console.error("Error launching native scanner:", error);
      handleScanError(error);
    }
  };

  const handleScanSuccess = (result: any) => {
    setScanning(false);
    // Process scan result (could be Base64 data or file path)
    toast({
      title: "Document scanné avec succès",
      description: "Le document a été scanné et sauvegardé.",
    });
    onClose();
  };

  const handleScanError = (error: any) => {
    setScanning(false);
    console.error("Scanner error:", error);
    
    // Fallback to camera
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
    
    toast({
      title: "Erreur lors du scan",
      description: "Impossible d'utiliser l'application de scan. Utilisation de l'appareil photo à la place.",
      variant: "destructive",
    });
  };

  const handleScanClick = () => {
    if (hasNativeScannerApp) {
      launchNativeScannerApp();
    } else {
      // Fallback to regular camera input
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
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
            onClick={handleScanClick}
            disabled={scanning || uploading}
            className="w-full"
          >
            <ScanSearch className="mr-2 h-4 w-4" />
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
