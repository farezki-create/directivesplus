import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDocumentOperations } from "./useDocumentOperations";
import { useDossierDocuments } from "./directives/useDossierDocuments";
import { useSupabaseDocuments } from "./directives/useSupabaseDocuments";
import { ShareableDocument } from "@/hooks/sharing/types";

export interface Document extends ShareableDocument {
  // Hérite de ShareableDocument pour compatibilité complète
}

export const useDirectivesDocuments = () => {
  const { user, isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState<ShareableDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddOptions, setShowAddOptions] = useState(false);
  
  // Ref pour éviter les rechargements multiples
  const isRefreshingRef = useRef(false);

  // Document operations
  const {
    previewDocument,
    setPreviewDocument,
    documentToDelete,
    setDocumentToDelete,
    confirmDelete,
    handleDelete,
    handleDownload,
    handlePrint,
    handleView
  } = useDocumentOperations(() => refreshDocuments());

  // Dossier documents handler
  const { getDossierDocuments, mergeDocuments, dossierActif } = useDossierDocuments();
  
  // Supabase documents handler  
  const { fetchSupabaseDocuments } = useSupabaseDocuments();

  const refreshDocuments = useCallback(async () => {
    // Éviter les rechargements multiples simultanés
    if (isRefreshingRef.current) {
      console.log("useDirectivesDocuments - Refresh déjà en cours, abandon");
      return;
    }

    console.log("=== REFRESH DOCUMENTS START ===");
    isRefreshingRef.current = true;
    setIsLoading(true);
    
    try {
      let allDocuments: ShareableDocument[] = [];
      
      // Si on a un dossier actif, récupérer ses documents
      if (dossierActif) {
        console.log("useDirectivesDocuments - Dossier actif détecté, récupération des documents du dossier");
        const dossierDocuments = getDossierDocuments();
        console.log("useDirectivesDocuments - Documents du dossier récupérés:", dossierDocuments?.length);
        allDocuments = dossierDocuments || [];
      }
      
      // Si on a un utilisateur authentifié, récupérer aussi les documents Supabase
      if (user?.id) {
        console.log("useDirectivesDocuments - Utilisateur authentifié détecté, récupération des documents Supabase");
        const supabaseDocuments = await fetchSupabaseDocuments(user.id);
        console.log("useDirectivesDocuments - Documents Supabase récupérés:", supabaseDocuments?.length);
        
        if (dossierActif) {
          // Fusionner les documents du dossier avec ceux de Supabase
          allDocuments = mergeDocuments(supabaseDocuments);
        } else {
          // Utiliser uniquement les documents Supabase
          allDocuments = supabaseDocuments;
        }
      }
      
      console.log("useDirectivesDocuments - Total documents finaux:", allDocuments?.length);
      
      setDocuments(allDocuments || []);
      
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des documents:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive"
      });
      setDocuments([]);
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
      console.log("=== REFRESH DOCUMENTS END ===");
    }
  }, [user?.id, dossierActif?.id, getDossierDocuments, fetchSupabaseDocuments, mergeDocuments]);

  // Effet principal pour charger les documents - avec dépendances stables
  useEffect(() => {
    console.log("useDirectivesDocuments - useEffect triggered");
    console.log("useDirectivesDocuments - user?.id:", user?.id);
    console.log("useDirectivesDocuments - dossierActif:", !!dossierActif);
    
    // Charger les documents si on a soit un utilisateur, soit un dossier actif
    if (user?.id || dossierActif) {
      refreshDocuments();
    } else {
      console.log("useDirectivesDocuments - Aucune source de données, arrêt du chargement");
      setIsLoading(false);
      setDocuments([]);
    }
  }, [user?.id, dossierActif?.id]); // Dépendances stables

  const handleUploadComplete = useCallback((url: string, fileName: string, isPrivate: boolean) => {
    console.log("Document upload complete, refreshing...");
    refreshDocuments();
    toast({
      title: "Document téléchargé",
      description: `${fileName} a été ajouté avec succès` + (isPrivate ? " (privé)" : "")
    });
  }, [refreshDocuments]);

  const handlePreviewDownload = useCallback((filePath: string) => {
    if (previewDocument) {
      const doc = documents.find(d => d.file_path === filePath);
      if (doc) {
        handleDownload(doc);
      }
    }
  }, [previewDocument, documents, handleDownload]);

  const handlePreviewPrint = useCallback((filePath: string) => {
    if (previewDocument) {
      const doc = documents.find(d => d.file_path === filePath);
      if (doc) {
        handlePrint(doc);
      }
    }
  }, [previewDocument, documents, handlePrint]);

  console.log("useDirectivesDocuments - État final:", {
    documentsCount: documents.length,
    isLoading,
    hasUser: !!user?.id,
    hasDossier: !!dossierActif
  });

  return {
    // Auth state
    user,
    isAuthenticated,
    // Documents
    documents,
    isLoading,
    showAddOptions,
    setShowAddOptions,
    previewDocument,
    setPreviewDocument,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleView,
    confirmDelete,
    handleDelete,
    handleUploadComplete,
    handlePreviewDownload,
    handlePreviewPrint,
    refreshDocuments
  };
};
