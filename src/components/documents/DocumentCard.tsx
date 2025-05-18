
import React, { useState } from "react";
import { formatRelativeDate } from "@/utils/dateUtils";
import {
  Download,
  Printer,
  Share2,
  Eye,
  Trash,
  FileText,
  Image,
  File,
  Lock,
  Unlock,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  file_type?: string;
  is_private?: boolean;
}

interface DocumentCardProps {
  document: Document;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, fileType?: string) => void;
  onShare: (documentId: string) => void;
  onView: (filePath: string, fileType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
}

function getDocumentIcon(contentType?: string) {
  if (!contentType) return <File />;
  if (contentType.includes("pdf")) return <FileText />;
  if (contentType.includes("image")) return <Image />;
  return <File />;
}

const DocumentCard = ({
  document,
  onDownload,
  onPrint,
  onShare,
  onView,
  onDelete,
  onVisibilityChange
}: DocumentCardProps) => {
  const formattedDate = formatRelativeDate(document.created_at);
  const documentIcon = getDocumentIcon(document.file_type);
  const [isPrivate, setIsPrivate] = useState(document.is_private || false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareEmail, setShareEmail] = useState("");

  const handleVisibilityChange = (checked: boolean) => {
    setIsPrivate(checked);
    if (onVisibilityChange) {
      onVisibilityChange(document.id, checked);
    }
    toast({
      title: checked ? "Document privé" : "Document visible avec code",
      description: checked 
        ? "Seul vous pouvez accéder à ce document" 
        : "Ce document est accessible avec un code d'accès",
    });
  };

  const handleViewClick = () => {
    onView(document.file_path, document.file_type);
  };

  const handleShareClick = () => {
    // Générer une URL de partage temporaire (exemple)
    const baseUrl = window.location.origin;
    const tempShareUrl = `${baseUrl}/partage-document/${document.id}`;
    setShareUrl(tempShareUrl);
    setShowShareDialog(true);
  };

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

    // Ici, on simulerait l'envoi d'un email
    toast({
      title: "Invitation envoyée",
      description: `Une invitation a été envoyée à ${shareEmail}`
    });
    setShareEmail("");
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
            {documentIcon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{document.file_name}</h3>
            <p className="text-sm text-gray-500">
              {document.description || "Document"} • {formattedDate}
            </p>
            <div className="flex items-center mt-2 gap-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`visibility-${document.id}`}
                  checked={isPrivate}
                  onCheckedChange={handleVisibilityChange}
                />
                <Label htmlFor={`visibility-${document.id}`} className="flex items-center gap-1 text-xs text-gray-600">
                  {isPrivate ? <Lock size={14} /> : <Unlock size={14} />}
                  {isPrivate ? "Document privé" : "Document visible avec code"}
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            onClick={handleViewClick}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            Voir
          </Button>
          <Button
            onClick={() => onDownload(document.file_path, document.file_name)}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            Télécharger
          </Button>
          <Button
            onClick={() => onPrint(document.file_path, document.file_type)}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <Printer className="h-3 w-3 mr-1" />
            Imprimer
          </Button>
          <Button
            onClick={handleShareClick}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <Share2 className="h-3 w-3 mr-1" />
            Partager
          </Button>
          <Button
            onClick={() => onDelete(document.id)}
            size="sm"
            variant="outline"
            className="text-xs text-red-500 hover:text-red-700 hover:border-red-200"
          >
            <Trash className="h-3 w-3 mr-1" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Dialog de partage */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
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
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentCard;
