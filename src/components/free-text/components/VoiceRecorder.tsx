
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onTranscriptReceived: (transcript: string) => void;
}

export const VoiceRecorder = ({ onTranscriptReceived }: VoiceRecorderProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const recognitionInstance = new SpeechRecognitionAPI();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'fr-FR';

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join(' ');
          onTranscriptReceived(transcript);
        };

        recognitionInstance.onerror = (event: SpeechRecognitionEvent) => {
          console.error('[VoiceRecorder] Speech recognition error:', event.error);
          stopListening(recognitionInstance);
          toast({
            title: "Erreur",
            description: "Une erreur est survenue avec la reconnaissance vocale.",
            variant: "destructive",
          });
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, [toast, onTranscriptReceived]);

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
        toast({
          title: "Reconnaissance vocale activée",
          description: "Vous pouvez commencer à parler.",
        });
      } catch (error) {
        console.error('[VoiceRecorder] Error starting speech recognition:', error);
        toast({
          title: "Erreur",
          description: "Impossible de démarrer la reconnaissance vocale.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Non supporté",
        description: "La reconnaissance vocale n'est pas supportée par votre navigateur.",
        variant: "destructive",
      });
    }
  };

  const stopListening = (rec: SpeechRecognition | null = recognition) => {
    if (rec && isListening) {
      rec.stop();
      setIsListening(false);
      toast({
        title: "Reconnaissance vocale désactivée",
        description: "L'enregistrement est terminé.",
      });
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        className="absolute right-2 top-2"
        onClick={isListening ? () => stopListening() : startListening}
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      {isListening && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}
    </>
  );
};
