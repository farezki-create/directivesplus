
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useAccessCode, generateAccessCode } from "@/hooks/useAccessCode";
import { toast } from "@/hooks/use-toast";

export interface AccessCodeState {
  directiveCode: string | null;
  medicalCode: string | null;
  isGenerating: boolean;
  isCardReady: boolean;
}

export const useAccessCardGeneration = (
  user: User | null, 
  includeDirective: boolean, 
  includeMedical: boolean
) => {
  const [directiveCode, setDirectiveCode] = useState<string | null>(null);
  const [medicalCode, setMedicalCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCardReady, setIsCardReady] = useState(false);
  
  // Use the hook to get the initial values
  const directiveCodeFromHook = useAccessCode(user, "directive");
  const medicalCodeFromHook = useAccessCode(user, "medical");

  // Update local state when codes are retrieved from the hooks
  useEffect(() => {
    if (directiveCodeFromHook) {
      console.log("Setting directive code from hook:", directiveCodeFromHook);
      setDirectiveCode(directiveCodeFromHook);
    }
  }, [directiveCodeFromHook]);
  
  useEffect(() => {
    if (medicalCodeFromHook) {
      console.log("Setting medical code from hook:", medicalCodeFromHook);
      setMedicalCode(medicalCodeFromHook);
    }
  }, [medicalCodeFromHook]);

  // Determine if the card is ready based on selected options and available codes
  useEffect(() => {
    // Explicitly calculate a boolean value for card readiness
    const isReady = Boolean(
      (!includeDirective || directiveCode) && 
      (!includeMedical || medicalCode)
    );
    console.log("Card ready check:", { includeDirective, directiveCode, includeMedical, medicalCode, isReady });
    setIsCardReady(isReady);
  }, [includeDirective, includeMedical, directiveCode, medicalCode]);

  // Function to handle generating/refreshing the codes
  const handleGenerateCard = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour générer la carte",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      let newDirectiveCode = null;
      let newMedicalCode = null;
      
      // Generate new codes as needed
      if (includeDirective) {
        newDirectiveCode = await generateAccessCode(user, "directive");
        console.log("Generated directive code:", newDirectiveCode);
        setDirectiveCode(newDirectiveCode);
      }
      
      if (includeMedical) {
        newMedicalCode = await generateAccessCode(user, "medical");
        console.log("Generated medical code:", newMedicalCode);
        setMedicalCode(newMedicalCode);
      }
      
      toast({
        title: "Carte générée",
        description: "La carte d'accès a été générée avec succès",
      });
      
      // Update card ready state after generation - ensure we get a boolean result
      const newCardReady = Boolean(
        (!includeDirective || newDirectiveCode !== null) && 
        (!includeMedical || newMedicalCode !== null)
      );
        
      setIsCardReady(newCardReady);
    } catch (error) {
      console.error("Error generating card:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la carte d'accès",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    directiveCode,
    medicalCode,
    isGenerating,
    isCardReady,
    handleGenerateCard
  };
};
