
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionnaireContent } from "./questionnaire/QuestionnaireContent";
import { QuestionnaireForm } from "./questionnaire/QuestionnaireForm";
import { useQuestionnaireForm } from "./hooks/useQuestionnaireForm";
import { useMedicalQuestionnaireSubmit } from "./hooks/useMedicalQuestionnaireSubmit";

export function MedicalQuestionnaire({ onDataSaved }: { onDataSaved?: () => void }) {
  const { form, isLoading: formLoading } = useQuestionnaireForm();
  const { onSubmit, isLoading: submitLoading } = useMedicalQuestionnaireSubmit({ onDataSaved });
  
  const isLoading = formLoading || submitLoading;
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Questionnaire médical</CardTitle>
      </CardHeader>
      <CardContent>
        <QuestionnaireForm 
          form={form}
          onSubmit={onSubmit}
          isLoading={isLoading}
        >
          <QuestionnaireContent control={form.control} isLoading={isLoading} />
        </QuestionnaireForm>
      </CardContent>
    </Card>
  );
}
