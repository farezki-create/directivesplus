
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData, formSchema } from "@/utils/access-document/validationSchema";
import { checkBruteForceAttempt } from "@/utils/securityUtils";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { useDossierStore } from "@/store/dossierStore";
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
      // Identifier pour la détection de force brute
      const bruteForceIdentifier = `directives_access_${formData.lastName.substring(0, 3)}_${formData.firstName.substring(0, 3)}`;
      
      // Vérifier si l'utilisateur n'est pas bloqué pour force brute
      const bruteForceCheck = checkBruteForceAttempt(bruteForceIdentifier);
      
      if (!bruteForceCheck.allowed) {
        setBlockedAccess(true);
        setErrorMessage(`Trop de tentatives. Veuillez réessayer dans ${Math.ceil(bruteForceCheck.blockExpiresIn! / 60)} minutes.`);
        setLoading(false);
        return;
      }
      
      setRemainingAttempts(bruteForceCheck.remainingAttempts);
      
      // Vérification du code d'accès avec la fonction Edge
      const result = await verifierCode(formData.accessCode, bruteForceIdentifier);
      
      if (result.success && result.dossier) {
        // Stockage du dossier actif
        setDossierActif(result.dossier);
        
        // Redirection vers la page d'affichage du dossier
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
