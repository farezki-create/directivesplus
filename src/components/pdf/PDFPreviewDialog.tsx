
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmailForm } from "./EmailForm";
import { PDFViewer } from "./PDFViewer";
import { Button } from "@/components/ui/button";
import { Lock, Copy, Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { handlePDFDownload } from "./utils/PDFGenerationUtils";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  onEmail?: () => void;
  onSave?: () => void;
  externalDocumentId?: string | null;
}

export function PDFPreviewDialog({
  open,
  onOpenChange,
  pdfUrl,
  externalDocumentId
}: PDFPreviewDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [savingLocation, setSavingLocation] = useState("");

  const handleDownload = () => {
    // Génère un nom de fichier basé sur l'ID du document si disponible
    const customFilename = externalDocumentId 
      ? `directives-anticipees_${externalDocumentId}.pdf` 
      : undefined;
    
    handlePDFDownload(pdfUrl, customFilename);
    
    // Ajoute une information sur l'emplacement de sauvegarde
    setSavingLocation("Le fichier a été téléchargé dans votre dossier de téléchargements.");
  };

  const handleCopyId = () => {
    if (externalDocumentId) {
      navigator.clipboard.writeText(externalDocumentId);
      toast({
        title: "Identifiant copié",
        description: "L'identifiant du document a été copié dans le presse-papier.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[1200px] h-[90vh] max-h-[90vh] flex flex-col p-4">
        <DialogTitle className="text-lg font-semibold mb-2 flex items-center">
          Prévisualisation du document
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Lock className="ml-2 h-4 w-4 text-green-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Méthode de génération protégée</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTitle>
        
        <div className="flex flex-col space-y-3 h-full">
          {externalDocumentId && (
            <div className="flex items-center p-2 bg-gray-100 rounded-md">
              <span className="text-sm font-medium mr-2">Identifiant du document:</span>
              <code className="bg-gray-200 p-1 rounded text-sm">{externalDocumentId}</code>
              <Button variant="ghost" size="sm" onClick={handleCopyId} className="ml-2">
                <Copy className="h-4 w-4" />
              </Button>
              <span className="text-xs text-gray-500 ml-2">
                Conservez cet identifiant pour référence future
              </span>
            </div>
          )}
          
          <div className="flex flex-wrap justify-between gap-2">
            <EmailForm 
              pdfUrl={pdfUrl} 
              onClose={() => onOpenChange(false)} 
            />
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={handleDownload}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger sur mon ordinateur
              </Button>
            </div>
          </div>
          
          {savingLocation && (
            <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded-md">
              <p>{savingLocation}</p>
              <p className="mt-1 text-xs italic">
                Si vous souhaitez sauvegarder le fichier dans un dossier spécifique, vous pouvez le déplacer manuellement après le téléchargement.
              </p>
            </div>
          )}
          
          <div className="flex-1 overflow-hidden">
            <PDFViewer pdfUrl={pdfUrl} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
