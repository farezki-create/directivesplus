
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
  const { downloadCardPdf, isDownloading } = useCardDownload();
  
  // URL fixe pour l'accès aux documents - mise à jour pour directivesplus.com
  const accessUrl = `https://888b4fe0-9edf-469c-bb32-652a4b2227bb.directivesplus.com/my-documents`;
  
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
  
  const handleDirectDownload = () => {
    if (!cardPdfUrl) {
      toast({
        title: "Erreur",
        description: "La carte PDF n'est pas encore générée",
        variant: "destructive"
      });
      return;
    }
    
    // Utiliser le hook de téléchargement amélioré
    downloadCardPdf(cardPdfUrl, 'carte-directives-anticipees.pdf');
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
            />
            <ShareLinkButton onShare={handleCopyAccessLink} />
          </>
        )}
      </div>
      
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
