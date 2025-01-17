import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface FreeTextInputProps {
  userId: string | null;
}

export function FreeTextInput({ userId }: FreeTextInputProps) {
  const [text, setText] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSynthesis = async () => {
      if (!userId) return;

      try {
        console.log("[FreeTextInput] Loading existing synthesis");
        const { data, error } = await supabase
          .from('questionnaire_synthesis')
          .select('free_text')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error("[FreeTextInput] Error loading synthesis:", error);
          throw error;
        }

        if (data?.free_text) {
          console.log("[FreeTextInput] Loaded existing synthesis");
          setText(data.free_text);
        } else {
          console.log("[FreeTextInput] No existing synthesis found");
        }
      } catch (error) {
        console.error("[FreeTextInput] Error loading synthesis:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre synthèse existante.",
          variant: "destructive",
        });
      }
    };

    loadSynthesis();
  }, [userId, toast]);

  const handleSave = async () => {
    if (!userId) {
      console.log("[FreeTextInput] No user ID found, cannot save");
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos réponses.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("[FreeTextInput] Saving synthesis text");
      const { error } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: userId,
          free_text: text
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error("[FreeTextInput] Error saving synthesis:", error);
        throw error;
      }

      console.log("[FreeTextInput] Synthesis saved successfully");
      toast({
        title: "Succès",
        description: "Votre synthèse a été enregistrée.",
      });
      navigate("/");
    } catch (error) {
      console.error("[FreeTextInput] Error during save:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Expression libre</h2>
      <p className="text-muted-foreground mb-4">
        Utilisez cet espace pour exprimer librement vos souhaits, vos valeurs ou toute autre information que vous souhaitez partager avec l'équipe soignante.
      </p>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écrivez ici..."
        className="min-h-[200px] mb-6"
      />

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
        >
          Retour
        </Button>
        <Button onClick={handleSave}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
}