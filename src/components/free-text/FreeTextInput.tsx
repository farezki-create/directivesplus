
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { Save } from "lucide-react";
import { SignatureComponent } from "./SignatureComponent";
import { TextEditor } from "./TextEditor";

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
      if (!userId) return;
      
      try {
        setLoading(true);
        console.log("[FreeTextInput] Fetching existing text for user:", userId);
        
        const { data, error } = await supabase
          .from("questionnaire_synthesis")
          .select("free_text, signature")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) {
          console.error("[FreeTextInput] Error fetching free text:", error);
          return;
        }

        if (data) {
          console.log("[FreeTextInput] Found existing text:", data.free_text ? "Yes (length: " + data.free_text.length + ")" : "No");
          setFreeText(data.free_text || "");
          setInitialText(data.free_text || "");
          if (data.signature) {
            setSignature(data.signature);
            setIsSaved(true);
          }
        } else {
          console.log("[FreeTextInput] No existing text found");
        }
      } catch (error) {
        console.error("[FreeTextInput] Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreeText();
  }, [userId]);

  const handleTextChange = (newText: string) => {
    console.log("[FreeTextInput] Text changed, new length:", newText.length);
    setFreeText(newText);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log("[FreeTextInput] Saving text, length:", freeText.length);
      
      // Check if a record already exists
      const { data, error: fetchError } = await supabase
        .from("questionnaire_synthesis")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchError) {
        console.error("[FreeTextInput] Error checking for existing synthesis:", fetchError);
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
        console.log("[FreeTextInput] Updating existing record:", data.id);
        const { error: updateError } = await supabase
          .from("questionnaire_synthesis")
          .update({
            free_text: freeText,
          })
          .eq("id", data.id);
          
        error = updateError;
      } else {
        // Insert new record
        console.log("[FreeTextInput] Creating new record for user:", userId);
        const { error: insertError } = await supabase
          .from("questionnaire_synthesis")
          .insert({
            user_id: userId,
            free_text: freeText,
          });
          
        error = insertError;
      }

      if (error) {
        console.error("[FreeTextInput] Error saving free text:", error);
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
      console.error("[FreeTextInput] Unexpected error:", error);
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

  // Check if there are any changes to enable/disable the save button
  const hasChanges = freeText !== initialText;
  
  console.log("[FreeTextInput] Button state:", {
    loading,
    hasChanges,
    freeTextLength: freeText.length,
    initialTextLength: initialText.length,
    isDisabled: loading || !hasChanges
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('synthesisTitle')}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {t('synthesisDescription')}
        </p>
      </div>
      
      <TextEditor 
        value={freeText} 
        onChange={handleTextChange} 
        placeholder={t('writeSynthesis')}
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
