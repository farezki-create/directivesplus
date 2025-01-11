import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GeneralOpinion } from "./sections/GeneralOpinion";

type QuestionnaireData = {
  medicalDirectives: {
    generalOpinion: {
      artificialLife: boolean;
      organDonation: boolean;
      palliativeCare: boolean;
    };
    otherDirectives: {
      resuscitation: boolean;
      artificialNutrition: boolean;
      painManagement: boolean;
    };
  };
};

export const QuestionnaireForm = () => {
  const form = useForm<QuestionnaireData>();
  const { toast } = useToast();

  const onSubmit = async (data: QuestionnaireData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour sauvegarder vos directives.",
        });
        return;
      }

      // Save to Supabase
      const { error } = await supabase
        .from('advance_directives')
        .upsert({
          user_id: session.user.id,
          general_opinion: data.medicalDirectives.generalOpinion,
          other_directives: data.medicalDirectives.otherDirectives,
        });

      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Vos directives ont été sauvegardées.",
      });
    } catch (error) {
      console.error("Error saving form:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Directives anticipées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Vos informations personnelles sont déjà enregistrées dans votre profil. 
                Vous pouvez maintenant renseigner vos directives médicales.
              </p>
            </div>

            <GeneralOpinion form={form} />

            <div className="flex justify-between mt-6">
              <Button type="submit">Sauvegarder</Button>
              <Button type="button" variant="secondary">Suite</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};