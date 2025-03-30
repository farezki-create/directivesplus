import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/components/pdf/types";
import { 
  uploadPDFToStorage, 
  syncSynthesisToCloud, 
  retrievePDFFromStorage 
} from "@/utils/pdfStorageUtils";

export function usePDFStorage(userId: string | null) {
  const [isTransferringToCloud, setIsTransferringToCloud] = useState(false);
  const [externalDocumentId, setExternalDocumentId] = useState<string | null>(null);
  const { toast } = useToast();

  const saveToExternalStorage = async (pdfDataUrl: string, profile: any) => {
    try {
      if (!userId) {
        toast({
          title: "Erreur",
          description: "Utilisateur non connecté.",
          variant: "destructive",
        });
        return null;
      }

      setIsTransferringToCloud(true);
      
      const externalId = await uploadPDFToStorage(pdfDataUrl, userId, profile);
      
      if (externalId) {
        setExternalDocumentId(externalId);
        
        toast({
          title: "Stockage externe réussi",
          description: `Document sauvegardé avec l'identifiant: ${externalId}`,
        });
      } else {
        toast({
          title: "Erreur de stockage",
          description: "Impossible de sauvegarder le document dans le stockage externe.",
          variant: "destructive",
        });
      }
      
      return externalId;
    } catch (error) {
      console.error("[usePDFStorage] Error in saveToExternalStorage:", error);
      toast({
        title: "Erreur de stockage",
        description: "Impossible de sauvegarder le document dans le stockage externe.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsTransferringToCloud(false);
    }
  };

  const syncToExternalStorage = async (pdfUrl: string | null) => {
    try {
      if (!pdfUrl || !userId) {
        toast({
          title: "Erreur",
          description: "Aucun document PDF à synchroniser ou utilisateur non connecté.",
          variant: "destructive",
        });
        return null;
      }

      setIsTransferringToCloud(true);

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("[usePDFStorage] Error fetching profile:", profileError);
        throw profileError;
      }
      
      // Sync synthesis data
      const success = await syncSynthesisToCloud(userId);
      
      // Upload the PDF
      const externalId = await uploadPDFToStorage(pdfUrl, userId, profile);
      
      if (externalId) {
        toast({
          title: "Synchronisation réussie",
          description: "Vos documents ont été synchronisés avec la base de données cloud.",
        });
      } else {
        toast({
          title: "Erreur de synchronisation",
          description: "Impossible de synchroniser avec la base de données cloud.",
          variant: "destructive",
        });
      }
      
      return externalId;
    } catch (error) {
      console.error("[usePDFStorage] Error in syncToExternalStorage:", error);
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de synchroniser avec la base de données cloud.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsTransferringToCloud(false);
    }
  };

  const retrieveExternalDocument = async (externalId: string) => {
    try {
      if (!externalId.trim()) {
        toast({
          title: "Erreur",
          description: "Identifiant de document non valide.",
          variant: "destructive",
        });
        return null;
      }
      
      const url = await retrievePDFFromStorage(externalId);
      
      if (url) {
        toast({
          title: "Document récupéré",
          description: "Le document a été récupéré avec succès.",
        });
        
        return url;
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer le document.",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error("[usePDFStorage] Error in retrieveExternalDocument:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer le document.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    isTransferringToCloud,
    externalDocumentId,
    saveToExternalStorage,
    syncToExternalStorage,
    retrieveExternalDocument
  };
}
