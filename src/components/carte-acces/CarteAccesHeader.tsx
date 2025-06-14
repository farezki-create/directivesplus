
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CarteAccesHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/rediger")} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Retour
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-directiveplus-800 mb-4">
          Cartes d'Accès
        </h1>
        <p className="text-lg text-gray-600">
          Vos cartes d'accès pour les professionnels de santé
        </p>
      </div>
    </>
  );
};

export default CarteAccesHeader;
