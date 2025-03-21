
import React, { useCallback, useEffect, useState } from 'react';
import { AIAssistantAvatar } from './AIAssistantAvatar';
import { VoiceRecorder } from './VoiceRecorder';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  MessageCircleQuestion, 
  Mic, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

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
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(questionText);
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();

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
    voices,
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

  // Fonction pour simuler une réponse de l'IA
  // Dans une implémentation réelle, ceci serait remplacé par un appel à une API
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
    
    // Simuler un délai de réponse pour plus de naturel
    setTimeout(() => {
      const aiResponse = getAIResponse(message);
      const newAIMessage = { role: 'assistant' as const, content: aiResponse };
      setMessages(prev => [...prev, newAIMessage]);
      speak(aiResponse);
    }, 600);
  }, [getAIResponse, speak]);

  // Démarrer l'assistant avec un message d'accueil
  useEffect(() => {
    if (active && isOpen && messages.length === 0) {
      const welcomeMessage = currentQuestion 
        ? `Bonjour, je suis votre assistant médical. Voici la question: ${currentQuestion}. Vous pouvez répondre par oui ou non, ou me demander des explications.`
        : "Bonjour, je suis votre assistant médical. Comment puis-je vous aider avec vos directives anticipées?";
      
      setMessages([{ role: 'assistant', content: welcomeMessage }]);
      speak(welcomeMessage);
    }
  }, [active, currentQuestion, isOpen, messages.length, speak]);

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

  if (!active) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            className="rounded-full h-16 w-16 shadow-lg bg-primary hover:bg-primary/90 text-white"
            size="icon"
          >
            <AIAssistantAvatar 
              size="md" 
              isListening={isListening} 
              isSpeaking={isSpeaking} 
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" side="top" align="end">
          <div className="flex flex-col h-[350px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AIAssistantAvatar 
                  size="sm" 
                  isListening={isListening} 
                  isSpeaking={isSpeaking} 
                />
                <h3 className="font-medium">Assistant Médical</h3>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => isSpeaking ? cancel() : speak(currentQuestion || "Comment puis-je vous aider?")}
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {/* Affichage de la question courante */}
            {currentQuestion && (
              <div className="bg-muted p-3 rounded-lg mb-3 text-sm">
                <p className="font-medium mb-1">Question actuelle:</p>
                <p>{currentQuestion}</p>
              </div>
            )}
            
            {/* Zone de conversation */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg ${
                    message.role === 'assistant' 
                      ? 'bg-primary/10 mr-8' 
                      : 'bg-primary text-white ml-8'
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
            
            {/* Contrôles d'interaction */}
            <div className="flex items-center justify-between">
              <Button
                variant={isListening ? "default" : "outline"}
                className={`flex items-center gap-2 ${isListening ? 'animate-pulse bg-green-500 hover:bg-green-600' : ''}`}
                onClick={() => isListening ? stopListening() : startListening()}
                disabled={!isSpeechRecognitionSupported}
              >
                <Mic className="h-4 w-4" />
                {isListening ? 'Écoute...' : 'Parler'}
              </Button>
              
              <VoiceRecorder 
                onRecordingComplete={handleRecordingComplete}
                isDisabled={isListening || isSpeaking}
              />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  handleUserMessage("Explique cette question");
                }}
              >
                <MessageCircleQuestion className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
