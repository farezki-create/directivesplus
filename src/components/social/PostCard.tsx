
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send } from "lucide-react";
import DocumentShareCard from "./DocumentShareCard";
import { useDocumentViewer } from "@/hooks/useDocumentViewer";
import { downloadDocument } from "@/utils/document-operations";

interface PostCardProps {
  post: any;
  user: any;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
}

const PostCard = ({ post, user, onToggleLike, onAddComment }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { handleView } = useDocumentViewer();

  const handleLike = () => {
    onToggleLike(post.id);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    await onAddComment(post.id, newComment);
    setNewComment("");
  };

  const handleDocumentView = (filePath: string) => {
    handleView(filePath);
  };

  const handleDocumentDownload = (filePath: string, fileName: string) => {
    downloadDocument(filePath, fileName);
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* En-tête du post */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar>
            <AvatarFallback>
              {post.profiles?.first_name?.charAt(0) || post.user_id?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">
                {post.profiles?.first_name && post.profiles?.last_name 
                  ? `${post.profiles.first_name} ${post.profiles.last_name}`
                  : 'Utilisateur anonyme'
                }
              </h3>
              <span className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>

        {/* Contenu du post */}
        {post.content && (
          <div className="mb-4">
            <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          </div>
        )}

        {/* Document partagé */}
        {post.shared_document && (
          <div className="mb-4">
            <DocumentShareCard
              document={post.shared_document}
              onView={handleDocumentView}
              onDownload={handleDocumentDownload}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mb-4 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 ${
              post.user_has_liked ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            <Heart className={`h-4 w-4 ${post.user_has_liked ? 'fill-current' : ''}`} />
            {post.likes_count || 0}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-600"
          >
            <MessageCircle className="h-4 w-4" />
            {post.comments_count || 0}
          </Button>
        </div>

        {/* Section des commentaires */}
        {showComments && (
          <div className="space-y-4">
            {/* Commentaires existants */}
            {post.comments?.map((comment: any) => (
              <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {comment.profiles?.first_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {comment.profiles?.first_name && comment.profiles?.last_name 
                        ? `${comment.profiles.first_name} ${comment.profiles.last_name}`
                        : 'Utilisateur anonyme'
                      }
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800">{comment.content}</p>
                </div>
              </div>
            ))}

            {/* Formulaire de nouveau commentaire */}
            <form onSubmit={handleComment} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea
                  placeholder="Écrire un commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
                <Button type="submit" size="sm" disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
