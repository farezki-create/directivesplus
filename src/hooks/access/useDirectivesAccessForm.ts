
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { useDirectivesStore } from "@/store/directivesStore";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  lastName: z.string().min(1, "Le nom est requis"),
  firstName: z.string().min(1, "Le prénom est requis"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  accessCode: z.string().min(6, "Le code d'accès doit contenir au moins 6 caractères"),
});

type FormData = z.infer<typeof formSchema>;

export const useDirectivesAccessForm = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [blockedAccess, setBlockedAccess] = useState(false);
  
  const { verifierCode } = useVerifierCodeAcces();
  const { setDocuments } = useDirectivesStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      birthDate: "",
      accessCode: ""
    }
  });

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const values = form.getValues();
      console.log("Tentative de vérification du code d'accès:", values);
      
      const bruteForceIdentifier = `directives_public_${values.firstName}_${values.lastName}`;
      
      const result = await verifierCode(values.accessCode, bruteForceIdentifier);
      
      if (result) {
        console.log("Code d'accès vérifié avec succès:", result);
        
        if (result.contenu?.documents) {
          setDocuments(result.contenu.documents);
        }
        
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux directives anticipées",
        });
        
        window.location.href = '/directives-docs';
      } else {
        console.log("Échec de la vérification du code d'accès");
        setErrorMessage("Code d'accès invalide ou expiré. Vérifiez vos informations.");
      }
      
    } catch (error) {
      console.error("Erreur lors de la vérification du code d'accès:", error);
      setErrorMessage("Une erreur est survenue lors de la vérification. Réessayez.");
      
      toast({
        title: "Erreur d'accès",
        description: "Impossible de vérifier votre accès aux directives",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    setLoading,
    handleSubmit,
    errorMessage,
    remainingAttempts,
    blockedAccess
  };
};
