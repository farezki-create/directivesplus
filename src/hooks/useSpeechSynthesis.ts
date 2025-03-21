
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseSpeechSynthesisProps {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useSpeechSynthesis({
  onStart,
  onEnd,
  onError,
  voice = null,
  rate = 1,
  pitch = 1,
  volume = 1
}: UseSpeechSynthesisProps = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const { toast } = useToast();

  // Vérifier la prise en charge du navigateur
  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setIsSupported(false);
      console.warn('La synthèse vocale n\'est pas prise en charge par ce navigateur.');
    }
  }, []);

  // Charger les voix disponibles
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices().filter(v => 
        v.lang.startsWith('fr') // Filtrer les voix françaises
      );
      setVoices(availableVoices);
      
      // Définir une voix française par défaut si disponible
      if (availableVoices.length > 0 && !currentVoice) {
        setCurrentVoice(availableVoices[0]);
      }
    };

    loadVoices();
    
    // Chrome nécessite cet événement pour charger les voix
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [isSupported, currentVoice]);

  // Configurer les gestionnaires d'événements pour la synthèse vocale
  useEffect(() => {
    if (!isSupported) return;

    const handleStart = () => {
      setIsSpeaking(true);
      if (onStart) onStart();
    };

    const handleEnd = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };

    const handleError = (event: any) => {
      console.error('Erreur de synthèse vocale:', event);
      setIsSpeaking(false);
      if (onError) onError(event);
    };

    window.speechSynthesis.addEventListener('start', handleStart);
    window.speechSynthesis.addEventListener('end', handleEnd);
    window.speechSynthesis.addEventListener('error', handleError);

    return () => {
      window.speechSynthesis.removeEventListener('start', handleStart);
      window.speechSynthesis.removeEventListener('end', handleEnd);
      window.speechSynthesis.removeEventListener('error', handleError);
      
      // Arrêter la synthèse vocale lors du démontage
      window.speechSynthesis.cancel();
    };
  }, [isSupported, onEnd, onError, onStart]);

  // Fonction pour parler
  const speak = useCallback((text: string) => {
    if (!isSupported) {
      toast({
        title: "Non supporté",
        description: "La synthèse vocale n'est pas prise en charge par votre navigateur.",
        variant: "destructive",
      });
      return;
    }

    // Annuler toute synthèse en cours
    window.speechSynthesis.cancel();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Appliquer les paramètres
      utterance.voice = voice || currentVoice || null;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      
      // Définir la langue (français)
      utterance.lang = 'fr-FR';

      // Gérer les événements spécifiques à cette utterance
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Erreur d\'utterance:', event);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Erreur lors de la synthèse vocale:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la synthèse vocale.",
        variant: "destructive",
      });
    }
  }, [currentVoice, isSupported, pitch, rate, toast, voice, volume]);

  // Fonction pour arrêter de parler
  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  // Fonction pour changer de voix
  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice);
  }, []);

  return {
    speak,
    cancel,
    isSpeaking,
    isSupported,
    voices,
    currentVoice,
    setVoice
  };
}
