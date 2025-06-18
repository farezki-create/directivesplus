
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PostData } from "./types";

export const usePostsData = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(first_name, last_name),
          post_comments(
            id,
            content,
            created_at,
            profiles!post_comments_user_id_fkey(first_name, last_name)
          ),
          post_likes(user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ajouter les informations de like pour l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      const postsWithLikes = data?.map(post => {
        // Type assertion pour shared_document en tant qu'objet Document ou null
        const sharedDocument = post.shared_document as any;
        
        return {
          id: post.id,
          content: post.content,
          user_id: post.user_id,
          created_at: post.created_at,
          updated_at: post.updated_at,
          likes_count: post.likes_count || 0,
          comments_count: post.comments_count || 0,
          shared_document: sharedDocument ? {
            id: sharedDocument.id,
            file_name: sharedDocument.file_name,
            file_path: sharedDocument.file_path,
            file_type: sharedDocument.file_type,
            user_id: sharedDocument.user_id,
            created_at: sharedDocument.created_at,
            description: sharedDocument.description
          } : null,
          profiles: (post.profiles && typeof post.profiles === 'object' && 'first_name' in post.profiles) ? {
            first_name: post.profiles.first_name || '',
            last_name: post.profiles.last_name || ''
          } : undefined,
          comments: (post.post_comments || []).map((comment: any) => ({
            id: comment.id,
            content: comment.content,
            created_at: comment.created_at,
            profiles: (comment.profiles && typeof comment.profiles === 'object' && 'first_name' in comment.profiles) ? {
              first_name: comment.profiles.first_name || '',
              last_name: comment.profiles.last_name || ''
            } : undefined
          })),
          likes: post.post_likes || [],
          user_has_liked: (post.post_likes || []).some((like: any) => like.user_id === user?.id) || false
        };
      }) || [];

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

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    fetchPosts
  };
};
