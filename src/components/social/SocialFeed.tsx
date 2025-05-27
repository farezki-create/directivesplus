
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send, Users, Image, Smile, MoreHorizontal, X } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

const SocialFeed = () => {
  const { posts, loading, createPost, toggleLike, addComment } = usePosts();
  const { isAuthenticated, user } = useAuth();
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const moods = [
    { emoji: "😊", label: "Heureux" },
    { emoji: "😔", label: "Triste" },
    { emoji: "😌", label: "Serein" },
    { emoji: "💪", label: "Fort" },
    { emoji: "🤔", label: "Pensif" },
    { emoji: "😇", label: "Paisible" },
    { emoji: "💛", label: "Reconnaissant" },
    { emoji: "🌟", label: "Optimiste" }
  ];

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedImage) return;
    
    let imageUrl = undefined;
    if (selectedImage) {
      // Pour l'instant, on simule l'upload d'image
      // En production, il faudrait uploader vers Supabase Storage
      toast({
        title: "Info",
        description: "L'upload d'images sera disponible prochainement"
      });
    }

    const contentWithMood = selectedMood 
      ? `${selectedMood} ${newPostContent}` 
      : newPostContent;

    await createPost(contentWithMood, imageUrl);
    setNewPostContent("");
    setSelectedImage(null);
    setSelectedMood("");
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedImage(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
              
              {/* Selected Image Preview */}
              {selectedImage && (
                <div className="mt-3 relative inline-block">
                  <img 
                    src={URL.createObjectURL(selectedImage)} 
                    alt="Aperçu" 
                    className="max-w-xs max-h-32 rounded-lg object-cover border"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeSelectedImage}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* Selected Mood Display */}
              {selectedMood && (
                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Humeur:</span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    {selectedMood}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMood("")}
                    className="h-6 w-6 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500 hover:text-purple-600"
                    onClick={handleImageSelect}
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Photo
                  </Button>
                  
                  {/* Mood Selector */}
                  <div className="relative group">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-600">
                      <Smile className="mr-2 h-4 w-4" />
                      Humeur
                    </Button>
                    <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="grid grid-cols-4 gap-2 w-64">
                        {moods.map((mood) => (
                          <Button
                            key={mood.label}
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedMood(`${mood.emoji} ${mood.label}`)}
                            className="flex flex-col items-center p-2 h-auto hover:bg-purple-50"
                          >
                            <span className="text-xl mb-1">{mood.emoji}</span>
                            <span className="text-xs">{mood.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() && !selectedImage}
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
