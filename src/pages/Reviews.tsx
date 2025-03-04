
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Review {
  id: string;
  created_at: string;
  title: string;
  content: string;
  rating: number;
  user_id: string;
  helpful_count: number;
}

const Reviews = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les avis",
        variant: "destructive",
      });
      return;
    }

    setReviews(data || []);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Button>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Avis des utilisateurs</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Donner mon avis</Button>
            </DialogTrigger>
            <DialogContent>
              <ReviewForm
                onSuccess={fetchReviews}
                onSubmitting={setIsSubmitting}
                onClose={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ReviewList reviews={reviews} />
    </div>
  );
};

export default Reviews;
