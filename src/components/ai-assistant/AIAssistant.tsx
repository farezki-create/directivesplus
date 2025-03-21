
import React, { useEffect, useState } from 'react';
import { AIAssistantAvatar } from './AIAssistantAvatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { AIAssistantHeader } from './AIAssistantHeader';
import { AIConversation } from './AIConversation';
import { AIControls } from './AIControls';

interface AIAssistantProps {
  questionText?: string;
  onResponse?: (response: string) => void;
  active?: boolean;
}

export function AIAssistant({ 
  questionText = "", 
  onResponse,
  active = true
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const {
    messages,
    isListening,
    isSpeaking,
    isSpeechRecognitionSupported,
    transcript,
    currentQuestion,
    startListening,
    stopListening,
    handleUserMessage,
    initializeAssistant,
    speak,
    cancel
  } = useAIAssistant({
    questionText,
    onResponse
  });

  // Démarrer l'assistant avec un message d'accueil
  useEffect(() => {
    if (active && isOpen) {
      initializeAssistant();
    }
  }, [active, isOpen, initializeAssistant]);

  // Gérer l'enregistrement vocal
  const handleRecordingComplete = (audioBlob: Blob) => {
    // Dans une version avancée, on enverrait l'audio à un serveur pour transcription
    // Pour cette version simplifiée, on utilise la transcription locale
    if (transcript) {
      handleUserMessage(transcript);
    } else {
      toast({
        title: "Pas de transcription",
        description: "Aucun texte n'a été détecté dans votre enregistrement.",
        variant: "destructive"
      });
    }
  };

  // Fonction pour demander une explication
  const handleAskExplanation = () => {
    handleUserMessage("Explique cette question");
  };

  // Fonction pour basculer la parole
  const toggleSpeech = () => {
    if (isSpeaking) {
      cancel();
    } else {
      speak(currentQuestion || "Comment puis-je vous aider?");
    }
  };

  if (!active) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            className="rounded-full h-16 w-16 shadow-lg bg-primary hover:bg-primary/90 text-white p-0 overflow-hidden"
            size="icon"
          >
            <AIAssistantAvatar 
              size="lg" 
              isListening={isListening} 
              isSpeaking={isSpeaking} 
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" side="top" align="end">
          <div className="flex flex-col h-[350px]">
            <AIAssistantHeader 
              isSpeaking={isSpeaking}
              isListening={isListening}
              onToggleSpeech={toggleSpeech}
              currentQuestion={currentQuestion}
            />
            
            <AIConversation messages={messages} />
            
            <AIControls 
              isListening={isListening}
              isSpeaking={isSpeaking}
              isSpeechRecognitionSupported={isSpeechRecognitionSupported}
              onStartListening={startListening}
              onStopListening={stopListening}
              onRecordingComplete={handleRecordingComplete}
              onAskExplanation={handleAskExplanation}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
