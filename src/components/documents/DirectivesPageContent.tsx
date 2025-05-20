
import React from "react";
import { Document } from "@/hooks/useDirectivesDocuments";
import DirectivesPageHeader from "@/components/documents/DirectivesPageHeader";
import DirectivesAddDocumentSection from "@/components/documents/DirectivesAddDocumentSection";
import DirectivesDocumentList from "@/components/documents/DirectivesDocumentList";

interface DirectivesPageContentProps {
  documents: Document[];
  showAddOptions: boolean;
  setShowAddOptions: (show: boolean) => void;
  userId: string;
  onUploadComplete: (url: string, fileName: string, isPrivate: boolean) => void;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
  accessCode?: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    birth_date?: string;
  };
}

const DirectivesPageContent: React.FC<DirectivesPageContentProps> = ({
  documents,
  showAddOptions,
  setShowAddOptions,
  userId,
  onUploadComplete,
  onDownload,
  onPrint,
  onView,
  onDelete,
  accessCode,
  profile
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <DirectivesPageHeader 
        onAddDocument={() => setShowAddOptions(!showAddOptions)} 
      />

      {showAddOptions && userId && (
        <DirectivesAddDocumentSection 
          userId={userId}
          onUploadComplete={onUploadComplete}
        />
      )}
      
      <DirectivesDocumentList 
        documents={documents}
        onDownload={onDownload}
        onPrint={onPrint}
        onView={onView}
        onDelete={onDelete}
        onVisibilityChange={(id, isPrivate) => {
          console.log("DirectivesPageContent - Changement de visibilité:", id, isPrivate);
          // You can implement visibility change handling here
        }}
      />
    </div>
  );
};

export default DirectivesPageContent;
