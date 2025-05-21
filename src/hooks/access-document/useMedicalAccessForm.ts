
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormData } from "@/utils/access-document/validationSchema";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { checkBruteForceAttempt } from "@/utils/securityUtils";
import { logAccessEvent } from "@/utils/accessLoggingUtils";
import { useNavigate } from "react-router-dom";

export const useMedicalAccessForm = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [blockedAccess, setBlockedAccess] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const navigate = useNavigate();
  
  const { verifierCode, loading: verificationLoading, result } = useVerifierCodeAcces();
  
  // Initialisation de react-hook-form avec le resolver zod
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      accessCode: ""
    }
  });

  // Handle access
  const handleAccess = async () => {
    // Vérifier si le formulaire est valide
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }
    
    const formData = form.getValues();
    setErrorMessage(null);
    
    // Créer un identifiant pour la protection contre la force brute
    const bruteForcePrevention = `medical_${formData.lastName.toLowerCase()}_${formData.birthDate}`;
    
    // Vérifier si l'accès n'est pas bloqué pour cause de trop de tentatives
    const bruteForceCheck = checkBruteForceAttempt(bruteForcePrevention);
    
    if (!bruteForceCheck.allowed) {
      setBlockedAccess(true);
      setErrorMessage(`Trop de tentatives. Veuillez réessayer dans ${Math.ceil((bruteForceCheck.blockExpiresIn || 0) / 60)} minutes.`);
      return;
    }
    
    setRemainingAttempts(bruteForceCheck.remainingAttempts);
    setLoading(true);
    
    try {
      // Vérifier le code d'accès médical via la fonction Edge
      const result = await verifierCode(formData.accessCode, `medical_${formData.lastName.substring(0, 2)}`);
      
      if (result.success) {
        logAccessEvent({
          userId: result.dossier?.userId || '00000000-0000-0000-0000-000000000000',
          accessCodeId: result.dossier?.id || 'unknown',
          consultantName: formData.lastName,
          consultantFirstName: formData.firstName,
          resourceType: "medical",
          resourceId: result.dossier?.id,
          action: "access",
          success: true
        });
        
        // Navigation vers la page de données médicales
        setTimeout(() => {
          navigate('/donnees-medicales');
        }, 500);
      } else {
        setErrorMessage(result.error || "Accès refusé");
        
        // Log failed attempt
        logAccessEvent({
          userId: '00000000-0000-0000-0000-000000000000',
          accessCodeId: 'failed_attempt',
          consultantName: formData.lastName,
          consultantFirstName: formData.firstName,
          resourceType: "medical",
          action: "attempt",
          success: false
        });
      }
    } catch (error: any) {
      console.error("Erreur lors de l'accès médical:", error);
      setErrorMessage(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading: loading || verificationLoading,
    errorMessage,
    blockedAccess,
    remainingAttempts,
    handleAccess
  };
};
