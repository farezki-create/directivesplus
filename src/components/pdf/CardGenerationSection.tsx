
import { Button } from "@/components/ui/button";
import { CreditCard, FileText, Share2, Link } from "lucide-react";
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
  
  // Fonction de téléchargement améliorée pour garantir un PDF valide qui s'ouvre
  const handleDirectDownload = () => {
    if (cardPdfUrl) {
      try {
        // Vérifier si l'URL est un objet URL
        if (cardPdfUrl.startsWith('blob:')) {
          // Si c'est déjà un blob URL, utiliser directement
          const link = document.createElement('a');
          link.href = cardPdfUrl;
          link.download = 'carte-directives-anticipees.pdf';
          link.type = 'application/pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (cardPdfUrl.startsWith('data:')) {
          // Si c'est une data URL, créer un blob à partir de cette URL
          // Extraire le type MIME correct
          let mimeType = 'application/pdf';
          if (cardPdfUrl.includes(';base64,')) {
            const mimeMatch = cardPdfUrl.match(/^data:([^;]+);/);
            if (mimeMatch && mimeMatch.length > 1) {
              mimeType = mimeMatch[1];
            }
          }
          
          fetch(cardPdfUrl)
            .then(res => res.blob())
            .then(blob => {
              // Créer un blob avec le type MIME correct
              const pdfBlob = new Blob([blob], { type: mimeType });
              const objectUrl = URL.createObjectURL(pdfBlob);
              
              const link = document.createElement('a');
              link.href = objectUrl;
              link.download = 'carte-directives-anticipees.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // Libérer l'URL après téléchargement
              setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
            })
            .catch(err => {
              console.error("Erreur lors de la création du blob:", err);
              toast({
                title: "Erreur",
                description: "Impossible de préparer le PDF pour le téléchargement. Veuillez réessayer.",
                variant: "destructive",
              });
            });
        } else {
          toast({
            title: "Erreur",
            description: "Format de fichier non reconnu. Veuillez régénérer la carte.",
            variant: "destructive",
          });
        }
        
        toast({
          title: "Téléchargement démarré",
          description: "La carte au format PDF est en cours de téléchargement"
        });
        
      } catch (error) {
        console.error("Erreur lors du téléchargement du PDF:", error);
        toast({
          title: "Erreur",
          description: "Impossible de télécharger la carte PDF. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Erreur",
        description: "La carte PDF n'est pas encore générée",
        variant: "destructive"
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
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Génération...
            </span>
          ) : 'Générer la carte'}
        </Button>
        
        {cardPdfUrl && (
          <>
            <Button
              onClick={handleDirectDownload}
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
            <strong>Information:</strong> La carte a été sauvegardée dans votre espace sécurisé et ajoutée à vos documents.
          </p>
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              Cette carte contient les liens vers votre espace documents et directives anticipées.
            </p>
            <div className="flex flex-col md:flex-row md:items-center gap-2 mt-3">
              <span>Lien d'accès:</span>
              <a 
                href={accessUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleAccessLinkClick}
                className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
              >
                {accessUrl} <Link className="h-3 w-3" />
              </a>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopyAccessLink}
                className="h-7 px-2 md:ml-2"
              >
                Copier
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
