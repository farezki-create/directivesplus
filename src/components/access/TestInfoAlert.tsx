
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type TestInfoAlertProps = {
  showTestInfo: boolean;
  connectionStatus: string | null;
  setShowTestInfo: (show: boolean) => void;
};

const TestInfoAlert = ({ showTestInfo, connectionStatus, setShowTestInfo }: TestInfoAlertProps) => {
  return (
    <>
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
    </>
  );
};

export default TestInfoAlert;
