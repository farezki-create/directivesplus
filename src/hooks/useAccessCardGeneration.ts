
import { useState, useEffect, useCallback } from "react";
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
  
  // Get initial access codes
  const directiveCodeFromHook = useAccessCode(user, "directive");
  const medicalCodeFromHook = useAccessCode(user, "medical");

  // Set initial codes from database
  useEffect(() => {
    if (directiveCodeFromHook) {
      setDirectiveCode(directiveCodeFromHook);
    }
  }, [directiveCodeFromHook]);
  
  useEffect(() => {
    if (medicalCodeFromHook) {
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

  // Generate card function with useCallback to prevent unnecessary re-renders
  const handleGenerateCard = useCallback(async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour générer la carte",
        variant: "destructive"
      });
      return;
    }
    
    // Don't do anything if no options are selected
    if (!includeDirective && !includeMedical) {
      toast({
        title: "Attention",
        description: "Veuillez sélectionner au moins un type de code à inclure",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      if (includeDirective) {
        const code = await generateAccessCode(user, "directive");
        setDirectiveCode(code);
      }
      
      if (includeMedical) {
        const code = await generateAccessCode(user, "medical");
        setMedicalCode(code);
      }
      
      toast({
        title: "Carte générée",
        description: "La carte d'accès a été générée avec succès",
      });
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
  }, [user, includeDirective, includeMedical]);

  return {
    directiveCode,
    medicalCode,
    isGenerating,
    isCardReady,
    handleGenerateCard
  };
};
