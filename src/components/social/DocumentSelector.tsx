
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, AlertTriangle } from "lucide-react";
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { Document } from "@/types/documents";

interface DocumentSelectorProps {
  onDocumentSelect: (document: Document) => void;
  disabled?: boolean;
}

// Formats de fichiers autorisés pour le partage (formats sûrs)
const SAFE_FILE_FORMATS = [
  'application/pdf',
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'text/plain'
];

const DocumentSelector = ({ onDocumentSelect, disabled }: DocumentSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { documents, isLoading } = useDirectivesDocuments();

  // Filtrer les documents selon les formats autorisés
  const safeDocuments = documents.filter(doc => 
    SAFE_FILE_FORMATS.includes(doc.file_type) || 
    SAFE_FILE_FORMATS.includes(doc.content_type || '')
  );

  const handleDocumentSelect = (document: Document) => {
    onDocumentSelect(document);
    setOpen(false);
  };

  const getFileTypeLabel = (fileType: string) => {
    switch (fileType) {
      case 'application/pdf':
        return 'PDF';
      case 'image/jpeg':
      case 'image/jpg':
        return 'JPEG';
      case 'image/png':
        return 'PNG';
      case 'image/gif':
        return 'GIF';
      case 'image/webp':
        return 'WebP';
      case 'text/plain':
        return 'Texte';
      default:
        return 'Fichier';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Partager un document
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Sélectionner un document à partager</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Formats autorisés pour le partage :</p>
              <p>PDF, Images (JPEG, PNG, GIF, WebP) et fichiers texte uniquement</p>
            </div>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
            </div>
          ) : safeDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun document au format autorisé disponible pour le partage</p>
              <p className="text-xs mt-2">Seuls les PDF, images et fichiers texte peuvent être partagés</p>
            </div>
          ) : (
            <div className="space-y-3">
              {safeDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleDocumentSelect(document)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{document.file_name}</p>
                      {document.description && (
                        <p className="text-sm text-gray-600">{document.description}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Format: {getFileTypeLabel(document.file_type)}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {documents.length > safeDocuments.length && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>{documents.length - safeDocuments.length}</strong> document(s) non affiché(s) 
                car leur format n'est pas autorisé pour le partage
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentSelector;
