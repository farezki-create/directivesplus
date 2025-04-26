
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

// Playful fun animation theme messages
const funMessages = [
  "Les pixels s'assemblent comme par magie... 🧙‍♂️",
  "Nos petits lutins travaillent pour vous... 🧝",
  "Fabrication d'un document aussi unique que vous... 🌈",
  "Pétrissage du PDF avec amour... ❤️",
  "Un document si beau qu'il ferait pleurer un robot... 🤖",
  "Mélange des encres numériques... 🎨",
  "Pliage des coins virtuels... 📐",
  "Ajout d'un soupçon de bonne humeur... 😊",
  "Le document danse la valse des octets... 💃",
  "Polissage jusqu'à ce que ça brille... ✨",
];

export function usePDFGenerationState() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [documentIdentifier, setDocumentIdentifier] = useState<string | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [usePlayfulTheme, setUsePlayfulTheme] = useState(true);

  // Select the appropriate message list based on theme
  const messageList = usePlayfulTheme ? funMessages : waitingMessages;

  useEffect(() => {
    if (isGenerating) {
      // Message rotation interval
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messageList.length);
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
  }, [isGenerating, messageList.length]);

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
    usePlayfulTheme,
    setUsePlayfulTheme,
    currentWaitingMessage: messageList[currentMessageIndex],
    waitingMessages: messageList,
  };
}
