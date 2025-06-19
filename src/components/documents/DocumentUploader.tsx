import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types/documents';

interface DocumentUploaderProps {
  userId: string;
  onUploadComplete?: (document?: Document) => void;
  documentType?: string;
  maxFileSize?: number; // en MB
  saveToDirectives?: boolean; // Nouveau prop pour déterminer où sauver
}

const DocumentUploader = ({ 
  userId, 
  onUploadComplete, 
  documentType = "document",
  maxFileSize = 10,
  saveToDirectives = false // Par défaut, sauver dans uploaded_documents
}: DocumentUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier la taille du fichier
    if (file.size > maxFileSize * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: `Le fichier ne doit pas dépasser ${maxFileSize}MB`,
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setUploadSuccess(false);
  }, [maxFileSize]);

  const handleUpload = async () => {
    if (!selectedFile || !userId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convertir le fichier en base64 pour le stockage
      const fileReader = new FileReader();
      
      const fileDataPromise = new Promise<string>((resolve, reject) => {
        fileReader.onload = () => {
          if (typeof fileReader.result === 'string') {
            resolve(fileReader.result);
          } else {
            reject(new Error('Erreur de lecture du fichier'));
          }
        };
        fileReader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
        fileReader.readAsDataURL(selectedFile);
      });

      const fileData = await fileDataPromise;

      // Choisir la table selon le prop saveToDirectives
      const tableName = saveToDirectives ? 'pdf_documents' : 'uploaded_documents';
      
      const documentData = {
        user_id: userId,
        file_name: selectedFile.name,
        file_path: fileData,
        file_type: selectedFile.type,
        content_type: selectedFile.type,
        file_size: selectedFile.size,
        description: description || `Document ${selectedFile.name}`,
        created_at: new Date().toISOString()
      };

      // Insérer le document dans la table appropriée
      const { data, error } = await supabase
        .from(tableName)
        .insert(documentData)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'upload:', error);
        throw error;
      }

      const successMessage = saveToDirectives 
        ? "Document sauvegardé dans vos directives avec succès"
        : "Document téléchargé avec succès";

      toast({
        title: "Succès",
        description: successMessage
      });

      setUploadSuccess(true);
      setSelectedFile(null);
      setDescription('');
      
      // Appeler le callback avec le document créé
      if (onUploadComplete && data) {
        onUploadComplete(data as Document);
      }

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le document",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadSuccess(false);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {uploadSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-green-600 font-medium">
              {saveToDirectives 
                ? "Document sauvegardé dans vos directives !" 
                : "Document téléchargé avec succès !"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Zone de sélection de fichier */}
            {!selectedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Cliquez pour sélectionner un fichier
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF, Word, images ou fichiers texte (max {maxFileSize}MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Description optionnelle */}
            {selectedFile && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description (optionnelle)
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ajoutez une description pour ce document..."
                  className="resize-none"
                  rows={3}
                />
              </div>
            )}

            {/* Bouton d'upload */}
            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {saveToDirectives ? "Sauvegarder dans mes directives" : "Télécharger le document"}
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
