
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import FilePreview from "./FilePreview";
import { useFileUpload } from "@/hooks/useFileUpload";
import { DocumentUploaderProps } from "./types";

const DocumentUploader = ({ userId, onUploadComplete, documentType = "directive" }: DocumentUploaderProps) => {
  const {
    file,
    uploading,
    fileInputRef,
    handleFileChange,
    clearFile,
    uploadFile
  } = useFileUpload(userId, onUploadComplete, documentType);

  const handleUpload = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default button behavior
    uploadFile();
  };

  return (
    <div className="p-4 border rounded-lg mb-6 bg-white">
      <h3 className="font-medium text-lg mb-4">
        Importer un {documentType === 'medical' ? 'document médical' : 'document'}
      </h3>
      
      <div className="flex flex-col space-y-4">
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
        />
        
        {file && <FilePreview file={file} onClear={clearFile} />}
        
        <div className="flex justify-end">
          <Button 
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex items-center gap-2"
          >
            {uploading ? (
              <>Téléchargement en cours...</>
            ) : (
              <>
                <Upload size={16} /> 
                Téléverser le document
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
