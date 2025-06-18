
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

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    fetchPosts
  };
};
