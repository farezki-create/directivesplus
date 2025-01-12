import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useQuestionnaire, QuestionnaireData } from "@/hooks/useQuestionnaire";
import { MedicalInfo } from "./sections/MedicalInfo";
import { EndOfLifeWishes } from "./sections/EndOfLifeWishes";

export const QuestionnaireForm = () => {
  const form = useForm<QuestionnaireData>();
  const { isLoading, saveQuestionnaire } = useQuestionnaire();

  const onSubmit = async (data: QuestionnaireData) => {
    await saveQuestionnaire(data);
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

              <MedicalInfo form={form} />
              <EndOfLifeWishes form={form} />
            </div>

            <div className="flex justify-between mt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
              <Button type="button" variant="secondary">Suite</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};