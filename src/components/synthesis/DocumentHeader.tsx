
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DocumentHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/rediger")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Retour au tableau de bord
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold text-center mb-6">
        Synthèse des Directives Anticipées
      </h1>
    </div>
  );
};
