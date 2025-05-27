
import React, { useState } from 'react';
import { useHealthNews } from '@/hooks/useHealthNews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Plus, Edit, Trash2, Eye, TrendingUp } from 'lucide-react';
import NewsEditor from './NewsEditor';

const AdminNewsManager = () => {
  const { news, deleteNews, fetchNews } = useHealthNews();
  const [editingNews, setEditingNews] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);

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
    fetchNews(true); // Recharger avec les brouillons
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statistics = {
    total: news.length,
    published: news.filter(n => n.status === 'published').length,
    draft: news.filter(n => n.status === 'draft').length,
    totalViews: news.reduce((sum, n) => sum + n.view_count, 0)
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Gestion des actualités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="manage">Gestion</TabsTrigger>
              <TabsTrigger value="analytics">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{statistics.total}</div>
                    <p className="text-xs text-gray-600">Total actualités</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{statistics.published}</div>
                    <p className="text-xs text-gray-600">Publiées</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-yellow-600">{statistics.draft}</div>
                    <p className="text-xs text-gray-600">Brouillons</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">{statistics.totalViews}</div>
                    <p className="text-xs text-gray-600">Vues totales</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="manage" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Toutes les actualités</h3>
                <Button
                  onClick={() => setShowEditor(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle actualité
                </Button>
              </div>

              <div className="space-y-2">
                {news.map((newsItem) => (
                  <Card key={newsItem.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{newsItem.title}</h4>
                          <Badge className={getStatusColor(newsItem.status)}>
                            {newsItem.status}
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
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Actualités les plus vues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {news
                        .filter(n => n.status === 'published')
                        .sort((a, b) => b.view_count - a.view_count)
                        .slice(0, 5)
                        .map((newsItem) => (
                          <div key={newsItem.id} className="flex justify-between items-center p-2 border rounded">
                            <span className="font-medium">{newsItem.title}</span>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Eye className="h-4 w-4" />
                              {newsItem.view_count}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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

export default AdminNewsManager;
