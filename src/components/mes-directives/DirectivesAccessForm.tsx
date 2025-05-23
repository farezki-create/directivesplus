
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AccessSharedProfile } from "./AccessSharedProfile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const DirectivesAccessForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleFormSubmit = (dossier) => {
    if (dossier) {
      console.log("DirectivesAccessForm - Access successful, navigating to dashboard");
      navigate("/dashboard");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">Accéder à vos directives</CardTitle>
      </CardHeader>
      <CardContent>
        <AccessSharedProfile onSuccess={handleFormSubmit} />
      </CardContent>
      <CardFooter className="text-sm text-center text-muted-foreground">
        {isAuthenticated 
          ? "Vous êtes connecté. Vous pouvez accéder à vos directives depuis votre tableau de bord."
          : "Entrez vos informations pour accéder à vos directives médicales"}
      </CardFooter>
    </Card>
  );
};

export default DirectivesAccessForm;
