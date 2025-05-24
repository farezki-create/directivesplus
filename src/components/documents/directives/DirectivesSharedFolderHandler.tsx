
import React from "react";
import DirectivesDocumentList from "@/components/documents/DirectivesDocumentList";
import { Document } from "@/types/documents";

interface DirectivesSharedFolderHandlerProps {
  documents: Document[];
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
  accessCode?: string | null;
  profile?: {
    first_name?: string;
    last_name?: string;
    birth_date?: string;
  };
}

const DirectivesSharedFolderHandler: React.FC<DirectivesSharedFolderHandlerProps> = ({
  documents,
  onDownload,
  onPrint,
  onView,
  onDelete,
  accessCode,
  profile
}) => {
  return (
    <DirectivesDocumentList 
      documents={documents}
      onDownload={onDownload}
      onPrint={onPrint}
      onView={onView}
      onDelete={onDelete}
      showPrint={true}
    />
  );
};

export default DirectivesSharedFolderHandler;
