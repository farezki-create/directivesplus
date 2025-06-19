
import React, { useState, useEffect } from 'react';
import { useHealthNews } from '@/hooks/useHealthNews';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, Trash2, AlertCircle, FileText, Image, Video, Music, File } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const SimpleDocumentNewsManager = () => {
  const { news, deleteNews, fetchNews, createNews, loading, error } = useHealthNews();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');

  const {
    file,
    uploading: fileUploading,
    fileInputRef,
    handleFileChange,
    clearFile,
    PreviewDialog
  } = useFileUpload(
    user?.id || '',
    handleUploadComplete,
    'health-news',
    false
  );

  useEffect(() => {
    console.log('🏥 Loading health news documents...');
    fetchNews(true);
  }, []);

  async function handleUploadComplete(fileUrl: string, fileName: string) {
    if (!uploadTitle.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un titre pour l'actualité",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      
      const newsData = {
        title: uploadTitle,
        content: `Document: ${fileName}`,
        excerpt: `Document ajouté: ${fileName}`,
        featured_image_url: fileUrl,
        category: 'document',
        status: 'published' as const,
        tags: ['document', 'upload'],
        is_featured: false
      };

      const success = await createNews(newsData);
      
      if (success) {
        setUploadTitle('');
        clearFile();
        toast({
          title: "Succès",
          description: "Document ajouté aux actualités"
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
      await deleteNews(id);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="h-4 w-4" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="h-4 w-4" />;
      case 'mp3':
      case 'wav':
        return <Music className="h-4 w-4" />;
      case 'pdf':
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Erreur de chargement</p>
          <p className="text-gray-600 text-sm mt-2">{error}</p>
          <Button 
            onClick={() => fetchNews(true)} 
            className="mt-4"
            variant="outline"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section d'ajout de document */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Ajouter un document aux actualités
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Titre de l'actualité *
            </label>
            <Input
              id="title"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="Saisissez le titre de l'actualité..."
              required
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleFileSelect}
                disabled={uploading || fileUploading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Sélectionner un fichier
              </Button>
              
              {file && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getFileIcon(file.name)}
                  <span>{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {file && uploadTitle.trim() && (
              <Button
                onClick={() => {
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (reader.result) {
                        handleUploadComplete(reader.result.toString(), file.name);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                disabled={uploading || fileUploading}
                className="w-fit bg-green-600 hover:bg-green-700"
              >
                {uploading ? 'Ajout en cours...' : 'Ajouter aux actualités'}
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="*/*"
          />
        </CardContent>
      </Card>

      {/* Liste des actualités */}
      <Card>
        <CardHeader>
          <CardTitle>Documents dans les actualités ({news.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {news.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun document ajouté aux actualités
              </div>
            ) : (
              news.map((newsItem) => (
                <Card key={newsItem.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {newsItem.featured_image_url && getFileIcon(newsItem.content)}
                        <h4 className="font-medium">{newsItem.title}</h4>
                        <Badge variant="secondary">Document</Badge>
                        {newsItem.is_featured && (
                          <Badge variant="destructive">À la une</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {newsItem.content} • {newsItem.view_count} vues
                      </p>
                      <p className="text-xs text-gray-500">
                        Ajouté le {new Date(newsItem.created_at).toLocaleDateString('fr-FR')} à {new Date(newsItem.created_at).toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {newsItem.featured_image_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(newsItem.featured_image_url, '_blank')}
                        >
                          Voir
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(newsItem.id, newsItem.title)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <PreviewDialog />
    </div>
  );
};

export default SimpleDocumentNewsManager;
