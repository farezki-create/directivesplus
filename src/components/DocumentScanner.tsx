
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentScannerProps {
  open: boolean;
  onClose: () => void;
  onDocumentAdded?: () => void;
}

export const DocumentScanner = ({ open, onClose, onDocumentAdded }: DocumentScannerProps) => {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Vous devez être connecté pour télécharger un document");
      }
      
      const userId = session.user.id;
      
      // Upload file to Supabase Storage
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('medical_documents')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Add file record to the database
      const { error: dbError } = await supabase
        .from('medical_documents')
        .insert({
          user_id: userId,
          file_path: filePath,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          description: "Document médical"
        });
        
      if (dbError) throw dbError;
      
      toast({
        title: "Document téléchargé avec succès",
        description: `Le document ${file.name} a été téléchargé et sauvegardé.`,
      });
      
      // Reset the file input
      if (uploadInputRef.current) uploadInputRef.current.value = '';
      
      // Notify parent component that a document was added
      if (onDocumentAdded) onDocumentAdded();
      
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Erreur lors du téléchargement",
        description: "Une erreur est survenue lors du traitement du document.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
            ref={uploadInputRef}
            onChange={(e) => handleFileChange(e)}
            accept="image/*,.pdf"
            className="hidden"
            id="file-upload-input"
          />
          
          <Button
            onClick={handleUploadClick}
            disabled={uploading}
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
