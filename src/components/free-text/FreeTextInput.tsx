
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { Save } from "lucide-react";
import { SignatureComponent } from "./SignatureComponent";

interface FreeTextInputProps {
  userId: string;
  onSaveComplete?: () => void;
  onSignComplete?: () => void;
}

export function FreeTextInput({ userId, onSaveComplete, onSignComplete }: FreeTextInputProps) {
  const [freeText, setFreeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialText, setInitialText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Fetch existing free text when component mounts
  useEffect(() => {
    const fetchFreeText = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("questionnaire_synthesis")
          .select("free_text, signature")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching free text:", error);
          return;
        }

        if (data) {
          setFreeText(data.free_text || "");
          setInitialText(data.free_text || "");
          if (data.signature) {
            setSignature(data.signature);
            setIsSaved(true);
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFreeText();
    }
  }, [userId]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Check if a record already exists
      const { data, error: fetchError } = await supabase
        .from("questionnaire_synthesis")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking for existing synthesis:", fetchError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification des données existantes.",
          variant: "destructive",
        });
        return;
      }

      let error;
      
      if (data) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("questionnaire_synthesis")
          .update({
            free_text: freeText,
          })
          .eq("id", data.id);
          
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("questionnaire_synthesis")
          .insert({
            user_id: userId,
            free_text: freeText,
          });
          
        error = insertError;
      }

      if (error) {
        console.error("Error saving free text:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre texte. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      setInitialText(freeText);
      setIsSaved(true);
      toast({
        title: "Succès",
        description: "Vos directives anticipées ont été enregistrées.",
      });
      
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureSaved = (signatureData: string) => {
    setSignature(signatureData);
    if (onSignComplete) {
      onSignComplete();
    }
  };

  const hasChanges = freeText !== initialText;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('synthesisTitle')}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {t('synthesisDescription')}
        </p>
      </div>
      
      <Textarea
        value={freeText}
        onChange={(e) => setFreeText(e.target.value)}
        placeholder={t('writeSynthesis')}
        className="min-h-[200px]"
      />
      
      {/* Step 1: Save Content */}
      <Button
        onClick={handleSubmit}
        disabled={loading || !hasChanges}
        className="w-full"
      >
        <Save className="mr-2 h-4 w-4" />
        Enregistrer mes directives anticipées
      </Button>
      
      {/* Step 2: Show Signature Section after saving */}
      {isSaved && (
        <SignatureComponent 
          userId={userId} 
          existingSignature={signature}
          onSignatureSaved={handleSignatureSaved}
        />
      )}
    </div>
  );
}
