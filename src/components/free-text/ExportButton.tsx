
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
        className="flex items-center gap-3 h-auto py-4 w-full transition-all 
        transform hover:scale-[1.02] hover:shadow-lg 
        bg-gradient-to-r from-blue-500 to-blue-600 
        text-white hover:from-blue-600 hover:to-blue-700 
        focus:outline-none focus:ring-2 focus:ring-blue-300 
        rounded-xl duration-300 ease-in-out"
      >
        <div className="bg-white/20 p-2 rounded-full">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div className="text-left flex-grow">
          <div className="font-medium text-sm sm:text-base">
            Générer mes directives anticipées et ma carte d'accès
          </div>
        </div>
      </Button>
    </div>
  );
}
