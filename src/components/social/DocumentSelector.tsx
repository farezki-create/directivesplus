
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus } from "lucide-react";
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { Document } from "@/types/documents";

interface DocumentSelectorProps {
  onDocumentSelect: (document: Document) => void;
  disabled?: boolean;
}

const DocumentSelector = ({ onDocumentSelect, disabled }: DocumentSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { documents, isLoading } = useDirectivesDocuments();

  const handleDocumentSelect = (document: Document) => {
    onDocumentSelect(document);
    setOpen(false);
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
        
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun document disponible pour le partage</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleDocumentSelect(document)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{document.file_name}</p>
                      {document.description && (
                        <p className="text-sm text-gray-600">{document.description}</p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentSelector;
