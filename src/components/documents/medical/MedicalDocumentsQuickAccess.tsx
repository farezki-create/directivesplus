
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye, Download, Trash2, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useMedicalDocuments } from "./useMedicalDocuments";
import { MedicalDocumentsList } from "./MedicalDocumentsList";
import DocumentUploader from "../DocumentUploader";
import DocumentPreviewDialog from "../DocumentPreviewDialog";
import { useDocumentOperations } from "@/hooks/useDocumentOperations";

const MedicalDocumentsQuickAccess: React.FC = () => {
  const { user } = useAuth();
  const [showUploader, setShowUploader] = useState(false);
  
  // Utiliser le hook pour gérer les documents médicaux
  const {
    documents,
    loading,
    loadMedicalDocuments,
    handleDelete,
    handleVisibilityToggle
  } = useMedicalDocuments(user?.id || '');

  // Utiliser le hook pour les opérations sur les documents
  const {
    previewDocument,
    setPreviewDocument,
    handleView,
    handleDownload,
    handlePrint
  } = useDocumentOperations(loadMedicalDocuments);

  const handleUploadComplete = () => {
    setShowUploader(false);
    // Recharger la liste des documents après l'ajout
    loadMedicalDocuments();
    toast({
      title: "Document médical ajouté",
      description: "Votre document médical a été ajouté avec succès",
    });
  };

  const handleVisibilityChange = (documentId: string, isVisible: boolean) => {
    handleVisibilityToggle(documentId, isVisible);
  };

  if (!user) return null;

  return (
    <>
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <FileText className="h-5 w-5" />
            Documents Médicaux
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-blue-700">
              {documents.length} document{documents.length !== 1 ? 's' : ''} médical{documents.length !== 1 ? 'aux' : ''}
            </p>
            <Button 
              onClick={() => setShowUploader(!showUploader)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Ajouter un document médical
            </Button>
          </div>

          {showUploader && (
            <div className="mt-4 p-4 border rounded-lg bg-white">
              <DocumentUploader
                userId={user.id}
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

          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Aucun document médical ajouté</p>
            </div>
          ) : (
            <div className="space-y-3">
              <MedicalDocumentsList
                documents={documents}
                onView={handleView}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onVisibilityChange={handleVisibilityChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de prévisualisation */}
      <DocumentPreviewDialog
        filePath={previewDocument}
        onOpenChange={(open) => !open && setPreviewDocument(null)}
        onDownload={handleDownload}
        onPrint={handlePrint}
      />
    </>
  );
};

export default MedicalDocumentsQuickAccess;
