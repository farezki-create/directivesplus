
import { FC } from "react";
import AudioRecorder from "@/components/documents/AudioRecorder";
import DocumentUploader from "@/components/documents/DocumentUploader";

interface DirectivesAddDocumentSectionProps {
  showAddOptions: boolean;
  setShowAddOptions: (show: boolean) => void;
  onUploadComplete: () => void;
}

const DirectivesAddDocumentSection: FC<DirectivesAddDocumentSectionProps> = ({
  showAddOptions,
  setShowAddOptions,
  onUploadComplete
}) => {
  if (!showAddOptions) return null;

  return (
    <div className="mb-8">
      <AudioRecorder 
        userId=""
        onRecordingComplete={(url, fileName) => onUploadComplete()}
      />
      <DocumentUploader 
        userId=""
        onUploadComplete={onUploadComplete}
        documentType="directive"
      />
    </div>
  );
};

export default DirectivesAddDocumentSection;
