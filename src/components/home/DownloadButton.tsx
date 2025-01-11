import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDownloadQuestionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      console.log('Starting questionnaire download process...');
      
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

      console.log('Converting Excel to CSV...');
      
      // Appeler l'Edge Function pour convertir Excel en CSV
      const { data: conversionData, error: conversionError } = await supabase.functions
        .invoke('convert-to-csv');

      if (conversionError) {
        console.error('Conversion error:', conversionError);
        throw new Error('Erreur lors de la conversion du questionnaire');
      }

      console.log('Conversion successful, downloading CSV...');
      
      // Télécharger le fichier CSV
      const { data, error } = await supabase.storage
        .from('questionnaires')
        .download('questionnaire.csv');

      if (error) {
        console.error('Download error:', error);
        throw new Error('Erreur lors du téléchargement du questionnaire');
      }

      if (!data) {
        console.error('No data received');
        throw new Error('Le fichier est introuvable');
      }

      console.log('Creating download link...');
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = "questionnaire-directives-anticipees.csv";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);

      console.log('Download completed successfully');
      
      toast({
        title: "Succès",
        description: "Le questionnaire a été téléchargé avec succès.",
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

  return handleDownload;
};