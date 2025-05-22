
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";

// Define a form schema
const formSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  accessCode: z.string().min(1, "Le code d'accès est requis")
});

// Define type for form data
type FormData = z.infer<typeof formSchema>;

export const useDirectivesAccessForm = (onSubmitProp?: (accessCode: string, formData: any) => Promise<void>) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [blockedAccess, setBlockedAccess] = useState(false);
  const navigate = useNavigate();
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
          
          // Vérification de la saisie
          if (!formData.accessCode || formData.accessCode.trim() === '') {
            setErrorMessage("Veuillez saisir un code d'accès valide");
            toast({
              variant: "destructive",
              title: "Données manquantes",
              description: "Veuillez saisir un code d'accès valide"
            });
            return;
          }

          console.log("This functionality has been removed. Redirecting to login page.");
          toast({
            title: "Connexion requise",
            description: "Vous devez vous connecter pour accéder à cette fonctionnalité",
            variant: "destructive"
          });
          
          // Redirect to login page
          navigate("/auth", { state: { from: "/acces-directives" } });
        } catch (error: any) {
          console.error("Erreur lors de l'accès aux directives:", error);
          let errorMsg = "Une erreur est survenue lors de la connexion au serveur. Veuillez réessayer.";
          
          if (error.message && error.message.includes("Failed to fetch")) {
            errorMsg = "Impossible de contacter le serveur. Vérifiez votre connexion internet et réessayez.";
          }
          
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
