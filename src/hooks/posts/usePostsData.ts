
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
          profiles:profiles!posts_user_id_fkey(first_name, last_name),
          comments:post_comments(
            id,
            content,
            created_at,
            profiles:profiles!post_comments_user_id_fkey(first_name, last_name)
          ),
          likes:post_likes(user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ajouter les informations de like pour l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      const postsWithLikes = data?.map(post => ({
        id: post.id,
        content: post.content,
        user_id: post.user_id,
        created_at: post.created_at,
        updated_at: post.updated_at,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        shared_document: post.shared_document ? {
          id: post.shared_document.id,
          file_name: post.shared_document.file_name,
          file_path: post.shared_document.file_path,
          file_type: post.shared_document.file_type,
          user_id: post.shared_document.user_id,
          created_at: post.shared_document.created_at,
          description: post.shared_document.description
        } : null,
        profiles: post.profiles,
        comments: post.comments || [],
        likes: post.likes || [],
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

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    fetchPosts
  };
};
