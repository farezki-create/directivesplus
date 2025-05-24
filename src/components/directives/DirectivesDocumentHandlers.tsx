
import { Document } from "@/types/documents";

interface DirectivesDocumentHandlersProps {
  documents: Document[];
  previewDocument: Document | null;
  setPreviewDocument: (doc: Document | null) => void;
  handleDownload: (filePath: string, fileName: string) => void;
  handlePrint: (filePath: string, fileType?: string) => void;
  handleView: (filePath: string, fileType?: string) => void;
}

export const useDirectivesDocumentHandlers = ({
  documents,
  previewDocument,
  setPreviewDocument,
  handleDownload,
  handlePrint,
  handleView
}: DirectivesDocumentHandlersProps) => {
  
  const handleUploadCompleteWrapper = () => {
    // For this context, we don't have the specific parameters,
    // so we'll call refresh documents directly
    window.location.reload();
  };

  // Enhanced view handler that sets preview document
  const handleViewDocument = (filePath: string, fileType?: string) => {
    console.log("DirectivesDocs - handleViewDocument appelé avec:", filePath, fileType);
    
    // Find the document by file_path
    const document = documents.find(doc => doc.file_path === filePath);
    if (document) {
      console.log("DirectivesDocs - Document trouvé pour preview:", document);
      setPreviewDocument(document);
    } else {
      console.error("DirectivesDocs - Document non trouvé pour le chemin:", filePath);
      // Fallback: call the original view handler
      handleView(filePath, fileType);
    }
  };

  // Preview handlers
  const handlePreviewDownload = (filePath: string) => {
    const document = previewDocument || documents.find(doc => doc.file_path === filePath);
    const fileName = document?.file_name || 'document.pdf';
    console.log("DirectivesDocs - handlePreviewDownload:", filePath, fileName);
    handleDownload(filePath, fileName);
  };

  const handlePreviewPrint = (filePath: string, fileType?: string) => {
    console.log("DirectivesDocs - handlePreviewPrint:", filePath, fileType);
    handlePrint(filePath, fileType);
  };

  return {
    handleUploadCompleteWrapper,
    handleViewDocument,
    handlePreviewDownload,
    handlePreviewPrint
  };
};
