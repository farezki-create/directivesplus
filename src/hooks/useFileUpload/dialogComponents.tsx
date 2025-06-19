
import React from "react";
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

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customFileName: string;
  onFileNameChange: (name: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const RenameDialog: React.FC<RenameDialogProps> = ({
  open,
  onOpenChange,
  customFileName,
  onFileNameChange,
  onCancel,
  onConfirm
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
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
          onChange={(e) => onFileNameChange(e.target.value)}
          className="mt-2"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button onClick={onConfirm}>Enregistrer</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewUrl: string | null;
  file: File | null;
}

export const PreviewDialog: React.FC<PreviewDialogProps> = ({
  open,
  onOpenChange,
  previewUrl,
  file
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
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
