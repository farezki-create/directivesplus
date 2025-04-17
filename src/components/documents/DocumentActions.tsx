
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

interface DocumentActionsProps {
  onAddMedicalDocument: () => void;
}

export function DocumentActions({ onAddMedicalDocument }: DocumentActionsProps) {
  return (
    <div className="grid mb-6">
      <Button
        onClick={onAddMedicalDocument}
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
