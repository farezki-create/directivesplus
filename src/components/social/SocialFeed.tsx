
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send, Users, Image, Smile, MoreHorizontal } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const SocialFeed = () => {
  const { posts, loading, createPost, toggleLike, addComment } = usePosts();
  const { isAuthenticated, user } = useAuth();
  const [newPostContent, setNewPostContent] = useState("");
  const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

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

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="bg-blue-50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Rejoignez notre communauté</h3>
            <p className="text-gray-600 mb-6 text-lg">
              Connectez-vous pour partager vos expériences, poser des questions et échanger avec d'autres membres de la communauté DirectivesPlus.
            </p>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              size="lg"
            >
              Se connecter pour participer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <Card className="bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Quoi de neuf ? Partagez vos réflexions avec la communauté..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[100px] border-gray-200 focus:border-purple-400 resize-none text-lg"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-600">
                    <Image className="mr-2 h-4 w-4" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-600">
                    <Smile className="mr-2 h-4 w-4" />
                    Humeur
                  </Button>
                </div>
                <Button 
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="bg-purple-600 hover:bg-purple-700 px-6"
                >
                  Publier
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="ml-4 text-gray-600 text-lg">Chargement des posts...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                        {post.user_profile?.first_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
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
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
                
                {post.image_url && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt="Post image" 
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                )}

                {/* Engagement Stats */}
                {(post.likes_count > 0 || post.comments_count > 0) && (
                  <div className="flex items-center justify-between text-sm text-gray-500 py-2 border-t border-gray-100">
                    <span>{post.likes_count} J'aime</span>
                    <span>{post.comments_count} commentaires</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-around py-2 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(post.id)}
                    className={`flex-1 ${post.is_liked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-red-500"}`}
                  >
                    <Heart className={`mr-2 h-5 w-5 ${post.is_liked ? 'fill-current' : ''}`} />
                    J'aime
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-gray-500 hover:text-blue-500"
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Commenter
                  </Button>
                </div>

                {/* Comments Section */}
                {showComments[post.id] && (
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <div className="flex space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-100 text-purple-700 text-sm">
                          {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex space-x-2">
                        <Textarea
                          placeholder="Écrivez un commentaire..."
                          value={commentContent[post.id] || ""}
                          onChange={(e) => setCommentContent(prev => ({ 
                            ...prev, 
                            [post.id]: e.target.value 
                          }))}
                          className="min-h-[40px] flex-1 resize-none"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddComment(post.id)}
                          disabled={!commentContent[post.id]?.trim()}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {posts.length === 0 && (
            <Card className="bg-white shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="bg-gray-50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Aucun post pour le moment</h3>
                <p className="text-gray-600 mb-6">
                  Soyez le premier à partager quelque chose avec la communauté !
                </p>
                <Button 
                  onClick={() => document.querySelector('textarea')?.focus()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Créer le premier post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
