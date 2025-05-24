
import React from "react";
import { ShareableDocument } from "@/hooks/sharing/useUnifiedDocumentSharing";
import DirectivesPageContainer from "./directives/DirectivesPageContainer";

interface DirectivesPageContentProps {
  documents: ShareableDocument[];
  showAddOptions: boolean;
  setShowAddOptions: (show: boolean) => void;
  userId: string;
  onUploadComplete: (url: string, fileName: string, isPrivate: boolean) => void;
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

/**
 * Main entry point component for the directives page
 * This is kept for backward compatibility and delegates to the container component
 */
const DirectivesPageContent: React.FC<DirectivesPageContentProps> = (props) => {
  return <DirectivesPageContainer {...props} />;
};

export default DirectivesPageContent;
