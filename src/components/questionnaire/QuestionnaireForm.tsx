import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfo } from "./sections/PersonalInfo";
import { MedicalInfo } from "./sections/MedicalInfo";
import { EndOfLifeWishes } from "./sections/EndOfLifeWishes";
import { Values } from "./sections/Values";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type QuestionnaireData = {
  personalInfo: {
    firstName: string;
    lastName: string;
    birthDate: string;
    address: string;
    phone: string;
  };
  medicalInfo: {
    currentHealth: string;
    medications: string[];
    allergies: string[];
  };
  endOfLifeWishes: {
    generalOpinion: boolean;
    otherDirectives: boolean;
    lifeSupport: string;
    painRelief: string;
    letDie: string;
  };
  values: {
    noLifeSupport: boolean;
    communicateWithOthers: boolean;
    selfCare: boolean;
    noPain: boolean;
    resolveConflicts: boolean;
    familyTime: boolean;
    notABurden: boolean;
    noTubes: boolean;
    respectValues: boolean;
    dieAtHome: boolean;
    otherValues: string;
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

      const { error } = await supabase
        .from('advance_directives')
        .upsert({
          user_id: session.user.id,
          general_opinion: data.endOfLifeWishes.generalOpinion,
          other_directives: data.endOfLifeWishes.otherDirectives,
          life_support: data.endOfLifeWishes.lifeSupport,
          pain_relief: data.endOfLifeWishes.painRelief,
          let_die: data.endOfLifeWishes.letDie,
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
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="border-b pb-3">
            <Tabs defaultValue="values" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-auto">
                <TabsTrigger 
                  value="values"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 text-sm"
                >
                  Mes valeurs
                </TabsTrigger>
                <TabsTrigger 
                  value="culture"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 text-sm"
                >
                  Ma religion et ma culture
                </TabsTrigger>
                <TabsTrigger 
                  value="joys"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 text-sm"
                >
                  Mes goûts et mes joies
                </TabsTrigger>
                <TabsTrigger 
                  value="laugh"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 text-sm"
                >
                  Rire
                </TabsTrigger>
                <TabsTrigger 
                  value="dislikes"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 text-sm"
                >
                  Mes dégoûts et mes peurs
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="values" className="mt-6">
                <Values form={form} />
              </TabsContent>
              
              {/* Other tabs content will be implemented later */}
            </Tabs>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-end mt-6">
              <Button type="submit">Sauvegarder</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
