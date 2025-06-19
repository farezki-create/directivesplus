
-- Supprimer les anciennes politiques RLS
DROP POLICY IF EXISTS "Anyone can view published health news" ON public.health_news;
DROP POLICY IF EXISTS "Admins can manage all health news" ON public.health_news;

-- Créer de nouvelles politiques RLS plus simples
CREATE POLICY "Anyone can view published health news" 
  ON public.health_news 
  FOR SELECT 
  USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all health news" 
  ON public.health_news 
  FOR ALL 
  USING (auth.uid() IS NOT NULL AND auth.jwt() ->> 'email' LIKE '%@directivesplus.fr');

-- Faire de même pour health_news_media
DROP POLICY IF EXISTS "Anyone can view media for published news" ON public.health_news_media;
DROP POLICY IF EXISTS "Admins can manage all health news media" ON public.health_news_media;

CREATE POLICY "Anyone can view media for published news" 
  ON public.health_news_media 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.health_news hn 
      WHERE hn.id = news_id 
      AND (hn.status = 'published' OR auth.uid() IS NOT NULL)
    )
  );

CREATE POLICY "Admins can manage all health news media" 
  ON public.health_news_media 
  FOR ALL 
  USING (auth.uid() IS NOT NULL AND auth.jwt() ->> 'email' LIKE '%@directivesplus.fr');
