
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SaveButtonProps {
  userId: string;
  freeText: string;
  hasChanges: boolean;
  loading: boolean;
  onSaveComplete?: () => void;
  setLoading: (loading: boolean) => void;
  setInitialText: (text: string) => void;
  setIsSaved: (saved: boolean) => void;
}

export function SaveButton({
  userId,
  freeText,
  hasChanges,
  loading,
  onSaveComplete,
  setLoading,
  setInitialText,
  setIsSaved,
}: SaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      setLoading(true);
      
      console.log("[SaveButton] Saving synthesis for user:", userId);
      console.log("[SaveButton] Text length:", freeText.length);
      
      // First check if record exists
      const { data: existingRecord, error: checkError } = await supabase
        .from('questionnaire_synthesis')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (checkError) {
        console.error("[SaveButton] Error checking existing record:", checkError);
        throw checkError;
      }
      
      let saveError;
      
      if (existingRecord) {
        // Update existing record
        console.log("[SaveButton] Updating existing synthesis record");
        const { error } = await supabase
          .from('questionnaire_synthesis')
          .update({ free_text: freeText })
          .eq('user_id', userId);
          
        saveError = error;
      } else {
        // Insert new record
        console.log("[SaveButton] Creating new synthesis record");
        const { error } = await supabase
          .from('questionnaire_synthesis')
          .insert({
            user_id: userId,
            free_text: freeText
          });
          
        saveError = error;
      }

      if (saveError) {
        console.error("[SaveButton] Error saving synthesis:", saveError);
        throw saveError;
      }

      console.log("[SaveButton] Synthesis saved successfully");
      toast({
        title: "Succès",
        description: "Vos directives anticipées ont été enregistrées.",
      });

      setInitialText(freeText);
      setIsSaved(true);
      
      if (onSaveComplete) {
        onSaveComplete();
      }
      
    } catch (error) {
      console.error("[SaveButton] Error during save:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSubmit}
      disabled={loading || (hasChanges === false && freeText.trim().length === 0)}
      className="w-full"
    >
      <Save className="mr-2 h-4 w-4" />
      Enregistrer mes directives anticipées
    </Button>
  );
}
