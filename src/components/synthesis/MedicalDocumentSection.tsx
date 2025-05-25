
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DocumentUploader from "@/components/documents/DocumentUploader";

interface MedicalDocumentSectionProps {
  userId?: string;
  onUploadComplete: () => void;
}

const MedicalDocumentSection = ({ userId, onUploadComplete }: MedicalDocumentSectionProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Document médical de synthèse</CardTitle>
        <p className="text-sm text-gray-600">
          Ajoutez un document médical de synthèse des maladies pour compléter vos directives anticipées. 
          Ce document sera intégré dans votre PDF final.
        </p>
      </CardHeader>
      <CardContent>
        <DocumentUploader 
          userId={userId || ""}
          onUploadComplete={onUploadComplete}
          documentType="medical"
        />
      </CardContent>
    </Card>
  );
};

export default MedicalDocumentSection;
