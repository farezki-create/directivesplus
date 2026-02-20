
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
    setPreviewDocument(filePath);
  };

  const handlePreviewDownload = (filePath: string) => {
    const document = documents.find(doc => doc.file_path === filePath);
    const fileName = document?.file_name || 'document.pdf';
    handleDownload(filePath, fileName);
  };

  const handlePreviewPrint = (filePath: string, fileType?: string) => {
    handlePrint(filePath, fileType);
  };

  return {
    handleUploadCompleteWrapper,
    handleViewDocument,
    handlePreviewDownload,
    handlePreviewPrint
  };
};
