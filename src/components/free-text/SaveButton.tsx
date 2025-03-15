
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log("[SaveButton] Saving text, length:", freeText.length);
      
      const { data, error: fetchError } = await supabase
        .from("questionnaire_synthesis")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchError) {
        console.error("[SaveButton] Error checking for existing synthesis:", fetchError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification des données existantes.",
          variant: "destructive",
        });
        return;
      }

      let error;
      
      if (data) {
        console.log("[SaveButton] Updating existing record:", data.id);
        const { error: updateError } = await supabase
          .from("questionnaire_synthesis")
          .update({
            free_text: freeText,
          })
          .eq("id", data.id);
          
        error = updateError;
      } else {
        console.log("[SaveButton] Creating new record for user:", userId);
        const { error: insertError } = await supabase
          .from("questionnaire_synthesis")
          .insert({
            user_id: userId,
            free_text: freeText,
          });
          
        error = insertError;
      }

      if (error) {
        console.error("[SaveButton] Error saving free text:", error);
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
      console.error("[SaveButton] Unexpected error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
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
