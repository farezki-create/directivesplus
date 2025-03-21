
import { useCallback, useEffect, useState } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useLanguage } from '@/hooks/useLanguage';

interface UseAIAssistantProps {
  questionText?: string;
  onResponse?: (response: string) => void;
}

export function useAIAssistant({ 
  questionText = "", 
  onResponse 
}: UseAIAssistantProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(questionText);
  const { currentLanguage } = useLanguage();
  const [autoSpeak, setAutoSpeak] = useState(true); // Default to auto-speak enabled

  // Hooks pour la parole
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: isSpeechRecognitionSupported
  } = useSpeechRecognition({
    language: currentLanguage === 'fr' ? 'fr-FR' : 'en-US',
    onResult: (text) => {
      console.log("Transcription:", text);
    }
  });

  const {
    speak,
    cancel,
    isSpeaking,
    isSupported: isSpeechSynthesisSupported
  } = useSpeechSynthesis({
    onEnd: () => console.log("Fin de la parole")
  });

  // Effet pour traiter la transcription
  useEffect(() => {
    if (transcript && !isListening) {
      handleUserMessage(transcript);
    }
  }, [transcript, isListening]);

  // Effet pour mettre à jour la question actuelle
  useEffect(() => {
    setCurrentQuestion(questionText);
  }, [questionText]);

  // Effet pour parler automatiquement lorsqu'un message assistant est ajouté
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && autoSpeak) {
      console.log("Auto-speak triggered for message:", lastMessage.content.substring(0, 50) + "...");
      speak(lastMessage.content);
    }
  }, [messages, autoSpeak, speak]);

  // Fonction pour simuler une réponse de l'IA
  const getAIResponse = useCallback((userMessage: string): string => {
    if (!currentQuestion) {
      return "Je suis votre assistant médical. Comment puis-je vous aider aujourd'hui concernant vos directives anticipées?";
    }

    if (userMessage.toLowerCase().includes("explique") || 
        userMessage.toLowerCase().includes("expliquer") ||
        userMessage.toLowerCase().includes("c'est quoi") ||
        userMessage.toLowerCase().includes("signifie")) {
      return `La question "${currentQuestion}" concerne vos préférences médicales dans le cadre des directives anticipées. Cela vous permet d'exprimer vos souhaits concernant les soins médicaux que vous souhaitez ou ne souhaitez pas recevoir si vous n'êtes plus en mesure de vous exprimer. Votre réponse sera documentée dans vos directives anticipées.`;
    }
    
    if (userMessage.toLowerCase().includes("oui") || 
        userMessage.toLowerCase().includes("d'accord") ||
        userMessage.toLowerCase().includes("je suis pour")) {
      if (onResponse) onResponse("oui");
      return "J'ai enregistré votre réponse affirmative. Souhaitez-vous passer à la question suivante?";
    }
    
    if (userMessage.toLowerCase().includes("non") || 
        userMessage.toLowerCase().includes("pas d'accord") ||
        userMessage.toLowerCase().includes("je suis contre")) {
      if (onResponse) onResponse("non");
      return "J'ai enregistré votre réponse négative. Souhaitez-vous passer à la question suivante?";
    }
    
    return "Je n'ai pas bien compris votre réponse. Pourriez-vous reformuler avec un 'oui' ou un 'non' clair, ou me demander des explications sur la question?";
  }, [currentQuestion, onResponse]);

  // Gérer un message de l'utilisateur
  const handleUserMessage = useCallback((message: string) => {
    const newUserMessage = { role: 'user' as const, content: message };
    setMessages(prev => [...prev, newUserMessage]);
    
    // Arrêter toute parole en cours avant de répondre
    if (isSpeaking) {
      cancel();
    }
    
    // Simuler un délai de réponse pour plus de naturel
    setTimeout(() => {
      const aiResponse = getAIResponse(message);
      const newAIMessage = { role: 'assistant' as const, content: aiResponse };
      setMessages(prev => [...prev, newAIMessage]);
      // La parole sera déclenchée automatiquement via useEffect
    }, 600);
  }, [getAIResponse, cancel, isSpeaking]);

  // Fonction pour initialiser l'assistant avec un message d'accueil
  const initializeAssistant = useCallback(() => {
    if (messages.length === 0) {
      const welcomeMessage = currentQuestion 
        ? `Bonjour, je suis votre assistant médical. Voici la question: ${currentQuestion}. Vous pouvez répondre par oui ou non, ou me demander des explications.`
        : "Bonjour, je suis votre assistant médical. Comment puis-je vous aider avec vos directives anticipées?";
      
      console.log("Initialisation de l'assistant avec le message:", welcomeMessage);
      setMessages([{ role: 'assistant', content: welcomeMessage }]);
      // La parole sera déclenchée automatiquement via useEffect
    }
  }, [currentQuestion, messages.length]);

  // Fonction pour activer/désactiver la parole automatique
  const toggleAutoSpeech = useCallback(() => {
    setAutoSpeak(prev => !prev);
    console.log("Auto-speak toggled to:", !autoSpeak);
  }, [autoSpeak]);

  return {
    messages,
    isListening,
    isSpeaking,
    isSpeechRecognitionSupported,
    transcript,
    currentQuestion,
    autoSpeak,
    startListening,
    stopListening,
    handleUserMessage,
    initializeAssistant,
    speak,
    cancel,
    toggleAutoSpeech
  };
}
