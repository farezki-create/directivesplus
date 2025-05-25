
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MedicalDocumentUploader from "./MedicalDocumentUploader";
import MedicalDocumentList from "./MedicalDocumentList";
import { useMedicalDocumentOperations } from "@/hooks/useMedicalDocumentOperations";

interface MedicalDocumentSectionProps {
  userId?: string;
  onUploadComplete: () => void;
  onDocumentAdd: (documentInfo: any) => void;
  onDocumentRemove?: (documentId: string) => void;
}

const MedicalDocumentSection = ({ 
  userId, 
  onUploadComplete, 
  onDocumentAdd, 
  onDocumentRemove 
}: MedicalDocumentSectionProps) => {
  const {
    uploadedDocuments,
    deletingDocuments,
    handleDocumentUpload,
    handleDeleteDocument,
    handlePreviewDocument
  } = useMedicalDocumentOperations({
    userId,
    onDocumentAdd,
    onDocumentRemove,
    onUploadComplete
  });

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Documents médicaux</CardTitle>
        <p className="text-sm text-gray-600">
          Ajoutez vos documents médicaux qui seront automatiquement intégrés dans votre PDF de directives anticipées.
          Les documents sont immédiatement disponibles pour inclusion.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <MedicalDocumentUploader
            userId={userId}
            onUploadComplete={handleDocumentUpload}
          />
          
          <MedicalDocumentList
            documents={uploadedDocuments}
            deletingDocuments={deletingDocuments}
            onDeleteDocument={handleDeleteDocument}
            onPreviewDocument={handlePreviewDocument}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalDocumentSection;
