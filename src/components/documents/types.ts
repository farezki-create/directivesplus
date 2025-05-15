
export interface DocumentUploaderProps {
  userId: string;
  onUploadComplete: (url: string, fileName: string) => void;
  documentType?: "directive" | "medical";
}

export interface FilePreviewProps {
  file: File;
  onClear: () => void;
}
