
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, Mail, Link as LinkIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareDialogProps {
  open: boolean;
  documentId: string;
  onOpenChange: (open: boolean) => void;
}

const ShareDialog = ({ open, documentId, onOpenChange }: ShareDialogProps) => {
  const [shareUrl, setShareUrl] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNativeShareSupported, setIsNativeShareSupported] = useState(false);

  // Vérifier si le navigateur prend en charge l'API Web Share
  useEffect(() => {
    setIsNativeShareSupported(!!navigator.share);
  }, []);

  // Valider l'email
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(shareEmail));
  }, [shareEmail]);

  // Set the share URL when the dialog opens
  useEffect(() => {
    if (open) {
      const baseUrl = window.location.origin;
      const tempShareUrl = `${baseUrl}/partage-document/${documentId}`;
      setShareUrl(tempShareUrl);
    }
  }, [open, documentId]);

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié",
        description: "Le lien de partage a été copié dans le presse-papier"
      });
    } catch (err) {
      console.error("Erreur lors de la copie du lien:", err);
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: "Partage de document DirectivesPlus",
        text: "Consultez ce document sur DirectivesPlus",
        url: shareUrl
      });
      
      toast({
        title: "Partage réussi",
        description: "Le document a été partagé avec succès"
      });
    } catch (err) {
      console.error("Erreur lors du partage:", err);
      if (err.name !== "AbortError") {
        toast({
          title: "Erreur",
          description: "Impossible de partager le document",
          variant: "destructive"
        });
      }
    }
  };

  const sendShareEmail = () => {
    if (!isEmailValid) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive"
      });
      return;
    }

    // Simuler l'envoi d'un email
    toast({
      title: "Invitation envoyée",
      description: `Une invitation a été envoyée à ${shareEmail}`
    });
    setShareEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager le document</DialogTitle>
          <DialogDescription>
            Partagez ce document via un lien ou par email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {isNativeShareSupported && (
            <div className="flex justify-center">
              <Button onClick={handleNativeShare} className="w-full max-w-xs">
                <Share2 size={18} className="mr-2" />
                Partager via votre appareil
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="share-link" className="font-medium">Lien de partage</Label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 flex items-center border rounded-md px-3 py-2 bg-gray-50">
                <LinkIcon size={16} className="text-gray-500 mr-2" />
                <Input
                  id="share-link"
                  value={shareUrl}
                  readOnly
                  className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                />
              </div>
              <Button onClick={copyShareUrl} variant="secondary">
                <Copy size={16} className="mr-1" />
                Copier
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">ou</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="share-email" className="font-medium">Inviter par email</Label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 flex items-center border rounded-md px-3 py-2">
                <Mail size={16} className="text-gray-500 mr-2" />
                <Input
                  id="share-email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                />
              </div>
              <Button 
                onClick={sendShareEmail} 
                disabled={!isEmailValid}
              >
                Envoyer
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
