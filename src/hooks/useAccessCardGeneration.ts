
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

export const useAccessCardGeneration = (user: User | null, includeDirective: boolean, includeMedical: boolean) => {
  const [directiveCode, setDirectiveCode] = useState<string | null>(null);
  const [medicalCode, setMedicalCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Use the hook to get the initial values
  const directiveCodeFromHook = useAccessCode(user, "directive");
  const medicalCodeFromHook = useAccessCode(user, "medical");

  // Set the initial values when they're loaded from the hook
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
      // Generate new codes as needed
      if (includeDirective) {
        const newDirectiveCode = await generateAccessCode(user, "directive");
        console.log("Nouveau code directive généré:", newDirectiveCode);
        setDirectiveCode(newDirectiveCode);
      }
      
      if (includeMedical) {
        const newMedicalCode = await generateAccessCode(user, "medical");
        console.log("Nouveau code médical généré:", newMedicalCode);
        setMedicalCode(newMedicalCode);
      }
      
      toast({
        title: "Carte générée",
        description: "La carte d'accès a été générée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la génération de la carte:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la carte d'accès",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Check if the card is ready (if all required codes are available)
  const isCardReady = Boolean(
    (!includeDirective || (includeDirective && directiveCode)) && 
    (!includeMedical || (includeMedical && medicalCode))
  );

  return {
    directiveCode,
    medicalCode,
    isGenerating,
    isCardReady,
    handleGenerateCard
  };
};
