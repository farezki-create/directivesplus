
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "./FormField";
import { Form } from "@/components/ui/form";
import { useDirectivesAccessForm } from "@/hooks/directives-access/useDirectivesAccessForm";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDatabaseConnection } from "@/hooks/access/useDatabaseConnection";
import ConnectionStatusAlert from "./ConnectionStatusAlert";
import TestInfoAlert from "./TestInfoAlert";
import DebugInfoAlert from "./DebugInfoAlert";
import AuthErrorAlert from "./AuthErrorAlert";

const DirectivesAccessForm = () => {
  const { form, loading, errorMessage, accessDirectives } = useDirectivesAccessForm();
  const [showTestInfo, setShowTestInfo] = useState(false);
  const { connectionStatus, debugInfo } = useDatabaseConnection();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Accès aux directives anticipées</CardTitle>
        <CardDescription>
          Accédez aux directives anticipées d'un patient à l'aide du code d'accès unique
        </CardDescription>
      </CardHeader>

      <ConnectionStatusAlert status={connectionStatus} />

      <Form {...form}>
        <form onSubmit={(e) => {
          e.preventDefault();
        }}>
          <CardContent className="space-y-4">
            <AuthErrorAlert errorMessage={errorMessage} />
            
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
            <TestInfoAlert 
              showTestInfo={showTestInfo} 
              connectionStatus={connectionStatus}
              setShowTestInfo={setShowTestInfo}
            />
            
            {/* Debug Info section */}
            <DebugInfoAlert 
              debugInfo={debugInfo}
              showAlert={(connectionStatus === "warning" || connectionStatus === "error" || showTestInfo)}
            />
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
