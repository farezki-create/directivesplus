
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

const questionnaireSchema = z.object({
  // General Information
  nom: z.string().optional(),
  prenom: z.string().optional(),
  date_naissance: z.string().optional(),
  sexe: z.enum(["H", "F", "Autre"]).optional(),
  secu: z.string().optional(),
  adresse: z.string().optional(),
  telephone: z.string().optional(),
  personne_prevenir: z.string().optional(),
  
  // Consultation
  motif: z.string().optional(),
  debut_symptomes: z.string().optional(),
  evolution: z.enum(["aggravation", "amelioration", "stable"]).optional(),
  details_motif: z.string().optional(),
  
  // Symptoms
  symptomes: z.array(z.string()).default([]),
  autres_symptomes: z.string().optional(),
  
  // Medical History
  pathologies: z.array(z.string()).default([]),
  antecedents: z.string().optional(),
  chirurgies: z.array(z.string()).default([]),
  autres_chirurgies: z.string().optional(),
  hospitalisations: z.string().optional(),
  
  // Allergies
  allergies: z.array(z.string()).default([]),
  traitements: z.string().optional(),
  
  // Family History
  famille: z.array(z.string()).default([]),
  
  // Lifestyle
  tabac: z.boolean().optional(),
  alcool: z.boolean().optional(),
  drogues: z.boolean().optional(),
  activite_physique: z.boolean().optional(),
  
  // Special Features
  dispositifs: z.string().optional(),
  directives: z.string().optional(),
  
  // Social Context
  contexte_social_vie: z.string().optional(),
  contexte_social_profession: z.string().optional(),
  contexte_social_couverture: z.string().optional()
});

type QuestionnaireData = z.infer<typeof questionnaireSchema>;

interface MedicalQuestionnaireProps {
  onDataSaved?: () => void;
}

export function MedicalQuestionnaire({ onDataSaved }: MedicalQuestionnaireProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<QuestionnaireData>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      symptomes: [],
      pathologies: [],
      chirurgies: [],
      allergies: [],
      famille: []
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
      // Convert boolean fields for the database
      const tabacValue = data.tabac ? true : false;
      const alcoolValue = data.alcool ? true : false;
      const droguesValue = data.drogues ? true : false;
      const activitePhysiqueValue = data.activite_physique ? true : false;

      const { error } = await supabase
        .from('questionnaire_medical')
        .insert({
          user_id: user.id,
          ...data,
          tabac: tabacValue,
          alcool: alcoolValue,
          drogues: droguesValue,
          activite_physique: activitePhysiqueValue
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
