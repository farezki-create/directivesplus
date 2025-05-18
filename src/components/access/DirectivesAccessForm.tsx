
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "./FormField";
import { Form } from "@/components/ui/form";
import { useDirectivesAccessForm } from "@/hooks/useDirectivesAccessForm";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useEffect } from "react";

const DirectivesAccessForm = () => {
  const { form, loading, accessDirectives } = useDirectivesAccessForm();

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
            />
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
              <FileText size={18} />
              {loading ? "Vérification en cours..." : "Accéder aux directives anticipées"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default DirectivesAccessForm;
