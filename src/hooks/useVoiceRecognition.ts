
import { useState, useRef } from 'react';
import { toast } from "@/hooks/use-toast";

export const useVoiceRecognition = (extractedText: string, setExtractedText: (text: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Dictée non supportée",
        description: "Votre navigateur ne supporte pas la dictée vocale",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    recognition.onstart = () => {
      setIsRecording(true);
      toast({
        title: "Dictée activée",
        description: "Parlez maintenant, le texte sera transcrit automatiquement"
      });
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setExtractedText(extractedText + ' ' + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      setIsRecording(false);
      toast({
        title: "Erreur de dictée",
        description: "Erreur lors de la reconnaissance vocale",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    startVoiceRecording,
    stopVoiceRecording
  };
};
