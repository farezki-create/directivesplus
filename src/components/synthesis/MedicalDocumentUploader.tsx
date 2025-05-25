
import DocumentUploader from "@/components/documents/DocumentUploader";

interface MedicalDocumentUploaderProps {
  userId?: string;
  onUploadComplete: (url: string, fileName: string) => void;
}

const MedicalDocumentUploader = ({ userId, onUploadComplete }: MedicalDocumentUploaderProps) => {
  return (
    <DocumentUploader
      userId={userId}
      onUploadComplete={onUploadComplete}
      documentType="medical"
    />
  );
};

export default MedicalDocumentUploader;
