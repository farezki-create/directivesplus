
import React from "react";
import { useMedicalQuestionnaire } from "./hooks/useMedicalQuestionnaire";
import { QuestionnaireLayout } from "./questionnaire/QuestionnaireLayout";
import { QuestionnaireForm } from "./questionnaire/QuestionnaireForm";
import { QuestionnaireContent } from "./questionnaire/QuestionnaireContent";

export function MedicalQuestionnaire() {
  const { form, onSubmit, isLoading } = useMedicalQuestionnaire();

  return (
    <QuestionnaireLayout title="Questionnaire médical préalable">
      <QuestionnaireForm 
        form={form} 
        onSubmit={onSubmit} 
        isLoading={isLoading}
      >
        <QuestionnaireContent control={form.control} isLoading={isLoading} />
      </QuestionnaireForm>
    </QuestionnaireLayout>
  );
}
