
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DocumentUploader from "../DocumentUploader";
import { useMedicalDocuments } from "./useMedicalDocuments";
import MedicalDocumentsList from "./MedicalDocumentsList";

interface MedicalDocumentsMainProps {
  userId: string;
}

export const MedicalDocumentsMain: React.FC<MedicalDocumentsMainProps> = ({ userId }) => {
  const [showUploader, setShowUploader] = useState(false);
  const { documents, loading, loadMedicalDocuments, handleVisibilityToggle, handleDelete } = useMedicalDocuments(userId);

  const handleUploadComplete = () => {
    loadMedicalDocuments();
    setShowUploader(false);
    toast({
      title: "Document médical ajouté",
      description: "Votre document médical a été ajouté avec succès",
    });
  };

  const handleView = (filePath: string) => {
    window.open(filePath, '_blank');
  };

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents Médicaux
        </CardTitle>
        <p className="text-sm text-gray-600">
          Ajoutez vos documents médicaux (radiologies, analyses, ordonnances, etc.) 
          et choisissez leur visibilité pour les institutions de soins.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            {documents.length} document{documents.length !== 1 ? 's' : ''} médical{documents.length !== 1 ? 'aux' : ''}
          </div>
          <Button 
            onClick={() => setShowUploader(!showUploader)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Ajouter un document médical
          </Button>
        </div>

        {showUploader && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <DocumentUploader
              userId={userId}
              onUploadComplete={handleUploadComplete}
              documentType="medical"
              saveToDirectives={false}
            />
            <Button 
              variant="outline" 
              onClick={() => setShowUploader(false)}
              className="mt-2"
            >
              Annuler
            </Button>
          </div>
        )}

        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun document médical ajouté</p>
            <p className="text-sm">Cliquez sur "Ajouter un document médical" pour commencer</p>
          </div>
        ) : (
          <MedicalDocumentsList
            documents={documents}
            onDownload={handleDownload}
            onDelete={handleDelete}
            onVisibilityChange={handleVisibilityToggle}
          />
        )}
      </CardContent>
    </Card>
  );
};
