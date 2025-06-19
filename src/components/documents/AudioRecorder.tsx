
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Upload, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AudioRecorderProps {
  userId: string;
  onRecordingComplete: (url: string, fileName: string) => void;
  saveToDirectives?: boolean; // Nouveau prop pour contrôler où sauver
}

const AudioRecorder = ({ 
  userId, 
  onRecordingComplete, 
  saveToDirectives = true 
}: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Arrêter toutes les pistes audio
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Enregistrement démarré",
        description: "Parlez clairement pour enregistrer vos directives"
      });
    } catch (error: any) {
      console.error("Erreur d'accès au microphone:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Enregistrement terminé",
        description: "Vous pouvez maintenant sauvegarder l'audio"
      });
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob || !userId) return;
    
    setUploading(true);
    
    try {
      const fileName = `directive-audio-${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
      
      // Convertir le blob en base64 data URI
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        // Choisir la table selon le prop saveToDirectives
        const tableName = saveToDirectives ? 'pdf_documents' : 'uploaded_documents';
        
        // Créer un nouvel enregistrement
        const { data, error } = await supabase
          .from(tableName)
          .insert({
            user_id: userId,
            file_name: fileName,
            file_path: base64data, // Stocker directement en base64 data URI
            content_type: 'audio/webm',
            description: 'Directive audio enregistrée le ' + new Date().toLocaleDateString('fr-FR'),
            created_at: new Date().toISOString()
          })
          .select();
        
        if (error) {
          throw error;
        }
        
        onRecordingComplete(base64data, fileName);
        setAudioBlob(null);
        
        toast({
          title: "Audio sauvegardé",
          description: saveToDirectives 
            ? "Votre enregistrement a été sauvegardé dans vos directives"
            : "Votre enregistrement a été sauvegardé avec succès"
        });
      };
    } catch (error: any) {
      console.error("Erreur lors de l'upload audio:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'enregistrement audio",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg mb-6 bg-white">
      <h3 className="font-medium text-lg mb-4">Enregistrer une directive audio</h3>
      
      <div className="flex flex-col space-y-4">
        {audioBlob && (
          <audio className="w-full" controls src={URL.createObjectURL(audioBlob)} />
        )}
        
        <div className="flex flex-wrap gap-2">
          {!isRecording ? (
            <Button 
              onClick={startRecording} 
              disabled={isRecording || uploading}
              className="flex items-center gap-2"
            >
              <Mic size={16} />
              Commencer l'enregistrement
            </Button>
          ) : (
            <Button 
              onClick={stopRecording} 
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Square size={16} />
              Arrêter l'enregistrement
            </Button>
          )}
          
          {audioBlob && !isRecording && (
            <Button 
              onClick={uploadAudio}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              {uploading ? (
                <>Sauvegarde en cours...</>
              ) : (
                <>
                  <Upload size={16} /> 
                  Sauvegarder l'enregistrement
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;
