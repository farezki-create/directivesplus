
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "./FormField";
import FormActions from "./FormActions";
import { useDirectivesAccessForm } from "@/hooks/useDirectivesAccessForm";
import { useMedicalDataAccessForm } from "@/hooks/useMedicalDataAccessForm";
import { Form } from "@/components/ui/form";
import { useEffect } from "react";

const AccessDocumentForm = () => {
  const { 
    form: directivesForm, 
    loading: directivesLoading, 
    accessDirectives 
  } = useDirectivesAccessForm();

  const {
    form: medicalForm,
    loading: medicalLoading,
    accessMedicalData
  } = useMedicalDataAccessForm();

  const loading = directivesLoading || medicalLoading;

  // Using useEffect to watch for form errors
  useEffect(() => {
    // Log any form errors when they change
    if (Object.keys(directivesForm.formState.errors).length > 0) {
      console.log("Erreurs du formulaire directives:", directivesForm.formState.errors);
    }

    if (Object.keys(medicalForm.formState.errors).length > 0) {
      console.log("Erreurs du formulaire médical:", medicalForm.formState.errors);
    }
  }, [directivesForm.formState.errors, medicalForm.formState.errors]); // Watch for changes in the errors object

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-directiveplus-700">
        Accès document
      </h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Accès sans connexion</CardTitle>
          <CardDescription>
            Accédez aux directives anticipées ou aux données médicales d'un patient à l'aide du code d'accès unique
          </CardDescription>
        </CardHeader>

        <Form {...directivesForm}>
          <form onSubmit={(e) => {
            e.preventDefault(); // Empêcher la soumission automatique du formulaire
            console.log("Formulaire soumis, mais action empêchée");
            // Ne rien faire ici - les actions sont gérées par les boutons
          }}>
            <CardContent className="space-y-4">
              <FormField 
                id="lastName"
                label="Nom"
                placeholder="Nom de famille"
                control={directivesForm.control}
                disabled={loading}
              />
              
              <FormField 
                id="firstName"
                label="Prénom"
                placeholder="Prénom"
                control={directivesForm.control}
                disabled={loading}
              />
              
              <FormField 
                id="birthDate"
                label="Date de naissance"
                type="date"
                control={directivesForm.control}
                disabled={loading}
              />
              
              <FormField 
                id="accessCode"
                label="Code d'accès"
                placeholder="Code d'accès unique"
                control={directivesForm.control}
                disabled={loading}
              />
            </CardContent>

            <CardFooter>
              <FormActions 
                loading={loading}
                onAccessDirectives={accessDirectives}
                onAccessMedicalData={accessMedicalData}
              />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AccessDocumentForm;
