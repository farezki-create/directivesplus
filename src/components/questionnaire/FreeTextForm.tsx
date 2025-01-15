import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export function FreeTextForm() {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!session?.user?.id) {
      console.error('No user session found');
      return;
    }

    try {
      const { error } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: session.user.id,
          free_text: text,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Texte sauvegardé",
        description: "Votre texte a été enregistré avec succès."
      });

      navigate("/");
    } catch (error) {
      console.error('Error saving text:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du texte."
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