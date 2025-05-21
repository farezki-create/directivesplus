
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "./FormField";
import FormActions from "./FormActions";
import { useAccessDocumentForm } from "@/hooks/useAccessDocumentForm";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import LoadingState from "@/components/questionnaire/LoadingState";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { logAccessEvent } from "@/utils/accessLoggingUtils";
import { checkBruteForceAttempt, resetBruteForceCounter } from "@/utils/securityUtils";

const MedicalAccessForm = () => {
  const { 
    form, 
    loading: formLoading, 
    accessMedicalData
  } = useAccessDocumentForm();

  // États locaux
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [blockedAccess, setBlockedAccess] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Using useEffect to watch for form errors
  useEffect(() => {
    // Log any form errors when they change
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Erreurs du formulaire:", form.formState.errors);
    }
  }, [form.formState.errors]); // Watch for changes in the errors object

  const handleAccessMedicalData = async () => {
    // Vérifier si le formulaire est valide
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }
    
    const formData = form.getValues();
    setErrorMessage(null);
    
    // Créer un identifiant pour la protection contre la force brute
    // Basé sur des informations de l'utilisateur
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
      // Accéder aux données médicales
      const result = await accessMedicalData();
      
      if (result && result.success) {
        // Réinitialiser le compteur de force brute en cas de succès
        resetBruteForceCounter(bruteForcePrevention);
        
        // Journaliser l'accès réussi
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
        // Journaliser la tentative échouée
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
      console.error("Erreur lors de l'accès aux données médicales:", error);
      setErrorMessage("Une erreur est survenue lors de la vérification de l'accès");
      
      // Journaliser l'erreur
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

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Accès aux données médicales
      </h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Accès sans connexion</CardTitle>
          <CardDescription>
            Accédez aux données médicales d'un patient à l'aide du code d'accès unique
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

            {/* Loading spinner */}
            <LoadingState loading={loading} message="Vérification en cours..." />

            <CardFooter>
              <div className="w-full">
                <FormActions 
                  loading={loading}
                  onAction={handleAccessMedicalData}
                  actionLabel="Accéder aux données médicales"
                  actionIcon="file-search"
                  buttonColor="bg-blue-600 hover:bg-blue-700"
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

export default MedicalAccessForm;
