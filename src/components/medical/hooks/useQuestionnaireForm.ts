
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  medicalQuestionnaireSchema,
  MedicalQuestionnaireData 
} from "../schemas/medicalQuestionnaireSchema";

/**
 * Hook for creating and managing the medical questionnaire form
 */
export function useQuestionnaireForm() {
  const form = useForm<MedicalQuestionnaireData>({
    resolver: zodResolver(medicalQuestionnaireSchema),
    defaultValues: {
      symptomes: [],
      famille: [],
      pathologies: [],
      chirurgies: [],
      allergies: [],
    },
  });

  return { form };
}
