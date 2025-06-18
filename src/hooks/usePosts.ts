
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Document } from "@/types/documents";

export const usePosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:profiles!posts_user_id_fkey(first_name, last_name),
          comments:post_comments(
            id,
            content,
            created_at,
            profiles:profiles!post_comments_user_id_fkey(first_name, last_name)
          ),
          likes:post_likes(user_id),
          shared_document
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ajouter les informations de like pour l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      const postsWithLikes = data?.map(post => ({
        ...post,
        user_has_liked: post.likes?.some((like: any) => like.user_id === user?.id) || false
      })) || [];

      setPosts(postsWithLikes);
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, sharedDocument?: Document) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

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
          file_type: sharedDocument.file_type
        };
      }

      const { error } = await supabase
        .from('posts')
        .insert([postData]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre post a été publié avec succès"
      });

      fetchPosts();
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
        await supabase
          .from('posts')
          .update({ likes_count: supabase.raw('likes_count - 1') })
          .eq('id', postId);
      } else {
        // Ajouter le like
        await supabase
          .from('post_likes')
          .insert([{ post_id: postId, user_id: user.id }]);

        // Incrémenter le compteur
        await supabase
          .from('posts')
          .update({ likes_count: supabase.raw('likes_count + 1') })
          .eq('id', postId);
      }

      fetchPosts();
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
      await supabase
        .from('posts')
        .update({ comments_count: supabase.raw('comments_count + 1') })
        .eq('id', postId);

      fetchPosts();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le commentaire",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    addComment,
    refetch: fetchPosts
  };
};
