
import React from "react";
import { Control } from "react-hook-form";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";
import { GeneralInformationSection } from "./GeneralInformationSection";
import { ConsultationReasonSection } from "./ConsultationReasonSection";
import { SymptomsSection } from "./SymptomsSection";
import { MedicalHistorySection } from "./MedicalHistorySection";
import { AllergiesSection } from "./AllergiesSection";
import { CurrentTreatmentsSection } from "./CurrentTreatmentsSection";
import { FamilyHistorySection } from "./FamilyHistorySection";
import { LifestyleSection } from "./LifestyleSection";
import { SpecialFeaturesSection } from "./SpecialFeaturesSection";

interface QuestionnaireContentProps {
  control: Control<MedicalQuestionnaireData>;
  isLoading: boolean;
}

export function QuestionnaireContent({ control, isLoading }: QuestionnaireContentProps) {
  return (
    <>
      <GeneralInformationSection control={control} isLoading={isLoading} />
      <ConsultationReasonSection control={control} />
      <SymptomsSection control={control} />
      <MedicalHistorySection control={control} />
      <AllergiesSection control={control} />
      <CurrentTreatmentsSection control={control} />
      <FamilyHistorySection control={control} />
      <LifestyleSection control={control} />
      <SpecialFeaturesSection control={control} />
    </>
  );
}
