import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDownloadQuestionnaire = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session found, redirecting to auth...');
        toast({
          variant: "destructive",
          title: "Connexion requise",
          description: "Veuillez vous connecter pour télécharger le questionnaire.",
        });
        navigate("/auth");
        return;
      }

      console.log('Requesting signed URL for questionnaire...');
      
      const response = await fetch(
        'https://zxytckmvmvtfcihnhlbj.supabase.co/functions/v1/download-questionnaire',
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        console.error('Request failed with status:', response.status);
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du téléchargement');
      }

      const { url } = await response.json();
      
      if (!url) {
        throw new Error('Lien de téléchargement invalide');
      }

      console.log('Opening download URL in new tab...');
      window.open(url, '_blank');

      console.log('Download initiated successfully');
      
      toast({
        title: "Succès",
        description: "Le téléchargement du questionnaire a démarré.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error('Error during download:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du téléchargement.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            Vos directives anticipées en toute simplicité
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Rédigez vos directives anticipées et désignez vos personnes de confiance
            en quelques étapes simples et sécurisées.
          </p>

          <div className="grid gap-4 md:grid-cols-2 max-w-lg mx-auto">
            <Button
              size="lg"
              onClick={handleDownloadQuestionnaire}
            >
              Commencer
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/dashboard")}
            >
              En savoir plus
            </Button>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Simple et guidé</h3>
              <p className="text-muted-foreground">
                Un processus pas à pas pour vous accompagner dans la rédaction.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">100% sécurisé</h3>
              <p className="text-muted-foreground">
                Vos données sont protégées et confidentielles.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Toujours accessible</h3>
              <p className="text-muted-foreground">
                Consultez et modifiez vos directives à tout moment.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;