
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseSpeechRecognitionProps {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

export function useSpeechRecognition({
  language = 'fr-FR',
  continuous = true,
  interimResults = true,
  onResult,
  onEnd,
  onError
}: UseSpeechRecognitionProps = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const { toast } = useToast();
  
  // Utiliser useRef pour stocker l'instance de reconnaissance
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Vérifier la prise en charge du navigateur
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      console.warn('La reconnaissance vocale n\'est pas prise en charge par ce navigateur.');
    }
  }, []);

  // Initialiser la reconnaissance vocale
  const initializeRecognition = useCallback(() => {
    if (!isSupported) return null;
    
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const newTranscript = result[0].transcript;
      
      setTranscript(newTranscript);
      if (onResult) onResult(newTranscript);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      if (onError) onError(event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      if (onEnd) onEnd();
    };
    
    return recognition;
  }, [continuous, interimResults, isSupported, language, onEnd, onError, onResult]);

  // Démarrer l'écoute
  const startListening = useCallback(() => {
    if (!isSupported) {
      toast({
        title: "Non supporté",
        description: "La reconnaissance vocale n'est pas prise en charge par votre navigateur.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (!recognitionRef.current) {
        recognitionRef.current = initializeRecognition();
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript('');
      }
    } catch (error) {
      console.error('Erreur au démarrage de la reconnaissance vocale:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la reconnaissance vocale.",
        variant: "destructive",
      });
    }
  }, [initializeRecognition, isSupported, toast]);

  // Arrêter l'écoute
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  // Nettoyer l'instance lors du démontage
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported
  };
}
