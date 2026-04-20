
-- =====================================================
-- FIX 1: Make pdf_documents bucket PRIVATE
-- =====================================================
UPDATE storage.buckets SET public = false WHERE id = 'pdf_documents';

-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Allow users to download PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Public can view pdf_documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view pdf_documents" ON storage.objects;

-- Owners can manage their own files (folder = user_id)
CREATE POLICY "Users can view their own PDFs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'pdf_documents'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own PDFs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pdf_documents'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own PDFs"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pdf_documents'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own PDFs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'pdf_documents'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- =====================================================
-- FIX 2: pdf_documents table - require access code verification
-- =====================================================
DROP POLICY IF EXISTS "Users can view shared documents with valid access code" ON public.pdf_documents;

-- Replace with a strict policy: only owner OR admin direct SELECT.
-- Shared access MUST go through validate_and_use_access_code() RPC
-- or get_documents_with_access_code() RPC which require the actual code.
CREATE POLICY "Owners and admins can view their pdf_documents"
ON public.pdf_documents FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- =====================================================
-- FIX 3: health_news_media - only published news media visible
-- =====================================================
DROP POLICY IF EXISTS "Anyone can view media for published news" ON public.health_news_media;

CREATE POLICY "Public can view media for published news only"
ON public.health_news_media FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.health_news hn
    WHERE hn.id = health_news_media.news_id
      AND hn.status = 'published'
  )
);

-- Authors and admins can still view their own draft media
CREATE POLICY "Authors and admins can view their draft media"
ON public.health_news_media FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.health_news hn
    WHERE hn.id = health_news_media.news_id
      AND (hn.created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
  )
);
