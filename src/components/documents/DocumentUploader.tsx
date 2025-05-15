
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUploaderProps {
  userId: string;
  onUploadComplete: (url: string, fileName: string) => void;
  documentType?: "directive" | "medical";
}

const DocumentUploader = ({ userId, onUploadComplete, documentType = "directive" }: DocumentUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Format non supporté",
          description: "Veuillez sélectionner un document PDF ou une image (JPEG/PNG)",
          variant: "destructive"
        });
        return;
      }
      
      // Vérifier la taille du fichier (max 10 MB)
      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale autorisée est de 10 MB",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async () => {
    if (!file || !userId) return;
    
    setUploading(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const table = documentType === 'medical' ? 'medical_documents' : 'pdf_documents';
        
        // Créer un nouvel enregistrement dans la table appropriée
        const { data, error } = await supabase
          .from(table)
          .insert({
            user_id: userId,
            file_name: file.name,
            file_path: base64data, // Stocker directement en base64 data URI
            content_type: file.type,
            file_size: file.size,
            description: documentType === 'medical' 
              ? 'Document médical importé le ' + new Date().toLocaleDateString('fr-FR')
              : 'Document importé le ' + new Date().toLocaleDateString('fr-FR'),
            created_at: new Date().toISOString()
          })
          .select();
        
        if (error) {
          throw error;
        }
        
        onUploadComplete(base64data, file.name);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        toast({
          title: "Document téléchargé",
          description: "Votre document a été importé avec succès"
        });
      };
    } catch (error: any) {
      console.error("Erreur lors de l'upload du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
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
        
        {file && (
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-gray-600" />
              <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
              <span className="text-xs text-gray-500">
                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFile}
              className="p-1 h-auto"
            >
              <X size={16} className="text-gray-500" />
            </Button>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            onClick={uploadFile}
            disabled={!file || uploading}
            className="flex items-center gap-2"
          >
            {uploading ? (
              <>Téléchargement en cours...</>
            ) : (
              <>
                <Upload size={16} /> 
                Télécharger le document
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
