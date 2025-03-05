
import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, UserRound, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/language/useLanguage";

interface Review {
  id: string;
  created_at: string;
  title: string;
  content: string;
  rating: number;
  user_id: string;
  helpful_count: number;
  profession?: string;
}

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const { currentLanguage } = useLanguage();
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getProfessionLabel = (profession: string) => {
    switch(profession) {
      case "doctor": return currentLanguage === 'fr' ? "Médecin" : "Doctor";
      case "nurse": return currentLanguage === 'fr' ? "Infirmier(ère)" : "Nurse";
      case "caregiver": return currentLanguage === 'fr' ? "Aide-soignant(e)" : "Caregiver";
      case "psychologist": return currentLanguage === 'fr' ? "Psychologue" : "Psychologist";
      case "pharmacist": return currentLanguage === 'fr' ? "Pharmacien(ne)" : "Pharmacist";
      case "other_health": return currentLanguage === 'fr' ? "Autre professionnel de santé" : "Other healthcare professional";
      default: return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{review.title}</CardTitle>
            {review.profession && (
              <Badge variant="outline" className="mt-1 flex items-center gap-1">
                <Stethoscope className="w-3 h-3" />
                {getProfessionLabel(review.profession)}
              </Badge>
            )}
          </div>
          <div className="flex gap-1">{renderStars(review.rating)}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{review.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-500">
        <span>
          {new Date(review.created_at).toLocaleDateString(
            currentLanguage === 'fr' ? "fr-FR" : "en-US", 
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}
        </span>
        <Button variant="ghost" size="sm">
          <ThumbsUp className="w-4 h-4 mr-2" />
          {currentLanguage === 'fr' ? "Utile" : "Helpful"}
        </Button>
      </CardFooter>
    </Card>
  );
};
