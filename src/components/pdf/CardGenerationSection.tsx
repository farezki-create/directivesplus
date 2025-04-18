
import { UserProfile, TrustedPerson } from "./types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CardGenerateButton } from "./components/CardGenerateButton";
import { CardDownloadButton } from "./components/CardDownloadButton";
import { ShareLinkButton } from "./components/ShareLinkButton";
import { CardInfoMessage } from "./components/CardInfoMessage";
import { AccessLinkDisplay } from "./components/AccessLinkDisplay";
import { CardSectionContainer } from "./components/CardSectionContainer";

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
  
  // URL fixe pour l'accès aux documents - mise à jour pour directivesplus.com
  const accessUrl = `https://888b4fe0-9edf-469c-bb32-652a4b2227bb.directivesplus.com/my-documents`;
  
  const handleCopyAccessLink = () => {
    if (profile?.unique_identifier) {
      navigator.clipboard.writeText(accessUrl);
      toast({
        title: "Lien copié",
        description: "Le lien d'accès a été copié dans le presse-papier",
      });
    }
  };

  const handleAccessLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Ouvrir dans un nouvel onglet avec tous les attributs de sécurité
    window.open(accessUrl, '_blank', 'noopener,noreferrer');
  };
  
  // Fonction de téléchargement optimisée pour garantir un PDF valide
  const handleDirectDownload = () => {
    if (!cardPdfUrl) {
      toast({
        title: "Erreur",
        description: "La carte PDF n'est pas encore générée",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Force le téléchargement par fetch puis blob
      fetch(cardPdfUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error("Échec de récupération du PDF");
          }
          return response.blob();
        })
        .then(blob => {
          // Créer un nouvel URL de blob avec le type MIME approprié
          const pdfBlob = new Blob([blob], { type: 'application/pdf' });
          const downloadUrl = URL.createObjectURL(pdfBlob);
          
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'carte-directives-anticipees.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Libérer l'URL après téléchargement
          setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
          
          toast({
            title: "Téléchargement démarré",
            description: "La carte au format PDF est en cours de téléchargement"
          });
        })
        .catch(err => {
          console.error("Erreur lors du téléchargement:", err);
          toast({
            title: "Erreur",
            description: "Impossible de télécharger le PDF. Veuillez réessayer.",
            variant: "destructive"
          });
        });
    } catch (error) {
      console.error("Erreur critique lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter le fichier PDF. Veuillez régénérer la carte.",
        variant: "destructive"
      });
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
            <CardDownloadButton onDownload={handleDirectDownload} />
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
