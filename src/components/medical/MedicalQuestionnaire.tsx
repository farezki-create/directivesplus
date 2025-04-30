
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useMedicalQuestionnaire } from "./hooks/useMedicalQuestionnaire";
import { GeneralInformationSection } from "./questionnaire/GeneralInformationSection";
import { ConsultationReasonSection } from "./questionnaire/ConsultationReasonSection";
import { SymptomsSection } from "./questionnaire/SymptomsSection";
import { MedicalHistorySection } from "./questionnaire/MedicalHistorySection";
import { AllergiesSection } from "./questionnaire/AllergiesSection";
import { CurrentTreatmentsSection } from "./questionnaire/CurrentTreatmentsSection";
import { FamilyHistorySection } from "./questionnaire/FamilyHistorySection";
import { LifestyleSection } from "./questionnaire/LifestyleSection";
import { SocialContextSection } from "./questionnaire/SocialContextSection";
import { SpecialFeaturesSection } from "./questionnaire/SpecialFeaturesSection";
import { medicalQuestionnaireSchema } from "./schemas/medicalQuestionnaireSchema";

export function MedicalQuestionnaire() {
  const { form, onSubmit } = useMedicalQuestionnaire();

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Questionnaire médical préalable</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <GeneralInformationSection control={form.control} />
            <ConsultationReasonSection control={form.control} />
            <SymptomsSection control={form.control} />
            <MedicalHistorySection control={form.control} />
            <AllergiesSection control={form.control} />
            <CurrentTreatmentsSection control={form.control} />
            <FamilyHistorySection control={form.control} />
            <LifestyleSection control={form.control} />
            <SocialContextSection control={form.control} />
            <SpecialFeaturesSection control={form.control} />

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full py-5 text-lg">
                Enregistrer le questionnaire
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
