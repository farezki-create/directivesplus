
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      onClick={() => navigate("/")}
      className="flex items-center gap-2 mb-6"
    >
      <ArrowLeft size={16} />
      Retour à l'accueil
    </Button>
  );
};
