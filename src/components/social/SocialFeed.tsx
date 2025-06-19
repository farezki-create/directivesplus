
import React from "react";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/contexts/AuthContext";
import UnauthenticatedView from "./UnauthenticatedView";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";

const SocialFeed = () => {
  const { posts, loading, createPost, toggleLike, addComment } = usePosts();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <UnauthenticatedView />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <CreatePost onPostCreated={() => {}} />

      {/* Posts Feed */}
      {loading ? (
        <LoadingState />
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              user={user}
              onToggleLike={toggleLike}
              onAddComment={addComment}
            />
          ))}

          {posts.length === 0 && <EmptyState />}
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
