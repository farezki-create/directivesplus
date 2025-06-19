
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, X, Upload } from "lucide-react";
import DocumentSelector from "./DocumentSelector";
import DocumentShareCard from "./DocumentShareCard";
import DocumentUploader from "@/components/documents/DocumentUploader";
import { Document } from "@/types/documents";

interface CreatePostProps {
  user: any;
  onCreatePost: (content: string, sharedDocument?: Document) => void;
}

const CreatePost = ({ user, onCreatePost }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [sharedDocument, setSharedDocument] = useState<Document | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !sharedDocument) return;

    setIsSubmitting(true);
    try {
      await onCreatePost(content, sharedDocument || undefined);
      setContent("");
      setSharedDocument(null);
      setShowUploader(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentSelect = (document: Document) => {
    setSharedDocument(document);
    setShowUploader(false);
  };

  const handleRemoveDocument = () => {
    setSharedDocument(null);
    setShowUploader(false);
  };

  const handleUploadComplete = (document?: Document) => {
    setShowUploader(false);
    if (document) {
      setSharedDocument(document);
    }
  };

  const isPostValid = content.trim().length > 0 || sharedDocument !== null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <form onSubmit={handleSubmit} className="flex-1 space-y-4">
            <Textarea
              placeholder="Partagez vos réflexions avec la communauté..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500"
            />

            {sharedDocument && (
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveDocument}
                  className="absolute top-2 right-2 z-10"
                >
                  <X className="h-4 w-4" />
                </Button>
                <DocumentShareCard document={sharedDocument} />
              </div>
            )}

            {showUploader && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Charger un nouveau document</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUploader(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <DocumentUploader
                  userId={user?.id || ""}
                  onUploadComplete={handleUploadComplete}
                  documentType="share"
                  saveToDirectives={false}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DocumentSelector 
                  onDocumentSelect={handleDocumentSelect}
                  disabled={isSubmitting}
                />
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUploader(!showUploader)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Charger nouveau
                </Button>
              </div>
              
              <Button 
                type="submit" 
                disabled={!isPostValid || isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Publier
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
