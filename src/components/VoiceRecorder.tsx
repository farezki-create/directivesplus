
import { useState } from "react";
import { Mic, Stop, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface VoiceRecorderProps {
  section: string;
  className?: string;
}

export function VoiceRecorder({ section, className }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // MediaRecorder instance
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);

  const startRecording = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour utiliser l'enregistrement vocal",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = async () => {
        setIsProcessing(true);
        try {
          // Create a blob from the audio chunks
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          
          // Convert to base64 for storage
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            const base64Data = base64Audio.split(',')[1];
            
            // Save to Supabase
            const fileName = `${user.id}_${section}_${Date.now()}.webm`;
            const { error } = await supabase.storage
              .from('voice-recordings')
              .upload(fileName, decode(base64Data), {
                contentType: 'audio/webm'
              });

            if (error) {
              throw error;
            }
            
            toast({
              title: "Succès",
              description: "Enregistrement vocal sauvegardé avec succès",
            });
          };
        } catch (error) {
          console.error("Error saving voice recording:", error);
          toast({
            title: "Erreur",
            description: "Impossible de sauvegarder l'enregistrement vocal",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
          setAudioChunks([]);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks([]);
      setIsRecording(true);
      
      toast({
        title: "Enregistrement en cours",
        description: "Parlez maintenant...",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      // Stop all tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Helper function to decode base64
  function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  return (
    <Button 
      type="button" 
      variant="ghost" 
      size="sm"
      className={className}
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <Stop className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
