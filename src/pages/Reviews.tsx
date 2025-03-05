
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Stethoscope, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Reviews = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>("all");

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
        title: currentLanguage === 'fr' ? "Erreur" : "Error",
        description: currentLanguage === 'fr' 
          ? "Impossible de charger les avis" 
          : "Unable to load reviews",
        variant: "destructive",
      });
      return;
    }

    setReviews(data || []);
  };

  const getFilteredReviews = () => {
    if (activeTab === "all") {
      return reviews;
    } else if (activeTab === "professionals") {
      return reviews.filter(review => review.profession && review.profession !== "");
    } else if (activeTab === "users") {
      return reviews.filter(review => !review.profession || review.profession === "");
    }
    return reviews;
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
          {currentLanguage === 'fr' ? "Retour à l'accueil" : "Back to home"}
        </Button>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {currentLanguage === 'fr' ? "Avis des utilisateurs" : "User reviews"}
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>{currentLanguage === 'fr' ? "Donner mon avis" : "Give my review"}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {currentLanguage === 'fr' ? "Partagez votre expérience" : "Share your experience"}
                </DialogTitle>
              </DialogHeader>
              <ReviewForm
                onSuccess={fetchReviews}
                onSubmitting={setIsSubmitting}
                onClose={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            {currentLanguage === 'fr' ? "Tous les avis" : "All reviews"}
          </TabsTrigger>
          <TabsTrigger value="professionals" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            {currentLanguage === 'fr' ? "Professionnels de santé" : "Healthcare professionals"}
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {currentLanguage === 'fr' ? "Utilisateurs" : "Users"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ReviewList reviews={getFilteredReviews()} />
        </TabsContent>
        <TabsContent value="professionals">
          <ReviewList reviews={getFilteredReviews()} />
        </TabsContent>
        <TabsContent value="users">
          <ReviewList reviews={getFilteredReviews()} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reviews;
