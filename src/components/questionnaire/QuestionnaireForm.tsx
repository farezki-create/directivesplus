import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfo } from "./sections/PersonalInfo";
import { MedicalInfo } from "./sections/MedicalInfo";
import { EndOfLifeWishes } from "./sections/EndOfLifeWishes";
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
    resuscitation: boolean;
    artificialNutrition: boolean;
    painManagement: string;
    organDonation: boolean;
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

      // TODO: Sauvegarder les données dans Supabase
      console.log("Form data:", data);
      
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
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
                <TabsTrigger value="medical">Informations médicales</TabsTrigger>
                <TabsTrigger value="wishes">Souhaits de fin de vie</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <PersonalInfo form={form} />
              </TabsContent>
              
              <TabsContent value="medical">
                <MedicalInfo form={form} />
              </TabsContent>
              
              <TabsContent value="wishes">
                <EndOfLifeWishes form={form} />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end mt-6">
              <Button type="submit">Sauvegarder</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};