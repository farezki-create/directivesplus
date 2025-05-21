
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData, formSchema } from "@/utils/access-document/validationSchema";
import { checkBruteForceAttempt } from "@/utils/securityUtils";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { useDossierStore, Dossier } from "@/store/dossierStore";
import { useNavigate } from "react-router-dom";

export const useDirectivesAccessForm = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [blockedAccess, setBlockedAccess] = useState(false);
  const navigate = useNavigate();
  const { verifierCode } = useVerifierCodeAcces();
  const { setDossierActif } = useDossierStore();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      accessCode: ""
    }
  });

  const handleAccessDirectives = async () => {
    const formData = form.getValues();
    setErrorMessage(null);
    setLoading(true);
    
    try {
      // Identifier for brute force detection
      const bruteForceIdentifier = `directives_access_${formData.lastName.substring(0, 3)}_${formData.firstName.substring(0, 3)}`;
      
      // Check if user is not blocked for brute force
      const bruteForceCheck = checkBruteForceAttempt(bruteForceIdentifier);
      
      if (!bruteForceCheck.allowed) {
        setBlockedAccess(true);
        setErrorMessage(`Trop de tentatives. Veuillez réessayer dans ${Math.ceil(bruteForceCheck.blockExpiresIn! / 60)} minutes.`);
        setLoading(false);
        return;
      }
      
      setRemainingAttempts(bruteForceCheck.remainingAttempts);
      
      // Check access code with Edge function
      const result = await verifierCode(formData.accessCode, bruteForceIdentifier);
      
      if (result.success && result.dossier) {
        // Ensure the dossier object has all required properties
        const dossier: Dossier = {
          id: result.dossier.id,
          userId: result.dossier.userId,
          isFullAccess: result.dossier.isFullAccess,
          isDirectivesOnly: result.dossier.isDirectivesOnly,
          isMedicalOnly: result.dossier.isMedicalOnly,
          profileData: result.dossier.profileData,
          contenu: result.dossier.contenu || {} // Provide a default empty object if contenu is undefined
        };
        
        // Store active dossier
        setDossierActif(dossier);
        
        // Redirect to file display page
        navigate("/affichage-dossier");
      } else {
        setErrorMessage(result.error || "Accès refusé. Veuillez vérifier vos informations.");
      }
    } catch (error: any) {
      console.error("Erreur lors de l'accès aux directives:", error);
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleAccessDirectives,
    errorMessage,
    remainingAttempts,
    blockedAccess
  };
};
