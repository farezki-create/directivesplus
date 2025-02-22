
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface FreeTextInputProps {
  userId: string;
}

export const FreeTextInput = ({ userId }: FreeTextInputProps) => {
  const [freeText, setFreeText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si la reconnaissance vocale est disponible
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'fr-FR';

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        setFreeText(prev => prev + ' ' + transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('[FreeTextInput] Speech recognition error:', event.error);
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
  }, [toast]);

  useEffect(() => {
    const loadFreeText = async () => {
      try {
        console.log("[FreeTextInput] Loading existing free text for userId:", userId);
        const { data, error } = await supabase
          .from('questionnaire_synthesis')
          .select('free_text')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error("[FreeTextInput] Error loading free text:", error);
          throw error;
        }

        if (data?.free_text) {
          console.log("[FreeTextInput] Loaded existing free text");
          setFreeText(data.free_text);
        } else {
          console.log("[FreeTextInput] No existing free text found");
        }
      } catch (error) {
        console.error("[FreeTextInput] Error loading free text:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre texte libre existant.",
          variant: "destructive",
        });
      }
    };

    if (userId) {
      loadFreeText();
    }
  }, [userId, toast]);

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
        console.error('[FreeTextInput] Error starting speech recognition:', error);
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

  const saveFreeText = async () => {
    try {
      console.log("[FreeTextInput] Saving free text");
      const { error } = await supabase
        .from('questionnaire_synthesis')
        .upsert(
          {
            user_id: userId,
            free_text: freeText
          },
          {
            onConflict: 'user_id'
          }
        );

      if (error) {
        console.error("[FreeTextInput] Error saving free text:", error);
        throw error;
      }

      console.log("[FreeTextInput] Free text saved successfully");
      toast({
        title: "Succès",
        description: "Votre texte libre a été enregistré avec succès.",
      });
      
      navigate("/generate-pdf");
    } catch (error) {
      console.error("[FreeTextInput] Error saving free text:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre texte libre.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Texte libre</h3>
      <div className="relative">
        <Textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          className="min-h-[100px] border-dotted pr-12"
          placeholder="Écrivez ou dictez votre texte libre ici..."
        />
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
      </div>
      <div className="flex gap-2 items-center">
        <Button onClick={saveFreeText}>Enregistrer</Button>
        {isListening && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
};
