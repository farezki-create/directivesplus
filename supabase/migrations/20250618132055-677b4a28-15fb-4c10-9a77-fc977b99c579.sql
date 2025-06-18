
-- Ajouter la colonne shared_document à la table posts pour permettre le partage de documents
ALTER TABLE public.posts 
ADD COLUMN shared_document jsonb;

-- Commentaire pour expliquer la structure du JSONB
COMMENT ON COLUMN public.posts.shared_document IS 'Document partagé dans le post, contient: {id, file_name, file_path, description, created_at, file_type}';
