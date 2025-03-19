
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmailForm } from "./EmailForm";
import { PDFActionButtons } from "./PDFActionButtons";
import { PDFViewer } from "./PDFViewer";
import { Button } from "@/components/ui/button";
import { Construction, Database, Lock, Shield } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePDFGeneration } from "@/hooks/usePDFGeneration";
import { HDSStorageButton } from "./HDSStorageButton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  onEmail?: () => void;
  onSave?: () => void;
}

export function PDFPreviewDialog({
  open,
  onOpenChange,
  pdfUrl,
  onSave,
}: PDFPreviewDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { saveToHDS, isSavingToHDS } = usePDFGeneration(userId, null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    
    getUser();
  }, []);

  const handleDownload = () => {
    if (onSave) {
      onSave();
      onOpenChange(false);
      navigate("/generate-pdf");
    }
  };

  const handleSendToDMP = () => {
    toast({
      title: "En construction",
      description: "Cette fonctionnalité est en cours de développement",
    });
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
          <div className="flex flex-wrap justify-between gap-2">
            <EmailForm 
              pdfUrl={pdfUrl} 
              onClose={() => onOpenChange(false)} 
            />
            <div className="flex flex-wrap gap-2">
              <HDSStorageButton 
                onSave={saveToHDS} 
                disabled={!pdfUrl || !userId || isSavingToHDS}
              />
              
              <Button 
                variant="outline" 
                onClick={handleSendToDMP}
                className="flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                <Construction className="h-4 w-4" />
                <span>Envoyer à votre DMP</span>
              </Button>
              
              <PDFActionButtons 
                onDownload={handleDownload} 
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <PDFViewer pdfUrl={pdfUrl} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
