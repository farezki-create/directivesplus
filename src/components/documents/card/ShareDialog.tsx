
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Share2, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareDialogProps {
  open: boolean;
  documentId: string;
  onOpenChange: (open: boolean) => void;
}

const ShareDialog = ({ open, documentId, onOpenChange }: ShareDialogProps) => {
  const [shareUrl, setShareUrl] = useState("");
  const [shareEmail, setShareEmail] = useState("");

  // Set the share URL when the dialog opens
  React.useEffect(() => {
    if (open) {
      const baseUrl = window.location.origin;
      const tempShareUrl = `${baseUrl}/partage-document/${documentId}`;
      setShareUrl(tempShareUrl);
    }
  }, [open, documentId]);

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        toast({
          title: "Lien copié",
          description: "Le lien de partage a été copié dans le presse-papier"
        });
      },
      () => {
        toast({
          title: "Erreur",
          description: "Impossible de copier le lien",
          variant: "destructive"
        });
      }
    );
  };

  const sendShareEmail = () => {
    if (!shareEmail) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer une adresse email",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending an email
    toast({
      title: "Invitation envoyée",
      description: `Une invitation a été envoyée à ${shareEmail}`
    });
    setShareEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Partager le document</DialogTitle>
          <DialogDescription>
            Partagez ce document en copiant le lien ou en envoyant une invitation par email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="share-link">Lien de partage</Label>
            <div className="flex items-center space-x-2">
              <input
                id="share-link"
                value={shareUrl}
                readOnly
                className="flex-1 p-2 border rounded text-sm bg-gray-50"
              />
              <Button size="sm" onClick={copyShareUrl} variant="outline">
                <Copy size={16} className="mr-1" />
                Copier
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="share-email">Inviter par email</Label>
            <div className="flex items-center space-x-2">
              <input
                id="share-email"
                type="email"
                placeholder="exemple@email.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="flex-1 p-2 border rounded text-sm"
              />
              <Button size="sm" onClick={sendShareEmail}>
                <Share2 size={16} className="mr-1" />
                Envoyer
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
