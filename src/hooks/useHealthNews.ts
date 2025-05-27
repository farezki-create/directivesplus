
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HealthNews, CreateHealthNewsData, HealthNewsMedia } from '@/types/healthNews';
import { toast } from '@/hooks/use-toast';

export const useHealthNews = () => {
  const [news, setNews] = useState<HealthNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (includeUnpublished = false) => {
    try {
      setLoading(true);
      let query = supabase
        .from('health_news')
        .select(`
          *,
          health_news_media (*)
        `)
        .order('publication_date', { ascending: false });

      if (!includeUnpublished) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;

      if (error) throw error;

      const newsWithMedia = data?.map(item => ({
        ...item,
        media: item.health_news_media || []
      })) || [];

      setNews(newsWithMedia);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des actualités');
      toast({
        title: "Erreur",
        description: "Impossible de charger les actualités",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createNews = async (newsData: CreateHealthNewsData): Promise<HealthNews | null> => {
    try {
      const { data, error } = await supabase
        .from('health_news')
        .insert([newsData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Actualité créée avec succès"
      });

      await fetchNews(true); // Recharger avec les brouillons pour l'admin
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'actualité",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateNews = async (id: string, updates: Partial<CreateHealthNewsData>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('health_news')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Actualité mise à jour avec succès"
      });

      await fetchNews(true);
      return true;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'actualité",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteNews = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('health_news')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Actualité supprimée avec succès"
      });

      await fetchNews(true);
      return true;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'actualité",
        variant: "destructive"
      });
      return false;
    }
  };

  const addMedia = async (newsId: string, mediaData: Omit<HealthNewsMedia, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('health_news_media')
        .insert([{ ...mediaData, news_id: newsId }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Media ajouté avec succès"
      });

      await fetchNews(true);
      return true;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le média",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    error,
    fetchNews,
    createNews,
    updateNews,
    deleteNews,
    addMedia
  };
};
