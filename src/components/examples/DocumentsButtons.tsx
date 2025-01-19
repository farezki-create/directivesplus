import { Button } from "@/components/ui/button";
import { FileText, User } from "lucide-react";

interface DocumentsButtonsProps {
  onBack: () => void;
  onDirectivesClick: () => void;
  onTrustedPersonClick: () => void;
}

export function DocumentsButtons({ onBack, onDirectivesClick, onTrustedPersonClick }: DocumentsButtonsProps) {
  return (
    <div className="space-y-6">
      <Button 
        onClick={onBack} 
        variant="outline" 
        className="mb-4"
      >
        Retour
      </Button>
      <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
        <Button 
          onClick={onDirectivesClick}
          size="lg"
          className="flex items-center gap-2"
        >
          <FileText className="w-5 h-5" />
          Mes Directives Anticipées
        </Button>
        <Button 
          onClick={onTrustedPersonClick}
          size="lg"
          className="flex items-center gap-2"
        >
          <User className="w-5 h-5" />
          Ma Personne de Confiance
        </Button>
      </div>
    </div>
  );
}