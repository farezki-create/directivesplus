
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/language/useLanguage";

const reviewSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  content: z.string().min(10, "L'avis doit contenir au moins 10 caractères"),
  rating: z.number().min(1).max(5),
  profession: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  onSuccess: () => void;
  onSubmitting: (isSubmitting: boolean) => void;
  onClose: () => void;
}

export const ReviewForm = ({ onSuccess, onSubmitting, onClose }: ReviewFormProps) => {
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: "",
      content: "",
      rating: 5,
      profession: "",
    },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    onSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: currentLanguage === 'fr' ? "Erreur" : "Error",
          description: currentLanguage === 'fr' 
            ? "Vous devez être connecté pour publier un avis" 
            : "You must be logged in to post a review",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from('reviews').insert([{
        title: values.title,
        content: values.content,
        rating: values.rating,
        profession: values.profession,
        user_id: user.id
      }]);

      if (error) throw error;

      toast({
        title: currentLanguage === 'fr' ? "Merci pour votre avis !" : "Thank you for your review!",
        description: currentLanguage === 'fr' 
          ? "Votre avis a été publié avec succès." 
          : "Your review has been published successfully.",
      });

      form.reset();
      onClose();
      onSuccess();
    } catch (error) {
      toast({
        title: currentLanguage === 'fr' ? "Erreur" : "Error",
        description: currentLanguage === 'fr' 
          ? "Une erreur est survenue lors de la publication de votre avis." 
          : "An error occurred while publishing your review.",
        variant: "destructive",
      });
    } finally {
      onSubmitting(false);
    }
  };

  const healthProfessions = [
    { value: "", label: currentLanguage === 'fr' ? "Non-professionnel" : "Non-professional" },
    { value: "doctor", label: currentLanguage === 'fr' ? "Médecin" : "Doctor" },
    { value: "nurse", label: currentLanguage === 'fr' ? "Infirmier(ère)" : "Nurse" },
    { value: "caregiver", label: currentLanguage === 'fr' ? "Aide-soignant(e)" : "Caregiver" },
    { value: "psychologist", label: currentLanguage === 'fr' ? "Psychologue" : "Psychologist" },
    { value: "pharmacist", label: currentLanguage === 'fr' ? "Pharmacien(ne)" : "Pharmacist" },
    { value: "other_health", label: currentLanguage === 'fr' ? "Autre professionnel de santé" : "Other healthcare professional" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{currentLanguage === 'fr' ? "Titre" : "Title"}</FormLabel>
              <FormControl>
                <Input placeholder={currentLanguage === 'fr' ? "Un titre pour votre avis" : "A title for your review"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profession"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{currentLanguage === 'fr' ? "Profession" : "Profession"}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={currentLanguage === 'fr' ? "Sélectionnez votre profession" : "Select your profession"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {healthProfessions.map((profession) => (
                    <SelectItem key={profession.value} value={profession.value}>
                      {profession.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{currentLanguage === 'fr' ? "Votre avis" : "Your review"}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={currentLanguage === 'fr' ? "Partagez votre expérience..." : "Share your experience..."}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{currentLanguage === 'fr' ? "Note" : "Rating"}</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="ghost"
                      className="p-0 h-auto"
                      onClick={() => field.onChange(index + 1)}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          index < field.value
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {currentLanguage === 'fr' ? "Publier" : "Publish"}
        </Button>
      </form>
    </Form>
  );
};
