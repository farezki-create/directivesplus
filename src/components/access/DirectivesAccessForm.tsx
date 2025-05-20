
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "./FormField";
import FormActions from "./FormActions";
import { useAccessDocumentForm } from "@/hooks/useAccessDocumentForm";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import LoadingState from "@/components/questionnaire/LoadingState";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const DirectivesAccessForm = () => {
  const { 
    form, 
    loading: formLoading, 
    accessDirectives
  } = useAccessDocumentForm();
  
  // État local pour stocker le code d'accès
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Navigation
  const navigate = useNavigate();
  
  // Store pour le dossier actif
  const { setDossierActif } = useDossierStore();
  
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

  // Observer les résultats de la vérification du code
  useEffect(() => {
    if (result) {
      if (result.success) {
        setErrorMessage(null);
        toast({
          title: "Accès autorisé",
          description: "Le code d'accès est valide. Chargement du dossier...",
        });
        
        // Stocker le dossier actif et naviguer vers la page d'affichage
        if (result.dossier) {
          setDossierActif({
            id: result.dossier.id,
            contenu: result.dossier.contenu
          });
          
          // Navigation vers la page d'affichage du dossier
          setTimeout(() => {
            navigate('/affichage-dossier');
          }, 500);
        }
      } else {
        setErrorMessage(result.error || "Code d'accès invalide");
        toast({
          title: "Accès refusé",
          description: result.error || "Code d'accès invalide",
          variant: "destructive"
        });
      }
    }
  }, [result, navigate, setDossierActif]);

  const handleAccessDirectives = async () => {
    console.log("Demande d'accès avec le code:", code);
    setErrorMessage(null);
    
    // Vérifier si le formulaire est valide
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }
    
    try {
      // Vérifier le code d'accès via la fonction Edge
      await verifierCode(code);
      // Le reste de la logique est géré par useEffect qui observe result
    } catch (error) {
      console.error("Erreur lors de la vérification du code:", error);
      setErrorMessage("Une erreur est survenue lors de la vérification du code d'accès");
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

              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}
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
