
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { formSchema } from "@/utils/access-document/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import { checkBruteForceAttempt } from "@/utils/securityUtils";
import { logAccessEvent } from "@/utils/accessLoggingUtils";

export const useDirectivesAccessForm = () => {
  // Form setup with Zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      accessCode: ""
    }
  });

  // States
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [blockedAccess, setBlockedAccess] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  
  // Navigation & store
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  
  // Hook for code verification
  const { verifierCode, loading: verificationLoading, result } = useVerifierCodeAcces();
  
  // Watch for code changes in the form
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "accessCode") {
        setCode(value.accessCode || "");
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Handle verification result
  useEffect(() => {
    if (result) {
      console.log("Résultat de la vérification:", result);
      
      if (result.success) {
        setErrorMessage(null);
        setBlockedAccess(false);
        
        toast({
          title: "Accès autorisé",
          description: "Le code d'accès est valide. Chargement du dossier...",
        });
        
        // Log successful access
        const formData = form.getValues();
        try {
          logAccessEvent({
            userId: result.dossier?.userId || '00000000-0000-0000-0000-000000000000',
            accessCodeId: result.dossier?.id || 'unknown',
            consultantName: formData.lastName,
            consultantFirstName: formData.firstName,
            resourceType: "directive",
            resourceId: result.dossier?.id,
            action: "access",
            success: true
          });
        } catch (err) {
          console.error("Erreur lors de la journalisation de l'accès:", err);
        }
        
        // Store active file and navigate
        if (result.dossier) {
          setDossierActif({
            id: result.dossier.id,
            contenu: result.dossier.contenu,
            profileData: result.dossier.profileData
          });
          
          // Navigate to file display page
          setTimeout(() => {
            navigate('/affichage-dossier');
          }, 500);
        }
      } else {
        setErrorMessage(result.error || "Code d'accès invalide");
        
        // Log failed attempt
        try {
          const formData = form.getValues();
          logAccessEvent({
            userId: '00000000-0000-0000-0000-000000000000',
            accessCodeId: 'failed_attempt',
            consultantName: formData.lastName,
            consultantFirstName: formData.firstName,
            resourceType: "directive",
            action: "attempt",
            success: false
          });
        } catch (err) {
          console.error("Erreur lors de la journalisation de l'accès:", err);
        }
        
        toast({
          title: "Accès refusé",
          description: result.error || "Code d'accès invalide",
          variant: "destructive"
        });
      }
    }
  }, [result, navigate, setDossierActif, form]);

  // Handle access directives action
  const handleAccessDirectives = async () => {
    // Validate form
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }
    
    const formData = form.getValues();
    setErrorMessage(null);
    
    // Brute force protection
    const bruteForcePrevention = `directives_${formData.lastName.toLowerCase()}_${formData.birthDate}`;
    const bruteForceCheck = checkBruteForceAttempt(bruteForcePrevention);
    
    if (!bruteForceCheck.allowed) {
      setBlockedAccess(true);
      setErrorMessage(`Trop de tentatives. Veuillez réessayer dans ${Math.ceil((bruteForceCheck.blockExpiresIn || 0) / 60)} minutes.`);
      return;
    }
    
    setRemainingAttempts(bruteForceCheck.remainingAttempts);
    
    try {
      // Debug logs
      console.log("Vérification du code d'accès:", code);
      console.log("Données du formulaire:", formData);
      
      // Verify access code via Edge function
      await verifierCode(code, `${formData.lastName.substring(0, 2)}${formData.firstName.substring(0, 2)}`);
    } catch (error) {
      console.error("Erreur lors de la vérification du code:", error);
      setErrorMessage("Une erreur est survenue lors de la vérification du code d'accès");
    }
  };

  return {
    form,
    loading: verificationLoading,
    handleAccessDirectives,
    errorMessage,
    remainingAttempts,
    blockedAccess,
  };
};
