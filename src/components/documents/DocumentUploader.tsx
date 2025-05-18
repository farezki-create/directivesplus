
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Eye, Lock, Unlock, Save } from "lucide-react";
import FilePreview from "./FilePreview";
import { useFileUpload } from "@/hooks/useFileUpload";
import { DocumentUploaderProps } from "./types";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const DocumentUploader = ({ userId, onUploadComplete, documentType = "directive" }: DocumentUploaderProps) => {
  const {
    file,
    uploading,
    fileInputRef,
    cameraInputRef,
    handleFileChange,
    clearFile,
    uploadFile,
    previewFile,
    setIsPrivate,
    isPrivate
  } = useFileUpload(userId, onUploadComplete, documentType);

  return (
    <div className="p-4 border rounded-lg mb-6 bg-white">
      <h3 className="font-medium text-lg mb-4">
        Importer et ajouter un {documentType === 'medical' ? 'document médical' : 'document'}
      </h3>
      
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1">
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
            {/* Input pour l'appareil photo (caché) */}
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleFileChange}
              accept="image/*"
              capture="environment"
              className="hidden"
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-directiveplus-600"></div>
              </div>
            )}
          </div>
        </div>
        
        {file && (
          <>
            <FilePreview file={file} onClear={clearFile} />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => previewFile()} 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                >
                  <Eye size={16} />
                  Prévisualiser
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isPrivate" 
                  checked={isPrivate}
                  onCheckedChange={(checked) => setIsPrivate(checked === true)}
                />
                <Label htmlFor="isPrivate" className="flex items-center gap-1 text-sm text-gray-600">
                  {isPrivate ? <Lock size={14} /> : <Unlock size={14} />}
                  {isPrivate ? "Document privé" : "Document visible avec code d'accès"}
                </Label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={uploadFile} 
                disabled={uploading}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                Enregistrer
              </Button>
            </div>
          </>
        )}
        
        <div>
          {uploading && (
            <p className="text-sm text-gray-600">Téléchargement en cours... Le document sera automatiquement enregistré.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
