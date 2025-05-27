
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHealthNews } from '@/hooks/useHealthNews';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, Eye, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import NewsCard from '@/components/health-news/NewsCard';
import NewsEditor from '@/components/health-news/NewsEditor';
import AdminNewsManager from '@/components/health-news/AdminNewsManager';

const HealthNews = () => {
  const { user, isAuthenticated } = useAuth();
  const { news, loading } = useHealthNews();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEditor, setShowEditor] = useState(false);

  // Vérifier si l'utilisateur est admin
  const isAdmin = isAuthenticated && user?.email?.endsWith('@directivesplus.fr');

  // Filtrer les actualités
  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtenir les catégories uniques
  const categories = [...new Set(news.map(item => item.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Chargement des actualités...</p>
          </div>
        </div>
        <PageFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Actualités Santé
              </h1>
              <p className="text-gray-600">
                Restez informé des dernières actualités et conseils santé
              </p>
            </div>
            
            {isAdmin && (
              <Button
                onClick={() => setShowEditor(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle actualité
              </Button>
            )}
          </div>

          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une actualité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Liste des actualités */}
        {filteredNews.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 text-lg">Aucune actualité trouvée</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((newsItem) => (
              <NewsCard key={newsItem.id} news={newsItem} isAdmin={isAdmin} />
            ))}
          </div>
        )}

        {/* Interface d'administration */}
        {isAdmin && (
          <div className="mt-12">
            <AdminNewsManager />
          </div>
        )}
      </div>

      {/* Éditeur d'actualité */}
      {showEditor && (
        <NewsEditor
          onClose={() => setShowEditor(false)}
          onSave={() => {
            setShowEditor(false);
            // La liste sera automatiquement rechargée par le hook
          }}
        />
      )}

      <PageFooter />
    </div>
  );
};

export default HealthNews;
