
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CommentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulation d'envoi du commentaire
    toast({
      title: "Commentaire envoyé !",
      description: "Merci pour votre retour. Votre commentaire sera publié après modération.",
    });
    
    // Reset du formulaire
    setFormData({
      name: "",
      email: "",
      rating: 5,
      comment: ""
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Laissez votre avis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label>Note *</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer transition-colors ${
                    star <= formData.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => handleRatingChange(star)}
                />
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="comment">Commentaire *</Label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              placeholder="Partagez votre expérience avec DirectivesPlus..."
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Envoyer mon commentaire
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommentForm;
