
import React from "react";
import DirectivesDocumentList from "./DirectivesDocumentList";
import MedicalDocumentsSection from "./MedicalDocumentsSection";
import { Document } from "@/types/documents";

interface DirectivesPageContentProps {
  documents: Document[];
  userId?: string;
  onUploadComplete?: (url: string, fileName: string, isPrivate: boolean) => void;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
  accessCode?: string | null;
  profile?: {
    first_name?: string;
    last_name?: string;
    birth_date?: string;
  };
}

const DirectivesPageContent: React.FC<DirectivesPageContentProps> = ({
  documents,
  userId,
  onUploadComplete,
  onDownload,
  onPrint,
  onView,
  onDelete,
  onVisibilityChange,
  accessCode,
  profile
}) => {
  return (
    <div className="space-y-8">
      {/* Section documents de directives anticipées */}
      <DirectivesDocumentList 
        documents={documents}
        onDownload={onDownload}
        onPrint={onPrint}
        onView={onView}
        onDelete={onDelete}
        onVisibilityChange={onVisibilityChange}
        showPrint={true}
      />
      
      {/* Section documents médicaux */}
      {userId && (
        <MedicalDocumentsSection userId={userId} />
      )}
    </div>
  );
};

export default DirectivesPageContent;
