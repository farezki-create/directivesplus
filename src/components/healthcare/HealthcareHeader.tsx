import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

type HealthcareHeaderProps = {
  isSignUp: boolean;
};

export const HealthcareHeader = ({ isSignUp }: HealthcareHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Accueil
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {isSignUp ? "Inscription Professionnel de Santé" : "Connexion Professionnel de Santé"}
        </h1>
        <p className="text-muted-foreground">
          {isSignUp 
            ? "Créez votre compte professionnel de santé" 
            : "Connectez-vous à votre compte professionnel"}
        </p>
      </div>
    </>
  );
};