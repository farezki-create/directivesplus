
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QuestionnaireContent } from "./questionnaire/QuestionnaireContent";
import { medicalQuestionnaireSchema } from "./schemas/medicalQuestionnaireSchema";

type QuestionnaireData = z.infer<typeof medicalQuestionnaireSchema>;

interface MedicalQuestionnaireProps {
  onDataSaved?: () => void;
}

export function MedicalQuestionnaire({ onDataSaved }: MedicalQuestionnaireProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<QuestionnaireData>({
    resolver: zodResolver(medicalQuestionnaireSchema),
    defaultValues: {
      symptomes: [],
      pathologies: [],
      chirurgies: [],
      allergies: [],
      famille: [],
      tabac: false,
      alcool: false,
      drogues: false,
      activite_physique: false
    }
  });

  const onSubmit = async (data: QuestionnaireData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos données",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('questionnaire_medical')
        .insert({
          user_id: user.id,
          ...data
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Questionnaire médical enregistré avec succès",
      });

      if (onDataSaved) onDataSaved();

    } catch (error) {
      console.error("Error saving questionnaire:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du questionnaire",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Questionnaire médical</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <QuestionnaireContent control={form.control} isLoading={isLoading} />
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 w-full py-5 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Enregistrement..." : "Enregistrer le questionnaire"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
