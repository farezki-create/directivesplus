
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "./FormField";
import FormActions from "./FormActions";
import { useAccessDocumentForm } from "@/hooks/useAccessDocumentForm";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import LoadingState from "@/components/questionnaire/LoadingState";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { logAccessEvent } from "@/utils/accessLoggingUtils";
import { checkBruteForceAttempt } from "@/utils/securityUtils";

const DirectivesAccessForm = () => {
  const { 
    form, 
    loading: formLoading, 
    accessDirectives
  } = useAccessDocumentForm();
  
  // État local pour stocker le code d'accès
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [blockedAccess, setBlockedAccess] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  
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
      }
    });

    // Nettoyer l'abonnement lors du démontage du composant
    return () => subscription.unsubscribe();
  }, [form]);

  // Observer les résultats de la vérification du code
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
        
        // Journaliser l'accès réussi
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
        
        // Stocker le dossier actif et naviguer vers la page d'affichage
        if (result.dossier) {
          setDossierActif({
            id: result.dossier.id,
            contenu: result.dossier.contenu,
            profileData: result.dossier.profileData
          });
          
          // Navigation vers la page d'affichage du dossier
          setTimeout(() => {
            navigate('/affichage-dossier');
          }, 500);
        }
      } else {
        setErrorMessage(result.error || "Code d'accès invalide");
        
        // Journaliser la tentative échouée
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

  const handleAccessDirectives = async () => {
    // Vérifier si le formulaire est valide
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }
    
    const formData = form.getValues();
    setErrorMessage(null);
    
    // Créer un identifiant pour la protection contre la force brute
    const bruteForcePrevention = `directives_${formData.lastName.toLowerCase()}_${formData.birthDate}`;
    
    // Vérifier si l'accès n'est pas bloqué pour cause de trop de tentatives
    const bruteForceCheck = checkBruteForceAttempt(bruteForcePrevention);
    
    if (!bruteForceCheck.allowed) {
      setBlockedAccess(true);
      setErrorMessage(`Trop de tentatives. Veuillez réessayer dans ${Math.ceil((bruteForceCheck.blockExpiresIn || 0) / 60)} minutes.`);
      return;
    }
    
    setRemainingAttempts(bruteForceCheck.remainingAttempts);
    
    try {
      // Afficher des logs pour le débogage
      console.log("Vérification du code d'accès:", code);
      console.log("Données du formulaire:", formData);
      
      // Vérifier le code d'accès via la fonction Edge
      await verifierCode(code, `${formData.lastName.substring(0, 2)}${formData.firstName.substring(0, 2)}`);
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
                disabled={loading || blockedAccess}
              />
              
              <FormField 
                id="firstName"
                label="Prénom"
                placeholder="Prénom"
                control={form.control}
                disabled={loading || blockedAccess}
              />
              
              <FormField 
                id="birthDate"
                label="Date de naissance"
                type="date"
                control={form.control}
                disabled={loading || blockedAccess}
              />
              
              <FormField 
                id="accessCode"
                label="Code d'accès"
                placeholder="Code d'accès unique"
                control={form.control}
                disabled={loading || blockedAccess}
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
              
              {remainingAttempts !== null && remainingAttempts < 3 && !blockedAccess && (
                <Alert variant="default" className="bg-amber-50 border-amber-500">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertTitle className="text-amber-700">Attention</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    {remainingAttempts <= 0 
                      ? "Dernière tentative avant blocage temporaire."
                      : `${remainingAttempts} tentative${remainingAttempts > 1 ? 's' : ''} restante${remainingAttempts > 1 ? 's' : ''} avant blocage temporaire.`
                    }
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
                  isDisabled={blockedAccess}
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
