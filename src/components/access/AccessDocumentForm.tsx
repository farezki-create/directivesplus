
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "./FormField";
import FormActions from "./FormActions";
import { useAccessDocumentForm } from "@/hooks/useAccessDocumentForm";
import { Form } from "@/components/ui/form";
import { useEffect } from "react";

const AccessDocumentForm = () => {
  const { 
    form, 
    loading, 
    accessDirectives, 
    accessMedicalData 
  } = useAccessDocumentForm();

  // Using useEffect to watch for form errors
  useEffect(() => {
    // Log any form errors when they change
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Erreurs du formulaire:", form.formState.errors);
    }
  }, [form.formState.errors]); // Watch for changes in the errors object

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

        <Form {...form}>
          <form onSubmit={(e) => {
            // Prevent default form submission behavior
            e.preventDefault();
            console.log("Form submit prevented");
          }}>
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
