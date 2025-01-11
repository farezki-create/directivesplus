import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GeneralOpinion } from "./sections/GeneralOpinion";

type Values = {
  noLifeSupport: boolean;
  communicateWithOthers: boolean;
  selfCare: boolean;
  noPain: boolean;
  withFamily: boolean;
  notABurden: boolean;
  additionalComments: string;
};

type QuestionnaireData = {
  doNotWishToAnswer: boolean;
  values: Values;
};

export const QuestionnaireForm = () => {
  const form = useForm<QuestionnaireData>({
    defaultValues: {
      doNotWishToAnswer: false,
      values: {
        noLifeSupport: false,
        communicateWithOthers: false,
        selfCare: false,
        noPain: false,
        withFamily: false,
        notABurden: false,
        additionalComments: "",
      },
    },
  });
  const { toast } = useToast();

  const onSubmit = async (data: QuestionnaireData) => {
    try {
      console.log('Submitting form data:', data);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour sauvegarder vos directives.",
        });
        return;
      }

      const { error } = await supabase
        .from('advance_directives')
        .upsert([{
          user_id: session.user.id,
          life_support: JSON.stringify(data.values),
          let_die: data.doNotWishToAnswer ? "true" : "false",
        }]);

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