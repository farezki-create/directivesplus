
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Document } from "@/types/documents";

// Formats de fichiers autorisés pour le partage
const SAFE_FILE_FORMATS = [
  'application/pdf',
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'text/plain'
];

export const usePostActions = (refetchPosts: () => Promise<void>) => {
  const createPost = async (content: string, sharedDocument?: Document) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Vérifier le format du document s'il est fourni
      if (sharedDocument && !SAFE_FILE_FORMATS.includes(sharedDocument.file_type)) {
        toast({
          title: "Format non autorisé",
          description: "Seuls les PDF, images et fichiers texte peuvent être partagés",
          variant: "destructive"
        });
        return;
      }

      const postData: any = {
        content,
        user_id: user.id
      };

      if (sharedDocument) {
        postData.shared_document = {
          id: sharedDocument.id,
          file_name: sharedDocument.file_name,
          file_path: sharedDocument.file_path,
          description: sharedDocument.description,
          created_at: sharedDocument.created_at,
          file_type: sharedDocument.file_type,
          user_id: sharedDocument.user_id
        };
      }

      const { error } = await supabase
        .from('posts')
        .insert([postData]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: sharedDocument 
          ? "Votre post avec document a été publié avec succès"
          : "Votre post a été publié avec succès"
      });

      refetchPosts();
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier le post",
        variant: "destructive"
      });
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Vérifier si l'utilisateur a déjà liké ce post
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Retirer le like
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        // Décrémenter le compteur
        const { data: currentPost } = await supabase
          .from('posts')
          .select('likes_count')
          .eq('id', postId)
          .single();

        if (currentPost) {
          await supabase
            .from('posts')
            .update({ likes_count: Math.max(0, (currentPost.likes_count || 0) - 1) })
            .eq('id', postId);
        }
      } else {
        // Ajouter le like
        await supabase
          .from('post_likes')
          .insert([{ post_id: postId, user_id: user.id }]);

        // Incrémenter le compteur
        const { data: currentPost } = await supabase
          .from('posts')
          .select('likes_count')
          .eq('id', postId)
          .single();

        if (currentPost) {
          await supabase
            .from('posts')
            .update({ likes_count: (currentPost.likes_count || 0) + 1 })
            .eq('id', postId);
        }
      }

      refetchPosts();
    } catch (error) {
      console.error('Erreur lors du toggle like:', error);
    }
  };

  const addComment = async (postId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('post_comments')
        .insert([{
          post_id: postId,
          user_id: user.id,
          content
        }]);

      if (error) throw error;

      // Incrémenter le compteur de commentaires
      const { data: currentPost } = await supabase
        .from('posts')
        .select('comments_count')
        .eq('id', postId)
        .single();

      if (currentPost) {
        await supabase
          .from('posts')
          .update({ comments_count: (currentPost.comments_count || 0) + 1 })
          .eq('id', postId);
      }

      refetchPosts();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le commentaire",
        variant: "destructive"
      });
    }
  };

  return {
    createPost,
    toggleLike,
    addComment
  };
};
