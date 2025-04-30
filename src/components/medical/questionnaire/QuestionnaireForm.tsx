
import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";

interface QuestionnaireFormProps {
  form: UseFormReturn<MedicalQuestionnaireData>;
  onSubmit: (data: MedicalQuestionnaireData) => void;
  isLoading: boolean;
  children: React.ReactNode;
}

export function QuestionnaireForm({ form, onSubmit, isLoading, children }: QuestionnaireFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {children}
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 w-full py-5 text-lg"
            disabled={isLoading}
          >
            Enregistrer le questionnaire
          </Button>
        </div>
      </form>
    </Form>
  );
}
