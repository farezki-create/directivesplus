
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PDFStorageService } from "@/utils/storage/PDFStorageService";

export function useGeneratePDF() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [pdfUrls, setPdfUrls] = useState<{directive: string | null, card: string | null}>({
    directive: null,
    card: null
  });
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<
    "idle" | "generating-directive" | "saving-directive" | "generating-card" | "saving-card" | "complete"
  >("idle");

  // Check authentication
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate("/auth");
      return;
    }
    setUserId(session.user.id);
  };

  // Save PDF to documents
  const saveDocument = async (pdfUrl: string | null, isCard: boolean): Promise<string | null> => {
    if (!pdfUrl || !userId) {
      console.error(`[GeneratePDF] Cannot save ${isCard ? "card" : "directive"}: missing data`);
      toast({
        title: "Erreur",
        description: `Impossible de sauvegarder ${isCard ? "la carte" : "les directives"}. Données manquantes.`,
        variant: "destructive"
      });
      return null;
    }
    
    try {
      console.log(`[GeneratePDF] Saving ${isCard ? "card" : "directive"} to documents...`);
      const documentId = await PDFStorageService.uploadToCloud(pdfUrl, userId, null);
      
      if (documentId) {
        console.log(`[GeneratePDF] Successfully saved ${isCard ? "card" : "directive"} with ID: ${documentId}`);
        toast({
          title: "Sauvegarde réussie",
          description: isCard 
            ? "Votre carte d'accès a été sauvegardée" 
            : "Vos directives anticipées ont été sauvegardées"
        });
        return documentId;
      } else {
        console.error(`[GeneratePDF] Failed to save ${isCard ? "card" : "directive"}`);
        toast({
          title: "Erreur de sauvegarde",
          description: `Impossible de sauvegarder ${isCard ? "la carte" : "les directives"}`,
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error(`[GeneratePDF] Error saving ${isCard ? "card" : "directive"}:`, error);
      toast({
        title: "Erreur de sauvegarde",
        description: `Une erreur est survenue lors de la sauvegarde ${isCard ? "de la carte" : "des directives"}`,
        variant: "destructive"
      });
      return null;
    }
  };

  // Handle the directive PDF generation complete event
  const handleDirectiveGenerated = async (url: string | null) => {
    console.log("[GeneratePDF] Directive generation completed, URL received:", url ? "Yes" : "No");
    
    if (!url) {
      console.error("[GeneratePDF] Directive generation failed - no URL returned");
      toast({
        title: "Erreur",
        description: "La génération des directives anticipées a échoué",
        variant: "destructive"
      });
      setGenerating(false);
      setStage("idle");
      return;
    }
    
    setPdfUrls(prev => ({ ...prev, directive: url }));
    setProgress(50);
    setStage("saving-directive");
    
    const directiveId = await saveDocument(url, false);
    
    if (!directiveId) {
      console.error("[GeneratePDF] Failed to save directive document");
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les directives anticipées",
        variant: "destructive"
      });
      setGenerating(false);
      setStage("idle");
      return;
    }
    
    setProgress(100);
    
    setTimeout(() => {
      toast({
        title: "Génération terminée",
        description: "Vos directives anticipées ont été générées et sauvegardées avec succès"
      });
      setGenerating(false);
      setStage("idle");
    }, 1000);
  };

  // Handle the card PDF generation complete event
  const handleCardGenerated = async (url: string | null) => {
    console.log("[GeneratePDF] Card generation completed, URL received:", url ? "Yes" : "No");
    
    if (!url) {
      console.error("[GeneratePDF] Card generation failed - no URL returned");
      toast({
        title: "Erreur",
        description: "La génération de la carte d'accès a échoué",
        variant: "destructive"
      });
      setGenerating(false);
      setStage("idle");
      return;
    }
    
    setPdfUrls(prev => ({ ...prev, card: url }));
    setProgress(50);
    setStage("saving-card");
    
    const cardId = await saveDocument(url, true);
    
    if (!cardId) {
      console.error("[GeneratePDF] Failed to save card document");
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la carte d'accès",
        variant: "destructive"
      });
      setGenerating(false);
      setStage("idle");
      return;
    }
    
    setProgress(100);
    
    setTimeout(() => {
      console.log("[GeneratePDF] Card generation complete");
      toast({
        title: "Génération terminée",
        description: "Votre carte d'accès a été générée et sauvegardée avec succès"
      });
      setGenerating(false);
      setStage("idle");
    }, 1000);
  };

  // Start directive generation process
  const startDirectiveGeneration = () => {
    if (!userId || generating) return;
    
    console.log("[GeneratePDF] Starting directive generation process");
    setGenerating(true);
    setStage("generating-directive");
    setProgress(25);
  };

  // Start card generation process
  const startCardGeneration = () => {
    if (!userId || generating) return;
    
    console.log("[GeneratePDF] Starting card generation process");
    setGenerating(true);
    setStage("generating-card");
    setProgress(25);
  };

  return {
    userId,
    pdfUrls,
    generating,
    progress,
    stage,
    checkAuth,
    startDirectiveGeneration,
    startCardGeneration,
    handleDirectiveGenerated,
    handleCardGenerated
  };
}
