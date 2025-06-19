import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Camera, FileText, Heart, MessageCircle, Share2, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentSelector } from './DocumentSelector';
import { ImageUpload } from './ImageUpload';
import { MoodSelector } from './MoodSelector';
import { useFileUpload } from '@/hooks/useFileUpload';

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadComplete = (url?: string, fileName?: string, isPrivate?: boolean) => {
    if (url) {
      setUploadedImage(url);
      toast({
        title: "Image téléchargée",
        description: "Votre image a été ajoutée au post",
      });
    }
  };

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
  } = useFileUpload(user?.id || '', handleUploadComplete, 'image', false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir du contenu pour votre publication.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulating post creation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Publication réussie",
        description: "Votre publication a été partagée avec la communauté.",
      });

      setContent('');
      setSelectedMood('');
      setSelectedDocument(null);
      setUploadedImage('');
      clearFile();
      onPostCreated();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la publication.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Partager avec la communauté
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Que souhaitez-vous partager avec la communauté ?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />

        <MoodSelector selectedMood={selectedMood} onMoodSelect={setSelectedMood} />

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Image
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={activateCamera}
            disabled={uploading}
          >
            <Camera className="h-4 w-4 mr-2" />
            Photo
          </Button>

          <DocumentSelector 
            onDocumentSelect={setSelectedDocument}
            selectedDocument={selectedDocument}
          />
        </div>

        <ImageUpload 
          uploadedImage={uploadedImage}
          onImageRemove={() => setUploadedImage('')}
        />

        {file && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm">{file.name}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={previewFile}>
                  Aperçu
                </Button>
                <Button size="sm" onClick={initiateUpload} disabled={uploading}>
                  {uploading ? "Upload..." : "Ajouter"}
                </Button>
                <Button size="sm" variant="outline" onClick={clearFile}>
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            Partagez vos expériences pour aider la communauté
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            {isSubmitting ? 'Publication...' : 'Publier'}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
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

        <RenameDialog />
        <PreviewDialog />
      </CardContent>
    </Card>
  );
};

export default CreatePost;
