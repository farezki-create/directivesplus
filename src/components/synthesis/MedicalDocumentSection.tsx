
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";
import { useMedicalDocumentOperations } from "@/hooks/useMedicalDocumentOperations";
import MedicalDocumentUploader from "./medical/MedicalDocumentUploader";
import MedicalDocumentsList from "./medical/MedicalDocumentsList";

interface MedicalDocumentSectionProps {
  userId?: string;
  onUploadComplete: () => void;
  onDocumentAdd: (documentInfo: any) => void;
  onDocumentRemove?: (documentId: string) => void;
}

const MedicalDocumentSection = ({ userId, onUploadComplete, onDocumentAdd, onDocumentRemove }: MedicalDocumentSectionProps) => {
  const {
    uploadedDocuments,
    deletingDocuments,
    previewDocument,
    setPreviewDocument,
    handleDocumentUpload,
    handleDeleteDocument,
    handlePreviewDocument,
    handleIncorporateDocument
  } = useMedicalDocumentOperations({ userId, onUploadComplete, onDocumentAdd, onDocumentRemove });

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Documents médicaux</CardTitle>
          <p className="text-sm text-gray-600">
            Ajoutez vos documents médicaux qui seront automatiquement intégrés dans votre PDF de directives anticipées.
            Les documents sont immédiatement ouverts pour incorporation après l'import.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MedicalDocumentUploader
              userId={userId}
              onUploadComplete={handleDocumentUpload}
            />
            
            <MedicalDocumentsList
              documents={uploadedDocuments}
              deletingDocuments={deletingDocuments}
              onPreview={handlePreviewDocument}
              onIncorporate={handleIncorporateDocument}
              onDelete={handleDeleteDocument}
            />
          </div>
        </CardContent>
      </Card>

      <DocumentPreviewDialog
        filePath={previewDocument}
        onOpenChange={(open) => !open && setPreviewDocument(null)}
        showPrint={false}
      />
    </>
  );
};

export default MedicalDocumentSection;
