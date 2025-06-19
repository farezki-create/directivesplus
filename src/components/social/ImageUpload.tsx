
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageUploadProps {
  uploadedImage: string;
  onImageRemove: () => void;
}

const ImageUpload = ({ uploadedImage, onImageRemove }: ImageUploadProps) => {
  return (
    <>
      {/* Selected Image Preview */}
      {uploadedImage && (
        <div className="mt-3 relative inline-block">
          <img 
            src={uploadedImage} 
            alt="Aperçu" 
            className="max-w-xs max-h-32 rounded-lg object-cover border"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onImageRemove}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </>
  );
};

export default ImageUpload;
