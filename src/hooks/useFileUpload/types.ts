
export interface FileUploadConfig {
  userId: string;
  onUploadComplete: (url: string, fileName: string, isPrivate: boolean) => void;
  documentType?: string;
  saveToDirectives?: boolean;
}

export interface FileUploadState {
  file: File | null;
  uploading: boolean;
  isPrivate: boolean;
  showRenameDialog: boolean;
  customFileName: string;
  previewDialogOpen: boolean;
  previewUrl: string | null;
}
