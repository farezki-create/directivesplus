import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export function FreeTextForm() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchExistingText() {
      if (!session?.user?.id) return;

      try {
        console.log("Chargement du texte existant...");
        const { data, error } = await supabase
          .from('questionnaire_synthesis')
          .select('free_text')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Erreur lors du chargement du texte:', error);
          return;
        }

        if (data?.free_text) {
          console.log('Texte existant chargé:', data.free_text);
          setText(data.free_text);
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    }

    fetchExistingText();
  }, [session?.user?.id]);

  const handleSave = async () => {
    if (!session?.user?.id) {
      console.error('No user session found');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder votre texte."
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Sauvegarde du texte:', text);
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

      console.log('Texte sauvegardé avec succès');
      toast({
        title: "Texte sauvegardé",
        description: "Votre texte a été enregistré avec succès."
      });

      // Attendre un peu avant la redirection pour que l'utilisateur voie le message
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error('Error saving text:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du texte."
      });
    } finally {
      setIsLoading(false);
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
          onClick={() => navigate("/dashboard")}
        >
          Retour
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}