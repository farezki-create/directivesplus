
import { useRef } from "react";
import { User } from "@supabase/supabase-js";
import { downloadCard, printCard } from "@/components/card/utils/cardOperations";
import { toast } from "@/hooks/use-toast";

export const useCardOperations = (
  user: User | null,
  firstName: string,
  lastName: string,
  includeDirective: boolean,
  includeMedical: boolean,
  directiveCode: string | null,
  medicalCode: string | null
) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour télécharger la carte",
        variant: "destructive"
      });
      return;
    }
    
    const missingCodes = [];
    
    if (includeDirective && !directiveCode) {
      missingCodes.push("directives anticipées");
    }
    
    if (includeMedical && !medicalCode) {
      missingCodes.push("données médicales");
    }
    
    if (missingCodes.length > 0) {
      toast({
        title: "Codes manquants",
        description: `Les codes d'accès pour ${missingCodes.join(" et ")} n'ont pas été générés. Veuillez d'abord générer la carte.`,
        variant: "destructive"
      });
      return;
    }
    
    await downloadCard({
      cardRef,
      userId: user.id,
      firstName,
      lastName,
      includeDirective,
      includeMedical,
      directiveCode,
      medicalCode
    });
  };
  
  const handlePrint = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour imprimer la carte",
        variant: "destructive"
      });
      return;
    }
    
    const missingCodes = [];
    
    if (includeDirective && !directiveCode) {
      missingCodes.push("directives anticipées");
    }
    
    if (includeMedical && !medicalCode) {
      missingCodes.push("données médicales");
    }
    
    if (missingCodes.length > 0) {
      toast({
        title: "Codes manquants",
        description: `Les codes d'accès pour ${missingCodes.join(" et ")} n'ont pas été générés. Veuillez d'abord générer la carte.`,
        variant: "destructive"
      });
      return;
    }
    
    await printCard({
      cardRef,
      userId: user.id,
      firstName,
      lastName,
      includeDirective,
      includeMedical,
      directiveCode,
      medicalCode
    });
  };

  return {
    cardRef,
    handleDownload,
    handlePrint
  };
};
