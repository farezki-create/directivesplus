
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";
import { validatePublicAccessData } from "@/utils/api/accessCodeValidation";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";

// Define a form schema
const formSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  accessCode: z.string().min(1, "Le code d'accès est requis")
});

// Define type for form data
type FormData = z.infer<typeof formSchema>;

export const useDirectivesAccessForm = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(3);
  const [blockedAccess, setBlockedAccess] = useState(false);
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const { verifierCode } = useVerifierCodeAcces();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      accessCode: ""
    }
  });

  const handleSubmit = async () => {
    try {
      await form.handleSubmit(async (formData) => {
        setErrorMessage(null);
        setLoading(true);
        
        try {
          // Validate form data
          if (!validatePublicAccessData(formData)) {
            setLoading(false);
            return;
          }
          
          console.log("Vérification de l'accès public:", formData);
          
          // Verify access code
          const result = await verifierCode(
            formData.accessCode, 
            `directives_public_${formData.firstName}_${formData.lastName}`
          );
          
          if (!result) {
            setErrorMessage("Code d'accès invalide ou informations incorrectes");
            setRemainingAttempts((prev) => prev !== null ? Math.max(0, prev - 1) : 2);
            
            if (remainingAttempts !== null && remainingAttempts <= 1) {
              setBlockedAccess(true);
            }
            
            toast({
              title: "Accès refusé",
              description: "Code d'accès invalide ou informations incorrectes",
              variant: "destructive"
            });
            setLoading(false);
            return;
          }
          
          // Store the dossier and redirect
          setDossierActif(result);
          navigate("/affichage-dossier");
          
          toast({
            title: "Accès autorisé",
            description: "Vous avez accès aux directives anticipées",
          });
          
        } catch (error: any) {
          console.error("Erreur lors de la vérification de l'accès public:", error);
          setErrorMessage("Une erreur est survenue lors de la vérification de votre accès");
          
          toast({
            title: "Erreur d'accès",
            description: "Impossible de vérifier votre accès aux directives",
            variant: "destructive"
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
    handleSubmit,
    errorMessage,
    remainingAttempts,
    blockedAccess
  };
};
