
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "./FormField";
import { Form } from "@/components/ui/form";
import { useMedicalDataAccessForm } from "@/hooks/useMedicalDataAccessForm";
import { Button } from "@/components/ui/button";
import { FileSearch, Loader2 } from "lucide-react";
import AuthErrorAlert from "./AuthErrorAlert";
import { useDatabaseConnection } from "@/hooks/access/useDatabaseConnection";
import ConnectionStatusAlert from "./ConnectionStatusAlert";
import TestInfoAlert from "./TestInfoAlert";
import { useState } from "react";
import DebugInfoAlert from "./DebugInfoAlert";

const MedicalDataAccessForm = () => {
  const { form, loading, errorMessage, accessMedicalData } = useMedicalDataAccessForm();
  const { connectionStatus, debugInfo } = useDatabaseConnection();
  const [showTestInfo, setShowTestInfo] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Accès aux données médicales</CardTitle>
        <CardDescription>
          Accédez aux données médicales d'un patient à l'aide du code d'accès unique
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
              placeholder="Code d'accès médical"
              control={form.control}
              disabled={loading}
              className="mb-1"
            />
            <p className="text-xs text-gray-500 -mt-3 mb-2">
              Entrez le code d'accès médical fourni par le patient (exemples: G24JKZBH, DM-81847C2D)
            </p>

            <TestInfoAlert 
              showTestInfo={showTestInfo} 
              connectionStatus={connectionStatus}
              setShowTestInfo={setShowTestInfo} 
            />

            <DebugInfoAlert 
              debugInfo={debugInfo} 
              showAlert={showDebugInfo} 
            />

            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-gray-500 p-0 h-auto" 
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              type="button"
            >
              {showDebugInfo ? "Masquer" : "Afficher"} informations de débogage
            </Button>
          </CardContent>

          <CardFooter>
            <Button 
              className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700" 
              onClick={(e) => {
                e.preventDefault();
                accessMedicalData();
              }}
              disabled={loading}
              type="button"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FileSearch size={18} />
              )}
              {loading ? "Vérification en cours..." : "Accéder aux données médicales"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default MedicalDataAccessForm;
