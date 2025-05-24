
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Check, FolderPlus, Copy, RefreshCw, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUnifiedDocumentSharing, type ShareableDocument } from "@/hooks/sharing/useUnifiedDocumentSharing";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AccessCard } from "./AccessCard";
import { supabase } from "@/integrations/supabase/client";

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
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showCard, setShowCard] = useState(false);
  const { shareDocument, isSharing } = useUnifiedDocumentSharing();

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (document.user_id) {
        const { data } = await supabase
          .from('profiles')
          .select('first_name, last_name, birth_date')
          .eq('id', document.user_id)
          .single();
        
        if (data) {
          setUserProfile(data);
        }
      }
    };

    if (open) {
      fetchUserProfile();
    }
  }, [open, document.user_id]);

  const handleShareDocument = async () => {
    const code = await shareDocument(document, { expiresInDays: 365 }); // 1 an par défaut
    if (code) {
      setAccessCode(code);
    }
  };

  const handleRegenerateCode = async () => {
    // Désactiver l'ancien code s'il existe
    if (accessCode) {
      const { error } = await supabase
        .from('shared_documents')
        .update({ is_active: false })
        .eq('access_code', accessCode)
        .eq('document_id', document.id);
      
      if (error) {
        console.error('Erreur lors de la désactivation de l\'ancien code:', error);
      }
    }

    // Générer un nouveau code
    const code = await shareDocument(document, { expiresInDays: 365 });
    if (code) {
      setAccessCode(code);
      toast({
        title: "Code régénéré",
        description: "Un nouveau code d'accès a été généré avec une validité d'1 an"
      });
    }
  };

  const handleCopyCode = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode);
      toast({
        title: "Code copié",
        description: "Le code d'accès a été copié dans le presse-papiers"
      });
    }
  };

  const resetDialog = () => {
    setAccessCode(null);
    setShowCard(false);
  };

  const userName = userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : 'Utilisateur';

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetDialog();
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partager le document
          </DialogTitle>
          <DialogDescription>
            Partager ce document et générer un code d'accès valable 1 an pour les personnes autorisées.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {!accessCode ? (
            <div className="space-y-4">
              <Alert>
                <FolderPlus className="h-4 w-4" />
                <AlertDescription>
                  <strong>Document :</strong> {document.file_name}<br />
                  Un code d'accès unique sera généré avec une validité d'1 an.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleShareDocument}
                disabled={isSharing === document.id}
                className="flex items-center gap-2 w-full"
              >
                <FolderPlus className="h-4 w-4" />
                {isSharing === document.id ? "Partage en cours..." : "Partager le document"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {!showCard ? (
                <>
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Document partagé avec succès !</strong><br />
                      Code d'accès généré : <strong className="font-mono text-lg">{accessCode}</strong><br />
                      <span className="text-sm">Valable pendant 1 an</span>
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCopyCode}
                      variant="outline"
                      className="flex items-center gap-2 flex-1"
                    >
                      <Copy className="h-4 w-4" />
                      Copier le code
                    </Button>

                    <Button 
                      onClick={handleRegenerateCode}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Régénérer
                    </Button>
                  </div>

                  <Button 
                    onClick={() => setShowCard(true)}
                    className="flex items-center gap-2 w-full"
                  >
                    <CreditCard className="h-4 w-4" />
                    Générer la carte d'accès
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-medium mb-4">Carte d'accès personnelle</h3>
                    <AccessCard
                      name={userName}
                      birthDate={userProfile?.birth_date}
                      directivesCode={document.file_type === 'directive' ? accessCode : undefined}
                      medicalCode={document.file_type !== 'directive' ? accessCode : undefined}
                    />
                  </div>

                  <Button 
                    onClick={() => setShowCard(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Retour aux options
                  </Button>
                </div>
              )}

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <strong>Instructions :</strong><br />
                • Partagez ce code uniquement avec les personnes autorisées<br />
                • Le code permet d'accéder au document sans connexion<br />
                • Vous pouvez régénérer un nouveau code à tout moment<br />
                • La carte d'accès peut être imprimée au format carte bancaire
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {accessCode ? "Fermer" : "Annuler"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
