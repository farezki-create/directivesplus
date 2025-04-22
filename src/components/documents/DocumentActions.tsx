
import { Button } from "@/components/ui/button";
import { FileText, UploadCloud, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DocumentActionsProps {
  onAddMedicalDocument: () => void;
}

export function DocumentActions({ onAddMedicalDocument }: DocumentActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 mb-6">
      <Button
        onClick={onAddMedicalDocument}
        className="w-full flex items-center gap-3 h-auto py-4 bg-primary hover:bg-primary/90 transition-all shadow-md"
      >
        <div className="bg-white/20 p-2 rounded-full">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div className="text-left">
          <div className="font-medium text-lg">Ajouter des documents médicaux</div>
          <div className="text-sm text-primary-foreground/80">Télécharger ou scanner vos documents</div>
        </div>
      </Button>

      <Button
        onClick={() => navigate("/generate-pdf")}
        variant="outline"
        className="w-full flex items-center gap-3 h-auto py-4 transition-all shadow-sm"
      >
        <div className="bg-primary/10 p-2 rounded-full">
          <CreditCard className="h-5 w-5 text-primary" />
        </div>
        <div className="text-left">
          <div className="font-medium text-lg">Générer ma double carte d'accès</div>
          <div className="text-sm text-muted-foreground">Carte format bancaire pour un accès facile à vos documents</div>
        </div>
      </Button>
    </div>
  );
}
