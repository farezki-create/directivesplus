
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ReviewCard } from "./ReviewCard";

interface Review {
  id: string;
  created_at: string;
  title: string;
  content: string;
  rating: number;
  user_id: string;
  helpful_count: number;
}

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={review.id}>
            <ReviewCard review={review} />
            {index < reviews.length - 1 && (
              <Separator className="my-4" />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
