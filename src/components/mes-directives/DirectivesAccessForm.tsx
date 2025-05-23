
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AccessSharedProfile } from "./AccessSharedProfile";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export const DirectivesAccessForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const hasCodeParam = searchParams.has("code");
  const codeParam = searchParams.get("code");

  // Handle auto verification with code from URL if user is authenticated
  useEffect(() => {
    if (isAuthenticated && hasCodeParam && !isProcessing) {
      setIsProcessing(true);
      // If authenticated, we'll handle this in the parent component
    }
  }, [isAuthenticated, hasCodeParam, navigate, codeParam, isProcessing]);

  const handleFormSubmit = (dossier) => {
    if (dossier) {
      console.log("DirectivesAccessForm - Access successful, navigating to directives-docs");
      navigate("/directives-docs");
    }
  };

  // If the user is already authenticated, show a different message
  const getFormMessage = () => {
    if (isAuthenticated) {
      return "Vous êtes connecté. Vous pouvez accéder à vos directives depuis votre tableau de bord.";
    }
    
    if (hasCodeParam) {
      return "Entrez vos informations pour accéder aux directives avec le code fourni.";
    }
    
    return "Entrez vos informations pour accéder à vos directives médicales";
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">Accéder à vos directives</CardTitle>
      </CardHeader>
      <CardContent>
        {isAuthenticated && hasCodeParam && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <InfoIcon className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Vous êtes connecté et avez fourni un code d'accès. 
              Vous pouvez accéder à vos directives depuis votre tableau de bord ou utiliser ce formulaire.
            </AlertDescription>
          </Alert>
        )}
        <AccessSharedProfile onSuccess={handleFormSubmit} initialCode={codeParam} />
      </CardContent>
      <CardFooter className="text-sm text-center text-muted-foreground">
        {getFormMessage()}
      </CardFooter>
    </Card>
  );
};

export default DirectivesAccessForm;
