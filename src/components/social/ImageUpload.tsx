
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImageUploadProps {
  selectedImage: File | null;
  onImageSelect: (file: File | null) => void;
}

const ImageUpload = ({ selectedImage, onImageSelect }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive"
        });
        return;
      }
      onImageSelect(file);
    }
  };

  const removeSelectedImage = () => {
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-gray-500 hover:text-purple-600"
        onClick={handleImageSelect}
      >
        <Image className="mr-2 h-4 w-4" />
        Photo
      </Button>

      {/* Selected Image Preview */}
      {selectedImage && (
        <div className="mt-3 relative inline-block">
          <img 
            src={URL.createObjectURL(selectedImage)} 
            alt="Aperçu" 
            className="max-w-xs max-h-32 rounded-lg object-cover border"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={removeSelectedImage}
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
