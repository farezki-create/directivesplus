
import React, { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessCode } from "@/hooks/useAccessCode";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Activity, Download, Share2, Printer } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";

interface AccessCardProps {
  firstName: string;
  lastName: string;
  birthDate: string | null;
}

const AccessCard: React.FC<AccessCardProps> = ({ firstName, lastName, birthDate }) => {
  const { user } = useAuth();
  const directiveCode = useAccessCode(user, "directive");
  const medicalCode = useAccessCode(user, "medical");
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [includeDirective, setIncludeDirective] = useState(true);
  const [includeMedical, setIncludeMedical] = useState(true);
  
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Non renseignée";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (e) {
      return "Non renseignée";
    }
  };
  
  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // Higher resolution
        useCORS: true,
        logging: false
      });
      
      const imageUrl = canvas.toDataURL("image/png");
      
      // Create a link and trigger download
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `carte-access-${lastName.toLowerCase()}-${firstName.toLowerCase()}.png`;
      link.click();
      
      toast({
        title: "Carte téléchargée",
        description: "La carte d'accès a été téléchargée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la génération de la carte:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la carte d'accès",
        variant: "destructive"
      });
    }
  };
  
  const printCard = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        logging: false
      });
      
      const imageUrl = canvas.toDataURL("image/png");
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: "Erreur",
          description: "Impossible d'ouvrir la fenêtre d'impression. Vérifiez les bloqueurs de popup.",
          variant: "destructive"
        });
        return;
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Carte d'accès - ${firstName} ${lastName}</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                text-align: center;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              @media print {
                body {
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            <img src="${imageUrl}" alt="Carte d'accès" />
            <script>
              window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
    } catch (error) {
      console.error("Erreur lors de l'impression de la carte:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer la carte d'accès",
        variant: "destructive"
      });
    }
  };
  
  const shareCard = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imageUrl = canvas.toDataURL("image/png");
      
      // Check if Web Share API is available
      if (navigator.share) {
        const blob = await (await fetch(imageUrl)).blob();
        const file = new File([blob], `carte-access-${lastName.toLowerCase()}-${firstName.toLowerCase()}.png`, { type: "image/png" });
        
        await navigator.share({
          title: "Carte d'accès aux documents médicaux",
          text: "Carte d'accès pour directives anticipées et données médicales",
          files: [file]
        });
      } else {
        // Fallback if Web Share API is not available
        toast({
          title: "Partage non disponible",
          description: "Votre navigateur ne prend pas en charge le partage direct. Utilisez la fonction de téléchargement.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors du partage de la carte:", error);
      toast({
        title: "Erreur",
        description: "Impossible de partager la carte d'accès",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Options de la carte</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="directive"
              checked={includeDirective} 
              onCheckedChange={(checked) => setIncludeDirective(checked === true)}
            />
            <label 
              htmlFor="directive"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Inclure le code pour les directives anticipées
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="medical"
              checked={includeMedical} 
              onCheckedChange={(checked) => setIncludeMedical(checked === true)}
            />
            <label 
              htmlFor="medical"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Inclure le code pour les données médicales
            </label>
          </div>
          
          {!includeDirective && !includeMedical && (
            <p className="text-red-500 text-sm mt-2">Veuillez sélectionner au moins un type de code à inclure</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <div 
          ref={cardRef} 
          className="w-[340px] h-[215px] rounded-xl bg-gradient-to-r from-directiveplus-600 to-directiveplus-700 text-white shadow-lg overflow-hidden"
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">DirectivesPlus</h3>
                <p className="text-xs opacity-75">Carte d'accès personnelle</p>
              </div>
              <img 
                src="/lovable-uploads/41199219-9056-4e5f-bae3-17439ecbb194.png" 
                alt="Logo" 
                className="w-10 h-10 rounded-full bg-white p-1"
              />
            </div>
            
            <div className="mt-6 mb-4">
              <p className="font-semibold uppercase">{lastName} {firstName}</p>
              <p className="text-xs opacity-80">Né(e) le: {formatDate(birthDate)}</p>
            </div>
            
            <div className="grid gap-2">
              {includeDirective && directiveCode && (
                <div className="flex items-center gap-2 bg-white/20 rounded p-1.5">
                  <FileText size={18} className="shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">Directives anticipées:</p>
                    <p className="font-mono font-bold tracking-wider">{directiveCode}</p>
                  </div>
                </div>
              )}
              
              {includeMedical && medicalCode && (
                <div className="flex items-center gap-2 bg-white/20 rounded p-1.5">
                  <Activity size={18} className="shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">Données médicales:</p>
                    <p className="font-mono font-bold tracking-wider">{medicalCode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Button
            onClick={downloadCard}
            variant="outline"
            className="flex items-center gap-2"
            disabled={!includeDirective && !includeMedical}
          >
            <Download size={16} />
            Télécharger
          </Button>
          
          <Button
            onClick={printCard}
            variant="outline"
            className="flex items-center gap-2"
            disabled={!includeDirective && !includeMedical}
          >
            <Printer size={16} />
            Imprimer
          </Button>
          
          {navigator.share && (
            <Button
              onClick={shareCard}
              variant="outline"
              className="flex items-center gap-2"
              disabled={!includeDirective && !includeMedical}
            >
              <Share2 size={16} />
              Partager
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessCard;
