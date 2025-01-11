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

      if (!files || files.length === 0) {
        console.error('File not found in bucket');
        throw new Error('Le questionnaire n\'est pas disponible dans le stockage');
      }

      console.log('File found, attempting to get signed URL...');
      
      // Obtenir une URL signée pour le téléchargement
      const { data: signedURL, error: signedURLError } = await supabase.storage
        .from('questionnaires')
        .createSignedUrl('questionnaire.xlsx', 60);

      if (signedURLError) {
        console.error('Signed URL error:', signedURLError);
        throw new Error('Erreur lors de la génération du lien de téléchargement');
      }

      if (!signedURL || !signedURL.signedUrl) {
        console.error('No signed URL generated');
        throw new Error('Impossible de générer le lien de téléchargement');
      }

      console.log('Got signed URL, initiating download...');
      
      // Télécharger le fichier via l'URL signée
      const response = await fetch(signedURL.signedUrl);
      if (!response.ok) {
        console.error('Download response not OK:', response.status, response.statusText);
        throw new Error('Erreur lors du téléchargement du fichier');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
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