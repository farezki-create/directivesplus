
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData, formSchema } from "@/utils/access-document/validationSchema";
import { checkBruteForceAttempt, resetBruteForceCounter } from "@/utils/securityUtils";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { useDossierStore, Dossier } from "@/store/dossierStore";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const useDirectivesAccessForm = (onSubmitProp?: (accessCode: string, formData: any) => Promise<void>) => {
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
    try {
      await form.handleSubmit(async (formData) => {
        setErrorMessage(null);
        setLoading(true);
        
        try {
          // If external onSubmit is provided, use it
          if (onSubmitProp) {
            await onSubmitProp(formData.accessCode, formData);
            setLoading(false);
            return;
          }
          
          // Identifier for brute force detection
          const bruteForceIdentifier = `directives_access_${formData.lastName.substring(0, 3)}_${formData.firstName.substring(0, 3)}`;
          
          // Check if user is not blocked for brute force
          const bruteForceCheck = checkBruteForceAttempt(bruteForceIdentifier);
          
          if (!bruteForceCheck.allowed) {
            setBlockedAccess(true);
            const message = `Trop de tentatives. Veuillez réessayer dans ${Math.ceil(bruteForceCheck.blockExpiresIn! / 60)} minutes.`;
            setErrorMessage(message);
            toast({
              variant: "destructive",
              title: "Accès bloqué",
              description: message
            });
            setLoading(false);
            return;
          }
          
          setRemainingAttempts(bruteForceCheck.remainingAttempts);
          
          // Check access code with Edge function
          const result = await verifierCode(formData.accessCode, bruteForceIdentifier);
          
          if (result.success && result.dossier) {
            // Réinitialiser le compteur de tentatives
            resetBruteForceCounter(bruteForceIdentifier);
            
            // Ensure the dossier object has all required properties
            const dossier: Dossier = {
              id: result.dossier.id,
              userId: result.dossier.userId,
              isFullAccess: result.dossier.isFullAccess || false,
              isDirectivesOnly: result.dossier.isDirectivesOnly || true,
              isMedicalOnly: result.dossier.isMedicalOnly || false,
              profileData: result.dossier.profileData,
              contenu: result.dossier.contenu || {} // Provide a default empty object if contenu is undefined
            };
            
            // Store active dossier
            setDossierActif(dossier);
            
            // Show success message
            toast({
              title: "Accès autorisé",
              description: "Chargement des directives anticipées...",
            });
            
            // Redirect to file display page
            navigate("/affichage-dossier");
          } else {
            const errorMsg = result.error || "Accès refusé. Veuillez vérifier vos informations.";
            setErrorMessage(errorMsg);
            toast({
              variant: "destructive",
              title: "Accès refusé",
              description: errorMsg
            });
          }
        } catch (error: any) {
          console.error("Erreur lors de l'accès aux directives:", error);
          const errorMsg = "Une erreur est survenue lors de la connexion au serveur. Veuillez réessayer.";
          setErrorMessage(errorMsg);
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: errorMsg
          });
        } finally {
          setLoading(false);
        }
      })();
    } catch (formError) {
      console.error("Erreur de validation du formulaire:", formError);
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
