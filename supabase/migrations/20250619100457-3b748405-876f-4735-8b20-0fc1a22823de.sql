
-- Create health_news table
CREATE TABLE IF NOT EXISTS public.health_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  publication_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  view_count INTEGER NOT NULL DEFAULT 0,
  tags TEXT[],
  is_featured BOOLEAN NOT NULL DEFAULT false
);

-- Create health_news_media table for associated media
CREATE TABLE IF NOT EXISTS public.health_news_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID REFERENCES public.health_news(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'audio', 'document')),
  media_url TEXT NOT NULL,
  media_name TEXT NOT NULL,
  media_size INTEGER,
  mime_type TEXT,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on health_news
ALTER TABLE public.health_news ENABLE ROW LEVEL SECURITY;

-- Create policies for health_news
CREATE POLICY "Anyone can view published health news" 
  ON public.health_news 
  FOR SELECT 
  USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all health news" 
  ON public.health_news 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email LIKE '%@directivesplus.fr'
    )
  );

-- Enable RLS on health_news_media
ALTER TABLE public.health_news_media ENABLE ROW LEVEL SECURITY;

-- Create policies for health_news_media
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
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email LIKE '%@directivesplus.fr'
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_health_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_health_news_updated_at
  BEFORE UPDATE ON public.health_news
  FOR EACH ROW
  EXECUTE FUNCTION update_health_news_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS health_news_status_idx ON public.health_news(status);
CREATE INDEX IF NOT EXISTS health_news_category_idx ON public.health_news(category);
CREATE INDEX IF NOT EXISTS health_news_publication_date_idx ON public.health_news(publication_date);
CREATE INDEX IF NOT EXISTS health_news_created_at_idx ON public.health_news(created_at);
CREATE INDEX IF NOT EXISTS health_news_is_featured_idx ON public.health_news(is_featured);
