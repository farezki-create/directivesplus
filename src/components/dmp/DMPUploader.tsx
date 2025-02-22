
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileUp } from "lucide-react";

interface DMPUploaderProps {
  pdfUrl: string | null;
}

export function DMPUploader({ pdfUrl }: DMPUploaderProps) {
  const { toast } = useToast();

  const handleDMPUpload = async () => {
    if (!pdfUrl) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord générer le PDF de vos directives anticipées",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Implement DMP API integration
      toast({
        title: "À venir",
        description: "L'envoi vers le DMP sera bientôt disponible. Cette fonctionnalité nécessite une certification auprès de l'ANS.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi vers le DMP",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleDMPUpload}
      variant="outline"
      className="flex items-center gap-2"
    >
      <FileUp className="h-4 w-4" />
      Envoyer vers mon DMP
    </Button>
  );
}
