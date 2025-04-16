
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function EmptyDocumentState() {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8 text-gray-500">
      <FileIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <p>Vous n'avez pas encore généré de documents.</p>
      <Button 
        onClick={() => navigate('/generate-pdf')} 
        className="mt-4"
      >
        Générer mes directives
      </Button>
    </div>
  );
}
