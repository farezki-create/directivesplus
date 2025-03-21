
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onRecordingStart?: () => void;
  onRecordingCancel?: () => void;
  isDisabled?: boolean;
}

export function VoiceRecorder({
  onRecordingComplete,
  onRecordingStart,
  onRecordingCancel,
  isDisabled = false
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier si le navigateur prend en charge la reconnaissance vocale
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Non supporté",
        description: "Votre navigateur ne prend pas en charge la reconnaissance vocale.",
        variant: "destructive"
      });
      setHasPermission(false);
    }
  }, [toast]);

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error("Erreur d'accès au microphone:", error);
      toast({
        title: "Accès refusé",
        description: "L'accès au microphone est requis pour cette fonctionnalité.",
        variant: "destructive"
      });
      setHasPermission(false);
      return false;
    }
  };

  const startRecording = async () => {
    // Vérifier ou demander la permission si nécessaire
    if (hasPermission === null) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    } else if (hasPermission === false) {
      toast({
        title: "Accès au microphone requis",
        description: "Veuillez autoriser l'accès au microphone dans les paramètres de votre navigateur.",
        variant: "destructive"
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        setIsRecording(false);
        
        // Arrêter toutes les pistes du flux
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      if (onRecordingStart) onRecordingStart();
      
      toast({
        title: "Enregistrement démarré",
        description: "Parlez maintenant. Cliquez sur le bouton d'arrêt une fois terminé."
      });
    } catch (error) {
      console.error("Erreur lors du démarrage de l'enregistrement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'enregistrement.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      chunksRef.current = [];
      setIsRecording(false);
      if (onRecordingCancel) onRecordingCancel();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!isRecording ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={startRecording}
          disabled={isDisabled || hasPermission === false}
          className="rounded-full h-12 w-12 transition-all hover:bg-primary/10"
          title="Commencer l'enregistrement vocal"
        >
          <Mic className={`h-6 w-6 ${hasPermission === false ? 'text-muted-foreground' : 'text-primary'}`} />
        </Button>
      ) : (
        <>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={stopRecording}
            className="rounded-full h-12 w-12 bg-primary text-white hover:bg-primary/90 animate-pulse"
            title="Arrêter l'enregistrement"
          >
            <StopCircle className="h-6 w-6" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={cancelRecording}
            className="rounded-full h-10 w-10"
            title="Annuler l'enregistrement"
          >
            <MicOff className="h-5 w-5 text-destructive" />
          </Button>
        </>
      )}
    </div>
  );
}
