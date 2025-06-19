
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FileText, Eye, Download, Trash2, Calendar } from "lucide-react";
import { MedicalDocument } from "./types";
import MedicalDocumentVisibilityToggle from "./MedicalDocumentVisibilityToggle";

interface MedicalDocumentsListProps {
  documents: MedicalDocument[];
  onView: (filePath: string) => void;
  onDownload: (filePath: string, fileName: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isVisible: boolean) => void;
}

export const MedicalDocumentsList: React.FC<MedicalDocumentsListProps> = ({
  documents,
  onView,
  onDownload,
  onDelete,
  onVisibilityChange
}) => {
  // État local pour gérer la visibilité de chaque document
  const [documentVisibility, setDocumentVisibility] = useState<Record<string, boolean>>({});

  const handleVisibilityToggle = (documentId: string, isVisible: boolean) => {
    // Mettre à jour l'état local
    setDocumentVisibility(prev => ({
      ...prev,
      [documentId]: isVisible
    }));
    
    // Appeler la fonction parent si elle existe
    if (onVisibilityChange) {
      onVisibilityChange(documentId, isVisible);
    }
  };

  return (
    <>
      {documents.map((doc) => (
        <Card key={doc.id} className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <h3 className="font-medium truncate">{doc.file_name}</h3>
                  <Badge className="bg-blue-100 text-blue-800">
                    médical
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  {doc.file_size && (
                    <div>
                      {(doc.file_size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section de gestion de la visibilité */}
            <div className="mt-3">
              <MedicalDocumentVisibilityToggle
                documentId={doc.id}
                isVisibleToInstitutions={documentVisibility[doc.id] || false}
                onVisibilityChange={handleVisibilityToggle}
              />
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(doc.file_path)}
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                Consulter
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(doc.file_path, doc.file_name)}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Télécharger
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer le document médical</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer "{doc.file_name}" ? 
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(doc.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
