
import { Button } from "@/components/ui/button";
import { CreditCard, FileText } from "lucide-react";
import { UserProfile, TrustedPerson } from "./types";

interface CardGenerationSectionProps {
  isGenerating: boolean;
  cardPdfUrl: string | null;
  onGenerate: (profile: UserProfile, trustedPersons: TrustedPerson[]) => void;
  onDownload: () => void;
  profile: UserProfile | null;
  trustedPersons: TrustedPerson[];
}

export function CardGenerationSection({
  isGenerating,
  cardPdfUrl,
  onGenerate,
  onDownload,
  profile,
  trustedPersons
}: CardGenerationSectionProps) {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-3">Carte format bancaire</h3>
      <p className="text-sm text-gray-500 mb-4">
        Générez une carte au format bancaire contenant vos informations principales pour un accès facile à vos directives.
      </p>
      
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={() => profile && onGenerate(profile, trustedPersons)} 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <CreditCard className="h-4 w-4" />
          {isGenerating ? 'Génération...' : 'Générer la carte'}
        </Button>
        
        {cardPdfUrl && (
          <Button
            onClick={onDownload}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Télécharger la carte
          </Button>
        )}
      </div>
    </div>
  );
}
