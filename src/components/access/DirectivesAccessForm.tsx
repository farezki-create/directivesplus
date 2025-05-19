
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "./FormField";
import { Form } from "@/components/ui/form";
import { useDirectivesAccessForm } from "@/hooks/useDirectivesAccessForm";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Database, FileText, Info, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const DirectivesAccessForm = () => {
  const { form, loading, errorMessage, accessDirectives } = useDirectivesAccessForm();
  const [showTestInfo, setShowTestInfo] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Using useEffect to watch for form errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Erreurs du formulaire directives:", form.formState.errors);
    }
  }, [form.formState.errors]);

  // Check database connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple test query to check if Supabase is responsive
        const { data, error } = await supabase.from('profiles').select('id').limit(1);
        
        if (error) {
          console.error("Erreur de connexion à la base de données:", error);
          setConnectionStatus("error");
          setDebugInfo(error);
        } else if (data && data.length > 0) {
          console.log("Connexion à la base de données réussie, profil trouvé:", data);
          setConnectionStatus("success");
          setDebugInfo({
            profileFound: true,
            profileId: data[0].id
          });
        } else {
          console.log("Connexion à la base de données réussie, mais aucun profil trouvé");
          setConnectionStatus("warning");
          setDebugInfo({
            profileFound: false,
            message: "Aucun profil n'existe dans la base de données"
          });
        }
      } catch (err) {
        console.error("Exception lors de la vérification de connexion:", err);
        setConnectionStatus("error");
        setDebugInfo(err);
      }
    };
    
    checkConnection();
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Accès aux directives anticipées</CardTitle>
        <CardDescription>
          Accédez aux directives anticipées d'un patient à l'aide du code d'accès unique
        </CardDescription>
      </CardHeader>

      {connectionStatus === "error" && (
        <Alert variant="destructive" className="mx-6 mb-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="ml-2">Problème de connexion</AlertTitle>
          <AlertDescription>
            Impossible de se connecter à la base de données. Veuillez réessayer plus tard ou contacter le support.
          </AlertDescription>
        </Alert>
      )}

      {connectionStatus === "warning" && (
        <Alert variant="default" className="mx-6 mb-2 bg-amber-50 border-amber-200">
          <Database className="h-4 w-4" />
          <AlertTitle className="ml-2">Avertissement</AlertTitle>
          <AlertDescription>
            Connecté à la base de données, mais aucun profil utilisateur n'est disponible.
          </AlertDescription>
        </Alert>
      )}

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
            
            {/* Information mode test */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-gray-500 p-0 h-auto" 
              onClick={() => setShowTestInfo(!showTestInfo)}
              type="button"
            >
              <Info className="h-3 w-3 mr-1" />
              Mode test / débogage
            </Button>
            
            {showTestInfo && (
              <Alert variant="default" className="bg-blue-50 text-xs mt-2">
                <AlertDescription>
                  Pour tester l'accès, vous pouvez utiliser le code "TEST" ou "DEMO". 
                  Ces codes de débogage permettent d'accéder à la plateforme sans vérification stricte.
                  {connectionStatus === "warning" && (
                    <p className="mt-2 text-orange-600 font-semibold">
                      Attention: Aucun profil n'existe dans la base de données, les codes test ne fonctionneront pas.
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Debug Info section */}
            {(connectionStatus === "warning" || connectionStatus === "error") && showTestInfo && (
              <Alert variant="default" className="bg-gray-100 text-xs mt-2">
                <AlertTitle>Informations de débogage</AlertTitle>
                <AlertDescription>
                  <pre className="text-xs overflow-auto max-h-32 p-2 bg-gray-200 rounded">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter>
            <Button 
              className="w-full flex items-center gap-2" 
              onClick={(e) => {
                e.preventDefault();
                accessDirectives();
              }}
              disabled={loading || connectionStatus === "error"}
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
