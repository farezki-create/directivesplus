
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import FilePreview from "./FilePreview";
import { useFileUpload } from "@/hooks/useFileUpload";
import { DocumentUploaderProps } from "./types";
import { toast } from "@/hooks/use-toast";

const DocumentUploader = ({ userId, onUploadComplete, documentType = "directive" }: DocumentUploaderProps) => {
  const {
    file,
    uploading,
    fileInputRef,
    handleFileChange,
    clearFile,
    uploadFile
  } = useFileUpload(userId, onUploadComplete, documentType);

  // Automatically upload the file when it's selected
  useEffect(() => {
    if (file && !uploading) {
      uploadFile();
    }
  }, [file]);

  return (
    <div className="p-4 border rounded-lg mb-6 bg-white">
      <h3 className="font-medium text-lg mb-4">
        Importer un {documentType === 'medical' ? 'document médical' : 'document'}
      </h3>
      
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-gray-100 file:text-gray-700
              hover:file:bg-gray-200
            "
            disabled={uploading}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-directiveplus-600"></div>
            </div>
          )}
        </div>
        
        {file && <FilePreview file={file} onClear={clearFile} />}
        
        <div>
          {uploading ? (
            <p className="text-sm text-gray-600">Téléchargement en cours... Le document sera automatiquement enregistré.</p>
          ) : (
            <p className="text-sm text-gray-600">Sélectionnez un document pour le téléverser automatiquement.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
