
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function TrustedPersonPDFGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const generatePDF = async () => {
    try {
      setIsLoading(true);
      
      // Cette fonction est un placeholder pour le moment
      // À implémenter quand on aura la logique de génération de PDF
      
      toast({
        title: "Fonctionnalité à venir",
        description: "La génération du PDF des personnes de confiance sera disponible prochainement.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF des personnes de confiance.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline" 
      onClick={generatePDF}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Génération...
        </>
      ) : (
        <>
          <FileText className="h-4 w-4" />
          Télécharger PDF
        </>
      )}
    </Button>
  );
}
