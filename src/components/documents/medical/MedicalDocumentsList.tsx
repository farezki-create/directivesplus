
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Download, Trash2, FileText, Calendar, HardDrive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Document } from "@/types/documents";
import MedicalDocumentVisibilityToggle from "./MedicalDocumentVisibilityToggle";

interface MedicalDocument extends Document {
  is_private?: boolean;
}

interface MedicalDocumentsListProps {
  documents: MedicalDocument[];
  onDownload: (filePath: string, fileName: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
  loading?: boolean;
}

const MedicalDocumentsList: React.FC<MedicalDocumentsListProps> = ({
  documents,
  onDownload,
  onDelete,
  onVisibilityChange,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Aucun document médical ajouté</p>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-lg">{doc.file_name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Document médical ajouté le {new Date(doc.created_at).toLocaleDateString('fr-FR')} {new Date(doc.created_at).toLocaleTimeString('fr-FR')}
                      </span>
                    </div>
                    {doc.file_size && (
                      <div className="flex items-center gap-1">
                        <HardDrive className="h-4 w-4" />
                        <span>{formatFileSize(doc.file_size)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Badge variant="secondary">médical</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {onVisibilityChange && (
                  <MedicalDocumentVisibilityToggle
                    documentId={doc.id}
                    isVisibleToInstitutions={!doc.is_private}
                    onVisibilityChange={(documentId, isVisible) => onVisibilityChange(documentId, !isVisible)}
                  />
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(doc.file_path, doc.file_name)}
                  className="flex items-center gap-1"
                >
                  <Download size={16} />
                  Télécharger
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(doc.id)}
                  className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Supprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MedicalDocumentsList;
