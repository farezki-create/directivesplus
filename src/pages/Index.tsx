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
      console.log('Starting questionnaire download...');
      
      // First check if the file exists
      const { data: fileList, error: listError } = await supabase.storage
        .from('questionnaires')
        .list();

      console.log('Files in bucket:', fileList);
      console.log('List error:', listError);
      
      if (listError) {
        console.error('Error listing files:', listError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de vérifier la disponibilité du questionnaire. Veuillez réessayer.",
        });
        return;
      }

      const questionnaireFile = fileList?.find(file => file.name === 'questionnaire.xlsx');
      console.log('Found questionnaire file:', questionnaireFile);

      if (!questionnaireFile) {
        console.error('Questionnaire file not found in bucket');
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Le questionnaire n'est pas disponible pour le moment. Veuillez réessayer plus tard.",
        });
        return;
      }

      // If file exists, proceed with download
      console.log('Attempting to download file:', questionnaireFile.name);
      const { data, error: downloadError } = await supabase.storage
        .from('questionnaires')
        .download(questionnaireFile.name);

      console.log('Download response - Data:', !!data, 'Error:', downloadError);

      if (downloadError) {
        console.error('Error downloading questionnaire:', downloadError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de télécharger le questionnaire. Veuillez réessayer.",
        });
        return;
      }

      if (!data) {
        console.error('No data received from download');
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Le téléchargement a échoué. Veuillez réessayer.",
        });
        return;
      }

      console.log('Creating download link...');
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'questionnaire-directives-anticipees.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('Download completed successfully');
      
      toast({
        title: "Succès",
        description: "Le questionnaire a été téléchargé avec succès.",
      });

      // Navigate to dashboard after successful download
      navigate("/dashboard");
    } catch (error) {
      console.error('Unexpected error in download process:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue est survenue lors du téléchargement.",
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