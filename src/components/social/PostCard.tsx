
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send, MoreHorizontal } from "lucide-react";
import { Post } from "@/types/social";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface PostCardProps {
  post: Post;
  user: any;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
}

const PostCard = ({ post, user, onToggleLike, onAddComment }: PostCardProps) => {
  const [commentContent, setCommentContent] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleAddComment = async () => {
    if (!commentContent.trim()) return;
    await onAddComment(post.id, commentContent);
    setCommentContent("");
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
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
            onClick={() => onToggleLike(post.id)}
            className={`flex-1 ${post.is_liked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-red-500"}`}
          >
            <Heart className={`mr-2 h-5 w-5 ${post.is_liked ? 'fill-current' : ''}`} />
            J'aime
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 text-gray-500 hover:text-blue-500"
            onClick={toggleComments}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Commenter
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
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
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="min-h-[40px] flex-1 resize-none"
                />
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!commentContent.trim()}
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
  );
};

export default PostCard;
