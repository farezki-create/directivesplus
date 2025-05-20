
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "./FormField";
import FormActions from "./FormActions";
import { useAccessDocumentForm } from "@/hooks/useAccessDocumentForm";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import LoadingState from "@/components/questionnaire/LoadingState";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { toast } from "@/hooks/use-toast";

const DirectivesAccessForm = () => {
  const { 
    form, 
    loading: formLoading, 
    accessDirectives
  } = useAccessDocumentForm();
  
  // État local pour stocker le code d'accès
  const [code, setCode] = useState("");
  
  // Hook personnalisé pour vérifier le code d'accès
  const { verifierCode, loading: verificationLoading, result } = useVerifierCodeAcces();
  
  // État de chargement combiné
  const loading = formLoading || verificationLoading;

  // Utiliser useEffect pour observer les changements dans le champ de code d'accès
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "accessCode") {
        setCode(value.accessCode || "");
        console.log("Code d'accès mis à jour:", value.accessCode);
      }
    });

    // Nettoyer l'abonnement lors du démontage du composant
    return () => subscription.unsubscribe();
  }, [form]);

  // Using useEffect to watch for form errors
  useEffect(() => {
    // Log any form errors when they change
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Erreurs du formulaire:", form.formState.errors);
    }
  }, [form.formState.errors]); // Watch for changes in the errors object
  
  // Observer les résultats de la vérification du code
  useEffect(() => {
    if (result) {
      if (result.success) {
        toast({
          title: "Accès autorisé",
          description: "Le code d'accès est valide. Chargement du dossier...",
        });
      } else {
        toast({
          title: "Accès refusé",
          description: result.error || "Code d'accès invalide",
          variant: "destructive"
        });
      }
    }
  }, [result]);

  const handleAccessDirectives = async () => {
    console.log("Requesting access to directives with code:", code);
    
    // Vérifier si le formulaire est valide
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }
    
    try {
      // Vérifier le code d'accès via la fonction Edge
      const verificationResult = await verifierCode(code);
      
      // Si la vérification est réussie, continuer avec l'accès aux directives
      if (verificationResult.success) {
        // Attendre un moment pour que l'utilisateur voie le toast de succès
        setTimeout(() => {
          accessDirectives();
        }, 1000);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du code:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-directiveplus-700">
        Accès aux directives anticipées
      </h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Accès sans connexion</CardTitle>
          <CardDescription>
            Accédez aux directives anticipées d'un patient à l'aide du code d'accès unique
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <div>
            <CardContent className="space-y-4">
              <FormField 
                id="lastName"
                label="Nom"
                placeholder="Nom de famille"
                control={form.control}
                disabled={loading}
              />
              
              <FormField 
                id="firstName"
                label="Prénom"
                placeholder="Prénom"
                control={form.control}
                disabled={loading}
              />
              
              <FormField 
                id="birthDate"
                label="Date de naissance"
                type="date"
                control={form.control}
                disabled={loading}
              />
              
              <FormField 
                id="accessCode"
                label="Code d'accès"
                placeholder="Code d'accès unique"
                control={form.control}
                disabled={loading}
              />
            </CardContent>

            {/* Indicateur de chargement */}
            <LoadingState loading={loading} message="Vérification en cours..." />

            <CardFooter>
              <div className="w-full">
                <FormActions 
                  loading={loading}
                  onAction={handleAccessDirectives}
                  actionLabel="Accéder aux directives anticipées"
                  actionIcon="file-text"
                />
              </div>
            </CardFooter>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default DirectivesAccessForm;
