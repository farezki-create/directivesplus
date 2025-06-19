
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, User, Tag } from 'lucide-react';
import { HealthNews } from '@/types/healthNews';
import MediaIconByType from './MediaIconByType';

interface NewsCardProps {
  news: HealthNews;
  onClick?: () => void;
}

const NewsCard = ({ news, onClick }: NewsCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prevention': return 'bg-green-100 text-green-800';
      case 'recherche': return 'bg-blue-100 text-blue-800';
      case 'nutrition': return 'bg-orange-100 text-orange-800';
      case 'mental': return 'bg-purple-100 text-purple-800';
      case 'actualite': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      general: 'Général',
      prevention: 'Prévention',
      recherche: 'Recherche',
      nutrition: 'Nutrition',
      mental: 'Santé mentale',
      actualite: 'Actualités'
    };
    return labels[category] || category;
  };

  return (
    <Card 
      className={`hover:shadow-lg transition-shadow cursor-pointer ${
        news.is_featured ? 'ring-2 ring-blue-500 border-blue-200' : ''
      }`}
      onClick={onClick}
    >
      {news.featured_image_url && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={news.featured_image_url} 
            alt={news.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge className={getCategoryColor(news.category)}>
              {getCategoryLabel(news.category)}
            </Badge>
            {news.is_featured && (
              <Badge variant="destructive">À la une</Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Eye className="w-4 h-4 mr-1" />
            {news.view_count}
          </div>
        </div>
        
        <CardTitle className="text-lg line-clamp-2 hover:text-blue-600">
          {news.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {news.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {news.excerpt}
          </p>
        )}
        
        {/* Médias associés */}
        {news.media && news.media.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Contient :</span>
              {news.media.slice(0, 3).map((media, index) => (
                <div key={index} className="flex items-center gap-1">
                  <MediaIconByType type={media.media_type} className="h-3 w-3" />
                  <span className="text-xs">{media.media_type}</span>
                </div>
              ))}
              {news.media.length > 3 && (
                <span className="text-xs">+{news.media.length - 3} autres</span>
              )}
            </div>
          </div>
        )}
        
        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {news.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {news.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{news.tags.length - 3}</span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(news.publication_date || news.created_at).toLocaleDateString('fr-FR')}
          </div>
          {news.created_by && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              Équipe DirectivesPlus
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
