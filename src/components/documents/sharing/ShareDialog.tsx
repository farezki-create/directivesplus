
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, Mail, Link as LinkIcon, Hospital, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUnifiedDocumentSharing, ShareableDocument } from "@/hooks/sharing/useUnifiedDocumentSharing";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: ShareableDocument;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onOpenChange,
  document
}) => {
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [expiresInDays, setExpiresInDays] = useState<number>(7);
  const [copied, setCopied] = useState(false);
  const { shareDocument, generateInstitutionCode, isSharing } = useUnifiedDocumentSharing();

  const handleGeneratePublicCode = async () => {
    const code = await shareDocument(document, { expiresInDays });
    if (code) {
      setAccessCode(code);
    }
  };

  const handleGenerateInstitutionCode = async () => {
    const code = await generateInstitutionCode(document, 30);
    if (code) {
      setAccessCode(code);
    }
  };

  const copyToClipboard = async () => {
    if (accessCode) {
      await navigator.clipboard.writeText(accessCode);
      setCopied(true);
      toast({
        title: "Code copié",
        description: "Le code d'accès a été copié dans le presse-papier.",
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const resetDialog = () => {
    setAccessCode(null);
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetDialog();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partager le document
          </DialogTitle>
          <DialogDescription>
            Générez un code d'accès pour permettre à d'autres personnes d'accéder à ce document.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {!accessCode ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="expires">Durée de validité (jours)</Label>
                <Input
                  id="expires"
                  type="number"
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(parseInt(e.target.value) || 7)}
                  min={1}
                  max={365}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleGeneratePublicCode}
                  disabled={isSharing === document.id}
                  className="flex items-center gap-2 flex-1"
                >
                  <LinkIcon className="h-4 w-4" />
                  Code public
                </Button>
                
                <Button 
                  onClick={handleGenerateInstitutionCode}
                  disabled={isSharing === document.id}
                  variant="outline"
                  className="flex items-center gap-2 flex-1"
                >
                  <Hospital className="h-4 w-4" />
                  Code professionnel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Code généré avec succès !</strong><br />
                  Partagez ce code avec la personne autorisée.
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center justify-between p-4 border-2 border-green-200 rounded-lg bg-green-50">
                <span className="font-mono text-xl tracking-[0.2em] font-bold text-green-800">
                  {accessCode}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard}
                  className="text-green-600 hover:text-green-700 hover:bg-green-100"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Durée de validité :</strong> {expiresInDays} jour{expiresInDays > 1 ? 's' : ''}<br />
                  <strong>Document :</strong> {document.file_name}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          {accessCode ? (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Fermer
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
