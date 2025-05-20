
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useAccessCode } from "@/hooks/access-codes/useAccessCode";
import { toast } from "@/components/ui/use-toast";

export interface AccessCodeState {
  directiveCode: string | null;
  medicalCode: string | null;
  isCardReady: boolean;
}

/**
 * This hook now only fetches existing codes without generation capability
 */
export const useAccessCardGeneration = (
  user: User | null, 
  includeDirective: boolean, 
  includeMedical: boolean
) => {
  const [directiveCode, setDirectiveCode] = useState<string | null>(null);
  const [medicalCode, setMedicalCode] = useState<string | null>(null);
  const [isCardReady, setIsCardReady] = useState(false);
  
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

  // Empty generation function - notifies that generation is disabled
  const handleGenerateCard = () => {
    toast({
      title: "Fonctionnalité désactivée",
      description: "La génération automatique de codes d'accès a été désactivée.",
      variant: "destructive"
    });
  };

  return {
    directiveCode,
    medicalCode,
    isCardReady,
    handleGenerateCard,
    isLoading: directiveLoading || medicalLoading
  };
};
