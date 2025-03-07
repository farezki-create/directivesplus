import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type AuthHeaderProps = {
  isSignUp: boolean;
};

export const AuthHeader = ({ isSignUp }: AuthHeaderProps) => {
  const navigate = useNavigate();
  
  if (!isSignUp) return null;
  
  return (
    <Button
      variant="ghost"
      className="absolute top-4 left-4 gap-2"
      onClick={() => navigate("/")}
    >
      <ArrowLeft className="h-4 w-4" />
      Retour à l'accueil
    </Button>
  );
};