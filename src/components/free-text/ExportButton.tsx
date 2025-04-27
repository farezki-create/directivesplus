
import { Button } from "@/components/ui/button";
import { FileText, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExportButtonProps {
  data: {
    responses: {
      general: any[];
      lifeSupport: any[];
      advancedIllness: any[];
      preferences: any[];
    };
    synthesis?: {
      free_text: string;
    } | null;
    userId: string;
  };
}

export function ExportButton({ data }: ExportButtonProps) {
  const navigate = useNavigate();

  const handleDirectivesClick = () => {
    navigate("/generate-pdf");
  };

  const handleCardClick = () => {
    navigate("/generate-pdf?format=card");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Button 
        onClick={handleDirectivesClick} 
        className="flex items-center gap-3 h-auto py-4 w-full transition-all"
      >
        <div className="bg-blue-100 p-2 rounded-full">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div className="text-left">
          <div className="font-medium">Générer Mes directives anticipées</div>
        </div>
      </Button>

      <Button 
        onClick={handleCardClick}

        className="flex items-center gap-3 h-auto py-4 w-full transition-all"
      >
        <div className="bg-green-100 p-2 rounded-full">
          <CreditCard className="h-5 w-5 text-green-600" />
        </div>
        <div className="text-left">
          <div className="font-medium">Générer Ma carte d'accès</div>
        </div>
      </Button>
    </div>
  );
}
