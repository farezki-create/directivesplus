
import React from 'react';
import { HealthNews } from '@/types/healthNews';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, User, Image, Video, FileText, Volume2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NewsCardProps {
  news: HealthNews;
  isAdmin?: boolean;
  onEdit?: (news: HealthNews) => void;
  onDelete?: (id: string) => void;
}

const NewsCard = ({ news, isAdmin, onEdit, onDelete }: NewsCardProps) => {
  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Volume2 className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      {news.featured_image_url && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={news.featured_image_url}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          {news.is_featured && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              À la une
            </Badge>
          )}
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
          </Badge>
          {isAdmin && (
            <Badge className={getStatusColor(news.status)}>
              {news.status}
            </Badge>
          )}
        </div>
        
        <h3 className="font-bold text-lg line-clamp-2 mb-2">
          {news.title}
        </h3>
        
        {news.excerpt && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {news.excerpt}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {news.publication_date 
              ? format(new Date(news.publication_date), 'dd MMM yyyy', { locale: fr })
              : format(new Date(news.created_at), 'dd MMM yyyy', { locale: fr })
            }
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {news.view_count}
          </div>
        </div>

        {/* Médias associés */}
        {news.media && news.media.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-500">Médias :</span>
            {news.media.slice(0, 3).map((media) => (
              <div key={media.id} className="flex items-center gap-1 text-xs text-gray-600">
                {getMediaIcon(media.media_type)}
              </div>
            ))}
            {news.media.length > 3 && (
              <span className="text-xs text-gray-500">+{news.media.length - 3}</span>
            )}
          </div>
        )}

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {news.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            Lire la suite
          </Button>
          
          {isAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(news)}
              >
                Modifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete?.(news.id)}
                className="text-red-600 hover:text-red-700"
              >
                Supprimer
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
