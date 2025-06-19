
import React from 'react';
import Header from '@/components/Header';
import PageFooter from '@/components/layout/PageFooter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHealthNews } from '@/hooks/useHealthNews';
import NewsCard from '@/components/health-news/NewsCard';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const PublicHealthNews = () => {
  const navigate = useNavigate();
  const { news, loading } = useHealthNews();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Toutes' },
    { value: 'general', label: 'Général' },
    { value: 'prevention', label: 'Prévention' },
    { value: 'recherche', label: 'Recherche' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'mental', label: 'Santé mentale' },
    { value: 'actualite', label: 'Actualités' }
  ];

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.status === 'published';
  });

  const featuredNews = filteredNews.filter(item => item.is_featured);
  const regularNews = filteredNews.filter(item => !item.is_featured);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </main>
        <PageFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-directiveplus-800">
            Actualités Santé
          </h1>
          
          {/* Filtres et recherche */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher dans les actualités..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-directiveplus-600"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Articles à la une */}
          {featuredNews.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">À la une</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredNews.map((newsItem) => (
                  <NewsCard key={newsItem.id} news={newsItem} />
                ))}
              </div>
            </div>
          )}

          {/* Autres articles */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {featuredNews.length > 0 ? 'Autres actualités' : 'Actualités'}
            </h2>
            
            {regularNews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Aucune actualité ne correspond à vos critères de recherche.'
                    : 'Aucune actualité disponible pour le moment.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regularNews.map((newsItem) => (
                  <NewsCard key={newsItem.id} news={newsItem} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default PublicHealthNews;
