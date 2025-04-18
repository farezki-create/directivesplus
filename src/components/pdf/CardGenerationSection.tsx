
import { Button } from "@/components/ui/button";
import { CreditCard, FileText, Share2 } from "lucide-react";
import { UserProfile, TrustedPerson } from "./types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [showInstructions, setShowInstructions] = useState(false);
  const { toast } = useToast();
  
  const handleCopyAccessLink = () => {
    if (profile?.unique_identifier) {
      const accessUrl = `${window.location.origin}/access`;
      navigator.clipboard.writeText(accessUrl);
      toast({
        title: "Lien copié",
        description: "Le lien d'accès a été copié dans le presse-papier",
      });
    }
  };
  
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-3">Carte format bancaire</h3>
      <p className="text-sm text-gray-500 mb-4">
        Générez une carte au format bancaire contenant vos informations principales et les liens d'accès pour un accès facile à vos directives via Scalingo HDS.
      </p>
      
      <div className="flex flex-wrap gap-3 mb-4">
        <Button 
          onClick={() => profile && onGenerate(profile, trustedPersons)} 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <CreditCard className="h-4 w-4" />
          {isGenerating ? 'Génération...' : 'Générer la carte'}
        </Button>
        
        {cardPdfUrl && (
          <>
            <Button
              onClick={onDownload}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Télécharger la carte
            </Button>
            
            <Button
              onClick={handleCopyAccessLink}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Copier le lien d'accès
            </Button>
          </>
        )}
      </div>
      
      {cardPdfUrl && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Information:</strong> La carte a été sauvegardée dans votre espace sécurisé Scalingo HDS.
          </p>
          <p className="text-sm text-gray-600">
            Cette carte contient les liens vers votre espace documents et directives anticipées. Pour y accéder,
            il suffit de se rendre sur l'URL indiquée sur la carte et de fournir le code d'accès et vos informations personnelles.
          </p>
        </div>
      )}
    </div>
  );
}
