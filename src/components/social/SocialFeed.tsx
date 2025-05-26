
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Send, Users } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const SocialFeed = () => {
  const { posts, loading, createPost, toggleLike, addComment } = usePosts();
  const { isAuthenticated, user } = useAuth();
  const [newPostContent, setNewPostContent] = useState("");
  const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    await createPost(newPostContent);
    setNewPostContent("");
  };

  const handleAddComment = async (postId: string) => {
    const content = commentContent[postId];
    if (!content?.trim()) return;
    await addComment(postId, content);
    setCommentContent(prev => ({ ...prev, [postId]: "" }));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Rejoignez la communauté</h3>
            <p className="text-gray-600 mb-4">
              Connectez-vous pour partager et échanger avec d'autres utilisateurs
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Créer un nouveau post */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Partagez vos réflexions</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Que voulez-vous partager ?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleCreatePost}
            disabled={!newPostContent.trim()}
            className="w-full"
          >
            <Send className="mr-2 h-4 w-4" />
            Publier
          </Button>
        </CardContent>
      </Card>

      {/* Liste des posts */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-directiveplus-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des posts...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">
                      {post.user_profile?.first_name} {post.user_profile?.last_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(post.created_at), { 
                        addSuffix: true, 
                        locale: fr 
                      })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="whitespace-pre-wrap">{post.content}</p>
                
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt="Post image" 
                    className="rounded-lg max-w-full h-auto"
                  />
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(post.id)}
                    className={post.is_liked ? "text-red-500" : ""}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${post.is_liked ? 'fill-current' : ''}`} />
                    {post.likes_count}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {post.comments_count}
                  </Button>
                </div>

                {/* Section commentaires */}
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ajoutez un commentaire..."
                      value={commentContent[post.id] || ""}
                      onChange={(e) => setCommentContent(prev => ({ 
                        ...prev, 
                        [post.id]: e.target.value 
                      }))}
                      className="min-h-[60px] flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(post.id)}
                      disabled={!commentContent[post.id]?.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {posts.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Aucun post pour le moment</h3>
                <p className="text-gray-600">
                  Soyez le premier à partager quelque chose avec la communauté !
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
