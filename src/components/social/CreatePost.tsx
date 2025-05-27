
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import MoodSelector from "./MoodSelector";
import ImageUpload from "./ImageUpload";

interface CreatePostProps {
  user: any;
  onCreatePost: (content: string, imageUrl?: string) => Promise<void>;
}

const CreatePost = ({ user, onCreatePost }: CreatePostProps) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>("");

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

    await onCreatePost(contentWithMood, imageUrl);
    setNewPostContent("");
    setSelectedImage(null);
    setSelectedMood("");
  };

  return (
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
            
            <ImageUpload 
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
            />

            <MoodSelector
              selectedMood={selectedMood}
              onMoodSelect={setSelectedMood}
              onMoodRemove={() => setSelectedMood("")}
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                {/* Image upload and mood selector are now handled by their respective components */}
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
  );
};

export default CreatePost;
