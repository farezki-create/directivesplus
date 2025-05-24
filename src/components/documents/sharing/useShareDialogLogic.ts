
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useSharing } from "@/hooks/sharing/useSharing";
import type { ShareableDocument } from "@/types/sharing";
import { supabase } from "@/integrations/supabase/client";

export const useShareDialogLogic = (document: ShareableDocument, open: boolean) => {
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showCard, setShowCard] = useState(false);
  
  const { 
    generatePersonalCode,
    extendCode,
    regenerateCode,
    isGenerating,
    isExtending,
    isRegenerating
  } = useSharing();

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
    const code = await generatePersonalCode(document, { expiresInDays: 365 });
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
    const success = await extendCode(accessCode, 365);
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
    const newCode = await regenerateCode(accessCode, document, { expiresInDays: 365 });
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

  return {
    accessCode,
    userProfile,
    showCard,
    setShowCard,
    userName,
    isSharing: isGenerating ? document.id : null,
    isExtending,
    isRegenerating,
    handleShareDocument,
    handleExtendCode,
    handleRegenerateCode,
    handleCopyCode,
    resetDialog
  };
};
