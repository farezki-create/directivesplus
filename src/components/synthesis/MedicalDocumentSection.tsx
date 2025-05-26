
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";
import { useMedicalDocumentOperations } from "@/hooks/useMedicalDocumentOperations";
import MedicalDocumentUploader from "./medical/MedicalDocumentUploader";
import PdfContentExtractor from "./medical/PdfContentExtractor";

interface MedicalDocumentSectionProps {
  userId?: string;
  onUploadComplete: () => void;
  onDocumentAdd: (documentInfo: any) => void;
  onDocumentRemove?: (documentId: string) => void;
}

const MedicalDocumentSection = ({ userId, onUploadComplete, onDocumentAdd, onDocumentRemove }: MedicalDocumentSectionProps) => {
  const {
    uploadedDocuments,
    previewDocument,
    setPreviewDocument,
    handleDocumentUpload,
    handleDeleteDocument,
  } = useMedicalDocumentOperations({ userId, onUploadComplete, onDocumentAdd, onDocumentRemove });

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Documents médicaux</CardTitle>
          <p className="text-sm text-gray-600">
            Ajoutez vos documents médicaux PDF. Le contenu sera extrait et affiché ci-dessous, 
            puis automatiquement intégré dans votre PDF de directives anticipées.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MedicalDocumentUploader
              userId={userId}
              onUploadComplete={handleDocumentUpload}
            />
            
            {uploadedDocuments.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Documents médicaux ajoutés :
                </h4>
                {uploadedDocuments.map((doc) => (
                  <PdfContentExtractor
                    key={doc.id}
                    document={doc}
                    onRemove={handleDeleteDocument}
                  />
                ))}
              </div>
            )}
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
