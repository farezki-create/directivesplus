
import { Button } from "@/components/ui/button";
import { FileText, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DocumentActionsProps {
  onViewDirectives: () => void;
  onAddMedicalDocument: () => void;
}

export function DocumentActions({ onViewDirectives, onAddMedicalDocument }: DocumentActionsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 mb-6">
      <Button
        onClick={onViewDirectives}
        className="flex items-center gap-2 h-auto py-3"
      >
        <FileText className="h-5 w-5" />
        <div className="text-left">
          <div className="font-medium">Mes directives anticipées</div>
          <div className="text-xs text-muted-foreground">Afficher mon document complet</div>
        </div>
      </Button>
      
      <Button
        onClick={onAddMedicalDocument}
        variant="outline"
        className="flex items-center gap-2 h-auto py-3"
      >
        <UploadCloud className="h-5 w-5" />
        <div className="text-left">
          <div className="font-medium">Ajouter un document médical</div>
          <div className="text-xs text-muted-foreground">Télécharger ou scanner un document</div>
        </div>
      </Button>
    </div>
  );
}
