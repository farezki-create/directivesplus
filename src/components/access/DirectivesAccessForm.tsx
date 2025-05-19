
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "./FormField";
import { Form } from "@/components/ui/form";
import { useDirectivesAccessForm } from "@/hooks/useDirectivesAccessForm";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DirectivesAccessForm = () => {
  const { form, loading, errorMessage, accessDirectives } = useDirectivesAccessForm();

  // Using useEffect to watch for form errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Erreurs du formulaire directives:", form.formState.errors);
    }
  }, [form.formState.errors]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Accès aux directives anticipées</CardTitle>
        <CardDescription>
          Accédez aux directives anticipées d'un patient à l'aide du code d'accès unique
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={(e) => {
          e.preventDefault();
        }}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="ml-2">Erreur d'authentification</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
                <AlertDescription className="mt-2 text-xs">
                  Vérifiez que le code correspond bien au format attendu (exemples: G24JKZBH, ABC123DE, DM-81847C2D)
                </AlertDescription>
              </Alert>
            )}
            
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
              placeholder="Code d'accès aux directives"
              control={form.control}
              disabled={loading}
              className="mb-1"
            />
            <p className="text-xs text-gray-500 -mt-3 mb-2">
              Entrez le code d'accès fourni par le patient (exemples: G24JKZBH, DM-81847C2D)
            </p>
          </CardContent>

          <CardFooter>
            <Button 
              className="w-full flex items-center gap-2" 
              onClick={(e) => {
                e.preventDefault();
                accessDirectives();
              }}
              disabled={loading}
              type="button"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FileText size={18} />
              )}
              {loading ? "Vérification en cours..." : "Accéder aux directives anticipées"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default DirectivesAccessForm;
