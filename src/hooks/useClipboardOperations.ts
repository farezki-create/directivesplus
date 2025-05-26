
import { toast } from "@/hooks/use-toast";

export const useClipboardOperations = (extractedText: string, setExtractedText: (text: string) => void) => {
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setExtractedText(extractedText + '\n\n' + text);
        toast({
          title: "Texte collé",
          description: "Le contenu du presse-papier a été ajouté"
        });
      } else {
        toast({
          title: "Presse-papier vide",
          description: "Aucun texte trouvé dans le presse-papier",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Accès refusé",
        description: "Impossible d'accéder au presse-papier. Utilisez Ctrl+V dans la zone de texte.",
        variant: "destructive"
      });
    }
  };

  return {
    handlePasteFromClipboard
  };
};
