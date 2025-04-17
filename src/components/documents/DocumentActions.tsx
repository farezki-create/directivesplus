
import { Button } from "@/components/ui/button";
import { FileText, UploadCloud } from "lucide-react";

interface DocumentActionsProps {
  onAddMedicalDocument: () => void;
}

export function DocumentActions({ onAddMedicalDocument }: DocumentActionsProps) {
  return (
    <div className="grid mb-6">
      <Button
        onClick={onAddMedicalDocument}
        className="flex items-center gap-3 h-auto py-4 bg-primary hover:bg-primary/90 transition-all shadow-md"
      >
        <div className="bg-white/20 p-2 rounded-full">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div className="text-left">
          <div className="font-medium text-lg">Ajouter des documents médicaux</div>
          <div className="text-sm text-primary-foreground/80">Télécharger ou scanner vos documents</div>
        </div>
      </Button>
    </div>
  );
}
