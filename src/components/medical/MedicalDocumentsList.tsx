
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Trash2, FileIcon, Image } from "lucide-react";
import { format } from "date-fns";
import { MedicalDocument } from "@/components/medical/types";
import { PDFPreviewDialog } from "@/components/pdf/PDFPreviewDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MedicalDocumentsListProps {
  documents: MedicalDocument[];
  previewUrl: string | null;
  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;
  onPreview: (document: MedicalDocument) => void;
  onDelete: (documentId: string) => void;
}

export function MedicalDocumentsList({
  documents,
  previewUrl,
  previewOpen,
  setPreviewOpen,
  onPreview,
  onDelete
}: MedicalDocumentsListProps) {
  const [documentToDelete, setDocumentToDelete] = React.useState<string | null>(null);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy à HH:mm");
  };

  const handleDeleteClick = (documentId: string) => {
    setDocumentToDelete(documentId);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      onDelete(documentToDelete);
      setDocumentToDelete(null);
    }
  };
  
  const getDocumentIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500 mr-2" />;
    }
    if (fileType.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500 mr-2" />;
    }
    if (fileType.includes('word') || fileType.includes('doc')) {
      return <FileText className="h-5 w-5 text-blue-700 mr-2" />;
    }
    return <FileIcon className="h-5 w-5 text-gray-500 mr-2" />;
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Aucun document médical enregistré
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <Card key={document.id} className="overflow-hidden">
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                {getDocumentIcon(document.file_type)}
                <span className="font-medium">{document.file_name}</span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mb-3">
              Ajouté le {formatDate(document.created_at)}
            </div>
            
            <div className="flex justify-end items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => onPreview(document)}
              >
                <Eye className="h-4 w-4" />
                Voir
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 text-red-500 hover:text-red-700"
                onClick={() => handleDeleteClick(document.id)}
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </Card>
      ))}
      
      {previewUrl && (
        <PDFPreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          pdfUrl={previewUrl}
        />
      )}
      
      <AlertDialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
