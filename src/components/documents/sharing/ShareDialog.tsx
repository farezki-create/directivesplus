
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Check, FolderPlus, Copy, RefreshCw, CreditCard, Clock } from "lucide-react";
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
  const { 
    shareDocument, 
    isSharing, 
    extendAccessCode, 
    regenerateCode,
    isExtending,
    isRegenerating
  } = useUnifiedDocumentSharing();

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (document.user_id) {
        console.log("Récupération profil utilisateur:", document.user_id);
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, birth_date')
          .eq('id', document.user_id)
          .single();
        
        console.log("Profil utilisateur récupéré:", { data, error });
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
    console.log("Partage document:", document);
    const code = await shareDocument(document, { expiresInDays: 365 });
    if (code) {
      console.log("Code généré:", code);
      setAccessCode(code);
    }
  };

  const handleExtendCode = async () => {
    if (!accessCode) {
      toast({
        title: "Erreur", 
        description: "Aucun code d'accès à prolonger",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Prolongation code:", accessCode);
    const success = await extendAccessCode(accessCode, 365);
    if (success) {
      toast({
        title: "Code prolongé",
        description: "Le code d'accès a été prolongé d'1 an supplémentaire"
      });
    }
  };

  const handleRegenerateCode = async () => {
    if (!accessCode) {
      toast({
        title: "Erreur",
        description: "Aucun code d'accès à régénérer", 
        variant: "destructive"
      });
      return;
    }
    
    console.log("Régénération code:", accessCode);
    const newCode = await regenerateCode(accessCode, 365);
    if (newCode) {
      console.log("Nouveau code généré:", newCode);
      setAccessCode(newCode);
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partager le document
          </DialogTitle>
          <DialogDescription>
            Partager ce document et gérer le code d'accès valable 1 an pour les personnes autorisées.
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

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={handleCopyCode}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copier
                    </Button>

                    <Button 
                      onClick={handleRegenerateCode}
                      variant="outline"
                      disabled={isRegenerating}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {isRegenerating ? "Génération..." : "Nouveau code"}
                    </Button>
                  </div>

                  <Button 
                    onClick={handleExtendCode}
                    variant="outline"
                    disabled={isExtending}
                    className="flex items-center gap-2 w-full"
                  >
                    <Clock className="h-4 w-4" />
                    {isExtending ? "Prolongation..." : "Prolonger d'1 an"}
                  </Button>

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
                • Vous pouvez prolonger ou régénérer le code à tout moment<br />
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
