
import { usePostsData } from "./usePostsData";
import { usePostActions } from "./usePostActions";
import { UsePostsReturn } from "./types";

export const usePosts = (): UsePostsReturn => {
  const { posts, loading, fetchPosts } = usePostsData();
  const { createPost, toggleLike, addComment } = usePostActions(fetchPosts);

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    addComment,
    refetch: fetchPosts
  };
};

export * from "./types";
