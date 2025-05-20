
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccessCardHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Retour au tableau de bord
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Carte d'accès</h1>
        <p className="text-gray-600 mt-2">
          Préparez votre carte d'accès pour les professionnels de santé.
        </p>
      </div>
    </>
  );
};

export default AccessCardHeader;
