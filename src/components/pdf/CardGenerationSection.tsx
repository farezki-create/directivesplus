
import { UserProfile, TrustedPerson } from "./types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CardGenerateButton } from "./components/CardGenerateButton";
import { CardDownloadButton } from "./components/CardDownloadButton";
import { ShareLinkButton } from "./components/ShareLinkButton";
import { CardInfoMessage } from "./components/CardInfoMessage";
import { AccessLinkDisplay } from "./components/AccessLinkDisplay";
import { CardSectionContainer } from "./components/CardSectionContainer";
import { useCardDownload } from "@/hooks/useCardDownload";
import { AlertTriangle } from "lucide-react";

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
  const { toast } = useToast();
  const { downloadCardPdf, isDownloading, downloadError, hasError } = useCardDownload();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // URL simplifiée pour l'accès aux documents
  const accessUrl = `https://documents.sante.fr/access`;
  
  const handleCopyAccessLink = () => {
    navigator.clipboard.writeText(accessUrl);
    toast({
      title: "Lien copié",
      description: "Le lien d'accès a été copié dans le presse-papier",
    });
  };

  const handleAccessLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Ouvrir dans un nouvel onglet avec tous les attributs de sécurité
    window.open(accessUrl, '_blank', 'noopener,noreferrer');
  };
  
  const handleDirectDownload = async () => {
    setErrorMessage(null);
    
    if (!cardPdfUrl) {
      toast({
        title: "Erreur",
        description: "La carte PDF n'est pas encore générée",
        variant: "destructive"
      });
      return;
    }
    
    console.log("[CardGenerationSection] Démarrage du téléchargement de la carte PDF");
    console.log(`[CardGenerationSection] URL du PDF: ${cardPdfUrl.substring(0, 50)}...`);
    
    try {
      // Utiliser le hook de téléchargement amélioré
      const timestamp = new Date().toISOString().replace(/[:-]/g, '').substring(0, 15);
      const fileName = `carte-directives-${timestamp}.pdf`;
      const success = await downloadCardPdf(cardPdfUrl, fileName);
      
      if (success) {
        console.log("[CardGenerationSection] Téléchargement initié avec succès");
      } else {
        setErrorMessage("Le téléchargement n'a pas pu être effectué. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("[CardGenerationSection] Erreur lors du téléchargement:", error);
      setErrorMessage(`Erreur: ${(error as Error).message}`);
    }
  };
  
  return (
    <CardSectionContainer>
      <div className="flex flex-wrap gap-3 mb-4">
        <CardGenerateButton 
          onGenerate={onGenerate}
          profile={profile}
          trustedPersons={trustedPersons}
          isGenerating={isGenerating}
        />
        
        {cardPdfUrl && (
          <>
            <CardDownloadButton 
              onDownload={handleDirectDownload} 
              isDownloading={isDownloading}
              hasError={hasError}
            />
            <ShareLinkButton onShare={handleCopyAccessLink} />
          </>
        )}
      </div>
      
      {(errorMessage || downloadError) && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-800">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <div className="text-sm space-y-1">
            <p>{errorMessage || downloadError}</p>
            <p className="text-xs italic">Si le problème persiste, essayez de recharger la page et de générer à nouveau la carte.</p>
          </div>
        </div>
      )}
      
      {cardPdfUrl && (
        <>
          <CardInfoMessage cardPdfUrl={cardPdfUrl} />
          <div className="text-sm text-gray-600">
            <AccessLinkDisplay 
              accessUrl={accessUrl}
              onCopy={handleCopyAccessLink}
              onLinkClick={handleAccessLinkClick}
            />
          </div>
        </>
      )}
    </CardSectionContainer>
  );
}
