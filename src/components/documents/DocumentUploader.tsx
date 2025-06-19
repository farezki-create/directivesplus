
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Eye, X } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";

interface DocumentUploaderProps {
  userId: string;
  onUploadComplete: (url?: string, fileName?: string, isPrivate?: boolean) => void;
  documentType?: string;
  saveToDirectives?: boolean;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  userId,
  onUploadComplete,
  documentType = "directive",
  saveToDirectives = true
}) => {
  const {
    file,
    uploading,
    fileInputRef,
    cameraInputRef,
    handleFileChange,
    clearFile,
    initiateUpload,
    previewFile,
    RenameDialog,
    PreviewDialog,
    activateCamera
  } = useFileUpload(userId, onUploadComplete, documentType, saveToDirectives);

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Télécharger un document
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Sélectionnez un fichier depuis votre ordinateur ou prenez une photo
        </p>
        
        <div className="mt-6 flex justify-center space-x-4">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            className="hidden"
          />
          
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <FileText className="h-4 w-4 mr-2" />
            Choisir fichier
          </Button>
          
          <Button
            type="button"
            variant="outline" 
            onClick={activateCamera}
            disabled={uploading}
          >
            📷 Prendre photo
          </Button>
        </div>

        {file && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={previewFile}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-2">
              <Button
                onClick={initiateUpload}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? "Téléchargement..." : "Télécharger"}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <RenameDialog />
      <PreviewDialog />
    </div>
  );
};

export default DocumentUploader;
