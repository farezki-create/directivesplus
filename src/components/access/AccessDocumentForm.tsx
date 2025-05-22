
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "./FormField";
import FormActions from "./FormActions";
import { useAccessDocumentForm } from "@/hooks/useAccessDocumentForm";
import { Form } from "@/components/ui/form";
import { useEffect } from "react";
import LoadingState from "@/components/questionnaire/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const AccessDocumentForm = () => {
  const { 
    form, 
    loading, 
    accessDirectives, 
    accessMedicalData 
  } = useAccessDocumentForm();
  
  const { isAuthenticated, user } = useAuth();

  // Using useEffect to watch for form errors
  useEffect(() => {
    // Log any form errors when they change
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Erreurs du formulaire:", form.formState.errors);
    }
  }, [form.formState.errors]); // Watch for changes in the errors object

  // Create completely isolated handlers at this level too
  const handleAccessDirectives = () => {
    console.log("Requesting access to directives");
    accessDirectives();
  };
  
  const handleAccessMedicalData = () => {
    console.log("Requesting access to medical data");
    accessMedicalData();
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-directiveplus-700">
        Accès document
      </h1>
      
      {isAuthenticated && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <InfoIcon className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Vous êtes connecté en tant que {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}. 
            En tant qu'utilisateur authentifié, vous pouvez accéder directement à vos documents sans saisir de code d'accès.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Accès sans connexion</CardTitle>
          <CardDescription>
            Accédez aux directives anticipées ou aux données médicales d'un patient à l'aide du code d'accès unique
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          {/* 
            Important: Use a div instead of a form element to prevent any form submission.
            The button handlers will manage the validation and submission.
          */}
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

            {/* Loading spinner */}
            <LoadingState loading={loading} />

            <CardFooter>
              <FormActions 
                loading={loading}
                onAccessDirectives={handleAccessDirectives}
                onAccessMedicalData={handleAccessMedicalData}
              />
            </CardFooter>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AccessDocumentForm;
