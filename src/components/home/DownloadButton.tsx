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

      console.log('Checking if file exists in bucket...');
      
      // Vérifier d'abord si le fichier existe
      const { data: files, error: listError } = await supabase.storage
        .from('questionnaires')
        .list('', {
          limit: 1,
          search: 'questionnaire.xlsx'
        });

      if (listError) {
        console.error('Error listing files:', listError);
        throw new Error('Erreur lors de la vérification du fichier');
      }

      console.log('Files found in bucket:', files);

      if (!files || files.length === 0) {
        console.error('File not found in bucket');
        throw new Error('Le questionnaire n\'est pas disponible dans le stockage');
      }

      console.log('Attempting to download file:', files[0].name);
      
      // Télécharger directement le fichier
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('questionnaires')
        .download('questionnaire.xlsx');

      if (downloadError) {
        console.error('Download error:', downloadError);
        throw new Error('Erreur lors du téléchargement du fichier');
      }

      if (!fileData) {
        console.error('No file data received');
        throw new Error('Aucune donnée reçue lors du téléchargement');
      }

      console.log('File downloaded successfully, creating blob URL...');
      
      // Créer un URL pour le blob et déclencher le téléchargement
      const url = URL.createObjectURL(fileData);
      const link = document.createElement('a');
      link.href = url;
      link.download = "questionnaire-directives-anticipees.xlsx";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);

      console.log('Download completed successfully');
      
      toast({
        title: "Succès",
        description: "Le questionnaire a été téléchargé avec succès.",
      });

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