
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
  // Set default to true to enable playful theme by default
  const [usePlayfulTheme, setUsePlayfulTheme] = useState(true);

  // Select the appropriate message list based on theme
  const messageList = usePlayfulTheme ? funMessages : waitingMessages;

  useEffect(() => {
    if (isGenerating) {
      // Message rotation interval - faster for more animation
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messageList.length);
      }, 1500); // Reduced from 2000 to 1500ms for more animation

      // Progress bar animation with timeout safety
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          // Slow down as we approach 100%, but ensure we reach at least 95%
          if (prev >= 90) {
            return Math.min(prev + 0.5, 95);
          }
          return Math.min(prev + 5, 90);
        });
      }, 400); // Slightly faster progress updates (was 500ms)

      // Safety timeout to ensure process doesn't appear stuck
      const safetyTimeout = setTimeout(() => {
        if (progress < 95) {
          console.log("Safety timeout triggered, ensuring progress continues");
          setProgress(95); // Force progress to near completion if stuck
        }
      }, 15000); // 15 seconds safety

      return () => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
        clearTimeout(safetyTimeout);
      };
    } else {
      // Reset progress when not generating
      setProgress(0);
      setCurrentMessageIndex(0);
    }
  }, [isGenerating, messageList.length, progress]);

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
