
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface DocumentLoadErrorAlertProps {
  errorMessage: string | null;
  isAuthenticated: boolean;
  user: any;
}

const DocumentLoadErrorAlert: React.FC<DocumentLoadErrorAlertProps> = ({
  errorMessage,
  isAuthenticated,
  user
}) => {
  const navigate = useNavigate();
  
  if (!errorMessage) return null;
  
  const handleRetryDocumentLoad = () => {
    if (isAuthenticated && user) {
      toast({
        title: "Nouvelle tentative",
        description: "Tentative de rechargement du document..."
      });
      
      // Force a reload of the current page to restart the flow
      window.location.reload();
    } else {
      // For non-authenticated users, just navigate back
      navigate('/mes-directives');
    }
  };
  
  return (
    <div className="container max-w-3xl py-4">
      <Alert variant="destructive">
        <AlertTitle>Erreur de chargement du document</AlertTitle>
        <AlertDescription>
          {errorMessage}
          <div className="mt-2">
            <button 
              onClick={handleRetryDocumentLoad}
              className="text-white bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm"
            >
              Réessayer
            </button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DocumentLoadErrorAlert;
