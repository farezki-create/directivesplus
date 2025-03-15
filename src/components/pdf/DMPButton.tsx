
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Construction, Database } from "lucide-react";

export function DMPButton() {
  const { toast } = useToast();

  const handleSendToDMP = () => {
    toast({
      title: "En construction",
      description: "Cette fonctionnalité est en cours de développement",
    });
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleSendToDMP}
      className="flex items-center"
    >
      <Database className="mr-2 h-4 w-4" />
      <Construction className="mr-2 h-4 w-4" />
      Envoyer à votre DMP
    </Button>
  );
}
