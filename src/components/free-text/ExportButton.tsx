
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
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

  const handleClick = () => {
    navigate("/generate-pdf");
  };

  return (
    <Button 
      onClick={handleClick} 
      className="flex items-center gap-3 h-auto py-4 w-full transition-all"
    >
      <div className="bg-blue-100 p-2 rounded-full">
        <FileText className="h-5 w-5 text-blue-600" />
      </div>
      <div className="text-left">
        <div className="font-medium">Générer Mes directives anticipées et Ma carte d'accès</div>
      </div>
    </Button>
  );
}
