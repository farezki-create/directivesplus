
import { FC } from "react";
import AudioRecorder from "@/components/documents/AudioRecorder";
import DocumentUploader from "@/components/documents/DocumentUploader";
import { DocumentUploaderProps } from "./types";

const DirectivesAddDocumentSection: FC<DocumentUploaderProps> = ({
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
