
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useAccessCode } from "@/hooks/access-codes/useAccessCode";
import { generateAccessCode } from "@/hooks/access-codes/generateCode";
import { toast } from "@/components/ui/use-toast";

export interface AccessCodeState {
  directiveCode: string | null;
  medicalCode: string | null;
  isCardReady: boolean;
}

export const useAccessCardGeneration = (
  user: User | null, 
  includeDirective: boolean, 
  includeMedical: boolean
) => {
  const [directiveCode, setDirectiveCode] = useState<string | null>(null);
  const [medicalCode, setMedicalCode] = useState<string | null>(null);
  const [isCardReady, setIsCardReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Get access codes
  const { accessCode: directiveCodeFromHook, isLoading: directiveLoading } = useAccessCode(user, "directive");
  const { accessCode: medicalCodeFromHook, isLoading: medicalLoading } = useAccessCode(user, "medical");

  // Set codes from database
  useEffect(() => {
    if (directiveCodeFromHook !== null) {
      setDirectiveCode(directiveCodeFromHook);
    }
  }, [directiveCodeFromHook]);
  
  useEffect(() => {
    if (medicalCodeFromHook !== null) {
      setMedicalCode(medicalCodeFromHook);
    }
  }, [medicalCodeFromHook]);

  // Update card ready status whenever codes or options change
  useEffect(() => {
    if (!includeDirective && !includeMedical) {
      // No codes selected, card is not ready
      setIsCardReady(false);
      return;
    }

    // Check if all required codes are available
    const directiveReady = !includeDirective || directiveCode !== null;
    const medicalReady = !includeMedical || medicalCode !== null;
    
    // Card is ready when all required codes are available
    setIsCardReady(directiveReady && medicalReady);
    
  }, [includeDirective, includeMedical, directiveCode, medicalCode]);

  // Generate function that can regenerate codes
  const handleGenerateCard = async () => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour générer des codes d'accès",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Generate directive code if needed
      if (includeDirective) {
        const newDirectiveCode = await generateAccessCode(user, "directive");
        if (newDirectiveCode) {
          setDirectiveCode(newDirectiveCode);
        }
      }

      // Generate medical code if needed
      if (includeMedical) {
        const newMedicalCode = await generateAccessCode(user, "medical");
        if (newMedicalCode) {
          setMedicalCode(newMedicalCode);
        }
      }

      // Show success toast
      toast({
        title: "Codes d'accès régénérés",
        description: "Vos nouveaux codes d'accès sont désormais disponibles"
      });
    } catch (err) {
      console.error("Error generating codes:", err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération des codes",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    directiveCode,
    medicalCode,
    isCardReady,
    handleGenerateCard,
    isGenerating,
    isLoading: directiveLoading || medicalLoading
  };
};
