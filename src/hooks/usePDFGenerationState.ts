
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const waitingMessages = [
  "Préparation de votre document avec soin... 📝",
  "Mise en page de vos directives... 📄",
  "Ajout d'une touche de professionnalisme... ✨",
  "Finalisation des derniers détails... 🎯",
  "Vérification de la mise en forme... 🔍",
  "Assemblage de vos informations... 📋",
  "Plus que quelques secondes... ⏳",
  "Votre document est presque prêt... 🌟",
];

export function usePDFGenerationState() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % waitingMessages.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const startGeneration = () => {
    setIsGenerating(true);
  };

  const finishGeneration = (url: string | null, showDialog: boolean = true) => {
    setPdfUrl(url);
    setIsGenerating(false);
    
    if (!url) {
      toast({
        title: "Erreur",
        description: "Impossible de générer l'aperçu du PDF.",
        variant: "destructive",
      });
      return;
    }
    
    if (showDialog) {
      setTimeout(() => {
        setShowPreview(true);
      }, 300);
    }
  };

  return {
    pdfUrl,
    setPdfUrl,
    showPreview,
    setShowPreview,
    isGenerating,
    currentMessageIndex,
    startGeneration,
    finishGeneration,
    waitingMessages
  };
}
