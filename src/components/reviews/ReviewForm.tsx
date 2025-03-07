
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const reviewSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  content: z.string().min(10, "L'avis doit contenir au moins 10 caractères"),
  rating: z.number().min(1).max(5),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  onSuccess: () => void;
  onSubmitting: (isSubmitting: boolean) => void;
  onClose: () => void;
}

export const ReviewForm = ({ onSuccess, onSubmitting, onClose }: ReviewFormProps) => {
  const { toast } = useToast();
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: "",
      content: "",
      rating: 5,
    },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    onSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour publier un avis",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from('reviews').insert([{
        title: values.title,
        content: values.content,
        rating: values.rating,
        user_id: user.id
      }]);

      if (error) throw error;

      toast({
        title: "Merci pour votre avis !",
        description: "Votre avis a été publié avec succès.",
      });

      form.reset();
      onClose();
      onSuccess();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication de votre avis.",
        variant: "destructive",
      });
    } finally {
      onSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Un titre pour votre avis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre avis</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Partagez votre expérience..."
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
              <FormLabel>Note</FormLabel>
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
          Publier
        </Button>
      </form>
    </Form>
  );
};
