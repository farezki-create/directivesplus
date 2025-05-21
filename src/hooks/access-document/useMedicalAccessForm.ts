
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData, formSchema } from "@/utils/access-document/validationSchema";
import { toast } from "@/hooks/use-toast";
import { logAccessEvent } from "@/utils/accessLoggingUtils";
import { checkBruteForceAttempt, resetBruteForceCounter } from "@/utils/securityUtils";
import { accessMedicalData } from "@/utils/access-document/accessUtils";
import { ErrorType, handleError } from "@/utils/error-handling/error-handler";

export const useMedicalAccessForm = () => {
  // States
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [blockedAccess, setBlockedAccess] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize the form with validation
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      accessCode: ""
    }
  });

  // Handle access to medical data
  const handleAccess = async () => {
    // Verify if the form is valid
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }
    
    const formData = form.getValues();
    setErrorMessage(null);
    
    // Create an identifier for brute force prevention
    // Based on user information
    const bruteForcePrevention = `medical_${formData.lastName.toLowerCase()}_${formData.birthDate}`;
    
    // Check if access is not blocked due to too many attempts
    const bruteForceCheck = checkBruteForceAttempt(bruteForcePrevention);
    
    if (!bruteForceCheck.allowed) {
      setBlockedAccess(true);
      setErrorMessage(`Trop de tentatives. Veuillez réessayer dans ${Math.ceil((bruteForceCheck.blockExpiresIn || 0) / 60)} minutes.`);
      return;
    }
    
    setRemainingAttempts(bruteForceCheck.remainingAttempts);
    setLoading(true);
    
    try {
      // Access medical data
      const result = await accessMedicalData(formData);
      
      if (result && result.success) {
        // Reset brute force counter on success
        resetBruteForceCounter(bruteForcePrevention);
        
        // Log successful access
        logAccessEvent({
          userId: result.userId || '00000000-0000-0000-0000-000000000000',
          accessCodeId: result.accessCodeId || 'unknown',
          consultantName: formData.lastName,
          consultantFirstName: formData.firstName,
          resourceType: "medical",
          resourceId: result.resourceId,
          action: "access",
          success: true
        });
        
        setErrorMessage(null);
        setBlockedAccess(false);
      } else {
        // Log failed attempt
        logAccessEvent({
          userId: '00000000-0000-0000-0000-000000000000',
          accessCodeId: 'invalid_attempt',
          consultantName: formData.lastName,
          consultantFirstName: formData.firstName,
          resourceType: "medical",
          action: "attempt",
          success: false
        });
        
        setErrorMessage(result?.error || "Accès refusé");
      }
    } catch (error) {
      handleError({
        error,
        type: ErrorType.CLIENT,
        component: "MedicalAccessForm",
        operation: "handleAccessMedicalData",
        showToast: false
      });
      
      setErrorMessage("Une erreur est survenue lors de la vérification de l'accès");
      
      // Log the error
      logAccessEvent({
        userId: '00000000-0000-0000-0000-000000000000',
        accessCodeId: 'error',
        consultantName: formData.lastName,
        consultantFirstName: formData.firstName,
        resourceType: "medical",
        action: "attempt",
        success: false
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    errorMessage,
    blockedAccess,
    remainingAttempts,
    handleAccess
  };
};
