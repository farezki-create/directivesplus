
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
  // Toujours activé par défaut pour garantir l'animation ludique
  const [usePlayfulTheme, setUsePlayfulTheme] = useState(true);
  const [errorCount, setErrorCount] = useState(0);
  const [timeoutCount, setTimeoutCount] = useState(0);

  // Sélectionne la liste de messages appropriée en fonction du thème
  const messageList = usePlayfulTheme ? funMessages : waitingMessages;

  useEffect(() => {
    let messageInterval: NodeJS.Timeout | null = null;
    let progressInterval: NodeJS.Timeout | null = null;
    let firstSafetyTimeout: NodeJS.Timeout | null = null;
    let secondSafetyTimeout: NodeJS.Timeout | null = null;

    if (isGenerating) {
      // Rotation des messages plus rapide - 800ms pour plus d'animation
      messageInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messageList.length);
      }, 800);

      // Progression plus rapide pour les animations
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          // Progression plus dynamique avec des sauts irréguliers pour donner l'impression de travail
          if (prev < 25) {
            return Math.min(prev + Math.random() * 10, 25); // Démarrage rapide avec variation
          } else if (prev < 50) {
            return Math.min(prev + Math.random() * 7, 50); // Rythme moyen avec variation
          } else if (prev < 75) {
            return Math.min(prev + Math.random() * 3, 75); // Ralentissement avec variation
          } else {
            return Math.min(prev + Math.random() * 1.5, 95); // Très lent à la fin avec variation
          }
        });
      }, 250); // Intervalle plus court pour plus d'animations

      // Premier timeout de sécurité (10 secondes)
      firstSafetyTimeout = setTimeout(() => {
        if (progress < 90) {
          console.log("[PDFGenerationState] Premier timeout de sécurité déclenché");
          setTimeoutCount(prev => prev + 1);
          
          // Si la génération est toujours en cours après 10 secondes, on accélère
          setProgress(90);
        }
      }, 10000);

      // Second timeout de sécurité (20 secondes) - MAXIMUM temps d'attente
      secondSafetyTimeout = setTimeout(() => {
        console.log("[PDFGenerationState] Deuxième timeout de sécurité déclenché");
        setTimeoutCount(prev => prev + 1);
        
        // Si la génération est toujours en cours après 20 secondes, on force la fin
        if (isGenerating && !pdfUrl) {
          console.log("[PDFGenerationState] Force reset génération bloquée");
          setIsGenerating(false);
          setProgress(0);
          setErrorCount(prev => prev + 1);
        }
      }, 20000);

      return () => {
        if (messageInterval) clearInterval(messageInterval);
        if (progressInterval) clearInterval(progressInterval);
        if (firstSafetyTimeout) clearTimeout(firstSafetyTimeout);
        if (secondSafetyTimeout) clearTimeout(secondSafetyTimeout);
      };
    } else {
      // Reset progress and message when not generating
      setProgress(0);
      setCurrentMessageIndex(0);
    }
  }, [isGenerating, messageList.length, progress, pdfUrl]);

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
    errorCount,
    setErrorCount,
    timeoutCount,
    currentWaitingMessage: messageList[currentMessageIndex],
    waitingMessages: messageList,
  };
}
