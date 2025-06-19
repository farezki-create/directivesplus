
import { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { FileUploadConfig, FileUploadState } from "./types";
import { createFileHandlers } from "./fileHandlers";
import { uploadFileToSupabase } from "./uploadService";
import { RenameDialog, PreviewDialog } from "./dialogComponents";

export const useFileUpload = (
  userId: string, 
  onUploadComplete: (url: string, fileName: string, isPrivate: boolean) => void, 
  documentType = "directive",
  saveToDirectives = true
) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [customFileName, setCustomFileName] = useState("");
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const fileHandlers = createFileHandlers(
    setFile,
    setCustomFileName,
    fileInputRef,
    cameraInputRef
  );

  const uploadFile = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      setShowRenameDialog(false);

      await uploadFileToSupabase(
        file,
        customFileName,
        userId,
        documentType,
        saveToDirectives,
        isPrivate,
        onUploadComplete
      );

      fileHandlers.clearFile();
    } catch (error) {
      // Error handling is done in uploadService
    } finally {
      setUploading(false);
    }
  };

  const initiateUpload = () => {
    fileHandlers.initiateUpload(file, setShowRenameDialog);
  };

  const previewFile = () => {
    fileHandlers.previewFile(file, setPreviewUrl, setPreviewDialogOpen);
  };

  return {
    file,
    uploading,
    fileInputRef,
    cameraInputRef,
    handleFileChange: fileHandlers.handleFileChange,
    clearFile: fileHandlers.clearFile,
    initiateUpload,
    previewFile,
    setIsPrivate,
    isPrivate,
    RenameDialog: () => RenameDialog({
      open: showRenameDialog,
      onOpenChange: setShowRenameDialog,
      customFileName,
      onFileNameChange: setCustomFileName,
      onCancel: () => setShowRenameDialog(false),
      onConfirm: uploadFile
    }),
    PreviewDialog: () => PreviewDialog({
      open: previewDialogOpen,
      onOpenChange: setPreviewDialogOpen,
      previewUrl,
      file
    }),
    activateCamera: fileHandlers.activateCamera
  };
};

export * from "./types";
export * from "./fileHandlers";
export * from "./uploadService";
export * from "./dialogComponents";
