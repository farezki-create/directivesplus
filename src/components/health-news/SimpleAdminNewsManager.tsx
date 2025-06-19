
import React, { useState, useEffect } from 'react';
import { useHealthNews } from '@/hooks/useHealthNews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import NewsEditor from './NewsEditor';

const SimpleAdminNewsManager = () => {
  const { news, deleteNews, fetchNews, loading, error } = useHealthNews();
  const [editingNews, setEditingNews] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    console.log('🏥 Loading admin news data...');
    fetchNews(true);
  }, []);

  const handleEdit = (newsItem: any) => {
    setEditingNews(newsItem);
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      await deleteNews(id);
    }
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setEditingNews(null);
  };

  const handleEditorSave = () => {
    setShowEditor(false);
    setEditingNews(null);
    fetchNews(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des actualités santé</CardTitle>
            <Button
              onClick={() => setShowEditor(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle actualité
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {news.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune actualité trouvée
              </div>
            ) : (
              news.map((newsItem) => (
                <Card key={newsItem.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{newsItem.title}</h4>
                        <Badge className={getStatusColor(newsItem.status)}>
                          {newsItem.status === 'published' ? 'Publié' : 'Brouillon'}
                        </Badge>
                        {newsItem.is_featured && (
                          <Badge variant="destructive">À la une</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Catégorie : {newsItem.category} • {newsItem.view_count} vues
                      </p>
                      <p className="text-xs text-gray-500">
                        Créé le {new Date(newsItem.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(newsItem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(newsItem.id)}
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

      {showEditor && (
        <NewsEditor
          existingNews={editingNews}
          onClose={handleEditorClose}
          onSave={handleEditorSave}
        />
      )}
    </div>
  );
};

export default SimpleAdminNewsManager;
