
import { useState, useEffect } from "react";

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
  const [documentIdentifier, setDocumentIdentifier] = useState<string | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      // Message rotation interval
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % waitingMessages.length);
      }, 2000);

      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          // Slow down as we approach 100%
          if (prev >= 90) {
            return Math.min(prev + 0.5, 95);
          }
          return Math.min(prev + 5, 90);
        });
      }, 500);

      return () => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
      };
    } else {
      // Reset progress when not generating
      setProgress(0);
    }
  }, [isGenerating]);

  return {
    pdfUrl,
    setPdfUrl,
    showPreview,
    setShowPreview,
    documentIdentifier,
    setDocumentIdentifier,
    currentMessageIndex,
    isGenerating, 
    setIsGenerating,
    progress, 
    setProgress,
    currentWaitingMessage: waitingMessages[currentMessageIndex],
    waitingMessages,
  };
}
