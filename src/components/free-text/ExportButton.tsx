
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
  
  const handleExport = () => {
    navigate("/generate-pdf", {
      state: { synthesisText: data.synthesis?.free_text }
    });
  };

  return (
    <Button 
      variant="outline" 
      size="default" 
      className="w-full mt-4 flex items-center gap-2" 
      onClick={handleExport}
    >
      <FileText className="h-4 w-4" />
      Générer Mes directives anticipées
    </Button>
  );
}
