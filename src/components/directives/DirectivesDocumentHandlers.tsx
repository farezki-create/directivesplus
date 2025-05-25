
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
    // Logic handled by parent component
  };

  const handleViewDocument = (filePath: string, fileType?: string) => {
    console.log("DirectivesDocumentHandlers - handleViewDocument appelé avec:", filePath, fileType);
    
    // Find the document by file_path
    const document = documents.find(doc => doc.file_path === filePath);
    if (document) {
      console.log("DirectivesDocumentHandlers - Document trouvé pour preview:", document);
      setPreviewDocument(document);
    } else {
      console.error("DirectivesDocumentHandlers - Document non trouvé pour le chemin:", filePath);
      // Fallback: call the original view handler
      handleView(filePath, fileType);
    }
  };

  const handlePreviewDownload = (filePath: string) => {
    const document = previewDocument || documents.find(doc => doc.file_path === filePath);
    const fileName = document?.file_name || 'document.pdf';
    console.log("DirectivesDocumentHandlers - handlePreviewDownload:", filePath, fileName);
    handleDownload(filePath, fileName);
  };

  const handlePreviewPrint = (filePath: string, fileType?: string) => {
    console.log("DirectivesDocumentHandlers - handlePreviewPrint:", filePath, fileType);
    handlePrint(filePath, fileType);
  };

  return {
    handleUploadCompleteWrapper,
    handleViewDocument,
    handlePreviewDownload,
    handlePreviewPrint
  };
};
