
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DocumentActionsProps {
  onAddMedicalDocument?: () => void;
}

export function DocumentActions({ onAddMedicalDocument }: DocumentActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 mb-6">
      <Button
        onClick={() => navigate("/generate-pdf")}
        variant="outline"
        className="w-full flex items-center gap-3 h-auto py-4 transition-all shadow-sm hover:shadow-md hover:bg-purple-50"
      >
        <div className="bg-purple-100 p-2 rounded-full">
          <CreditCard className="h-5 w-5 text-purple-600" />
        </div>
        <div className="text-left">
          <div className="font-medium text-lg">Générer ma carte d'accès</div>
          <div className="text-sm text-muted-foreground">
            Carte format bancaire contenant vos informations essentielles : identité, document ID, signature
          </div>
        </div>
      </Button>
    </div>
  );
}
