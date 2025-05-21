
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useMedicalDocuments } from "@/hooks/useMedicalDocuments";
import MedicalDocumentList from "@/components/medical/MedicalDocumentList";
import MedicalHeader from "@/components/medical/MedicalHeader";

export interface MedicalDataTabProps {
  decryptedContent: any;
  decryptionError?: string | null;
}

const MedicalDataTab: React.FC<MedicalDataTabProps> = ({ decryptedContent, decryptionError }) => {
  const {
    documents,
    loading,
    error,
    refreshDocuments,
    handleDownloadDocument,
    handleViewDocument,
    handlePrintDocument,
    handleDeleteDocument,
    documentToDelete,
    setDocumentToDelete,
    confirmDelete
  } = useMedicalDocuments(decryptedContent?.user_id);

  // Display error if there is one
  if (decryptionError || error) {
    return (
      <CardContent className="p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            {decryptionError || error || "Impossible de charger les données médicales."}
          </AlertDescription>
        </Alert>
      </CardContent>
    );
  }

  return (
    <>
      <MedicalHeader userId={decryptedContent?.user_id} onUploadComplete={refreshDocuments} />
      <CardContent className="p-6">
        <MedicalDocumentList
          documents={documents}
          loading={loading}
          onDownload={handleDownloadDocument}
          onView={handleViewDocument}
          onPrint={handlePrintDocument}
          onDelete={handleDeleteDocument}
          documentToDelete={documentToDelete}
          setDocumentToDelete={setDocumentToDelete}
          confirmDelete={confirmDelete}
        />
      </CardContent>
    </>
  );
};

export default MedicalDataTab;
