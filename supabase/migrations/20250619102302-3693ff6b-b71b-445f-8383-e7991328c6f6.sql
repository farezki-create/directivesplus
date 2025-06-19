
-- Update the health_news_media table to allow 'link' media type
ALTER TABLE public.health_news_media 
DROP CONSTRAINT IF EXISTS health_news_media_media_type_check;

ALTER TABLE public.health_news_media 
ADD CONSTRAINT health_news_media_media_type_check 
CHECK (media_type IN ('image', 'video', 'audio', 'document', 'link'));
