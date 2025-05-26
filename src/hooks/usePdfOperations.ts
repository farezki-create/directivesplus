
import { toast } from "@/hooks/use-toast";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
}

export const usePdfOperations = () => {
  const handleSelectAll = (document: Document) => {
    window.open(document.file_path, '_blank');
    toast({
      title: "Document ouvert",
      description: "Utilisez Ctrl+A pour tout sélectionner, puis Ctrl+C pour copier le contenu",
      duration: 5000
    });
  };

  return {
    handleSelectAll
  };
};
