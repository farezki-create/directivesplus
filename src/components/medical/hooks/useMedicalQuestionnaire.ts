
import { useMedicalData } from "@/hooks/useMedicalData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";
import { useQuestionnaireForm } from "./useQuestionnaireForm";
import { usePDFGeneration } from "./usePDFGeneration";
import { useCSVGeneration } from "./useCSVGeneration";

/**
 * Main hook for handling medical questionnaire functionality
 */
export function useMedicalQuestionnaire() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { saveMedicalData } = useMedicalData(user?.id || "");
  const { toast } = useToast();
  const { form } = useQuestionnaireForm();
  const { generatePDF } = usePDFGeneration();
  const { generateCSV } = useCSVGeneration();

  const onSubmit = async (data: MedicalQuestionnaireData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos données",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate PDF and CSV
      const pdfOutput = generatePDF(data);
      const csvContent = generateCSV(data);
      
      // Save the data to the database
      const accessCode = await saveMedicalData({
        type: "medical_questionnaire",
        title: "Questionnaire médical préalable",
        date: new Date().toISOString(),
        data: data,
        pdfUrl: pdfOutput,
        csvContent: csvContent
      });

      if (accessCode) {
        toast({
          title: "Succès",
          description: "Le questionnaire a été enregistré et le PDF généré",
        });
        
        // Navigate to the medical data page
        navigate("/medical-data");
      } else {
        throw new Error("Failed to save medical data");
      }
    } catch (error) {
      console.error("Error saving medical questionnaire:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du questionnaire",
        variant: "destructive",
      });
    }
  };

  return { form, onSubmit };
}
