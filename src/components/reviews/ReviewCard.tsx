
import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp } from "lucide-react";

interface Review {
  id: string;
  created_at: string;
  title: string;
  content: string;
  rating: number;
  user_id: string;
  helpful_count: number;
}

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{review.title}</CardTitle>
          <div className="flex gap-1">{renderStars(review.rating)}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{review.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-500">
        <span>
          {new Date(review.created_at).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <Button variant="ghost" size="sm">
          <ThumbsUp className="w-4 h-4 mr-2" />
          Utile
        </Button>
      </CardFooter>
    </Card>
  );
};
