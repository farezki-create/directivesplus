
import { Document } from "@/types/documents";

interface DirectivesDocumentHandlersProps {
  documents: Document[];
  previewDocument: string | null;
  setPreviewDocument: (filePath: string | null) => void;
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
    
    // Set the preview document directly with the file path
    setPreviewDocument(filePath);
  };

  const handlePreviewDownload = (filePath: string) => {
    const document = documents.find(doc => doc.file_path === filePath);
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
