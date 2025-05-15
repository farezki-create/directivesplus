
import { FC } from "react";
import AudioRecorder from "@/components/documents/AudioRecorder";
import DocumentUploader from "@/components/documents/DocumentUploader";

interface DirectivesAddDocumentSectionProps {
  userId: string;
  onUploadComplete: (url: string, fileName: string) => void;
  documentType?: "directive" | "medical";
}

const DirectivesAddDocumentSection: FC<DirectivesAddDocumentSectionProps> = ({
  userId,
  onUploadComplete,
  documentType = "directive"
}) => {
  return (
    <div className="mb-8">
      <AudioRecorder 
        userId={userId}
        onRecordingComplete={onUploadComplete}
      />
      <DocumentUploader 
        userId={userId}
        onUploadComplete={onUploadComplete}
        documentType={documentType}
      />
    </div>
  );
};

export default DirectivesAddDocumentSection;
