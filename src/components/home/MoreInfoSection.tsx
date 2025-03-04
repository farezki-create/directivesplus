
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface MoreInfoSectionProps {
  onBackToHome: () => void;
}

export function MoreInfoSection({ onBackToHome }: MoreInfoSectionProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const navigateToGuideInfo = async () => {
    try {
      setIsLoading(true);
      
      console.log("Tentative de récupération du document depuis le stockage...");
      
      const { data } = await supabase
        .storage
        .from('pdf_documents')
        .getPublicUrl('En savoir plus HAS.pdf');

      if (data?.publicUrl) {
        console.log("URL publique obtenue:", data.publicUrl);
        window.open(data.publicUrl, '_blank');
      } else {
        console.error("URL publique non trouvée dans la réponse:", data);
        toast({
          title: currentLanguage === 'fr' ? "Document introuvable" : "Document not found",
          description: currentLanguage === 'fr' 
            ? "Le guide sur les directives anticipées n'a pas été trouvé." 
            : "The guide on advance directives was not found.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'accès au document:", error);
      toast({
        title: currentLanguage === 'fr' ? "Erreur" : "Error",
        description: currentLanguage === 'fr' 
          ? "Impossible d'accéder au document pour le moment." 
          : "Unable to access the document at this time.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToAppInfo = () => {
    navigate("/dashboard");
  };
  
  const navigateToFAQ = () => {
    navigate("/faq");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            {currentLanguage === 'fr' ? 'Informations supplémentaires' : 'Additional Information'}
          </h1>
          
          <div className="flex flex-col space-y-6 items-center">
            <Button
              variant="default"
              size="lg"
              onClick={navigateToGuideInfo}
              className="w-full max-w-2xl py-6 text-lg bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading 
                ? (currentLanguage === 'fr' ? 'Chargement...' : 'Loading...') 
                : (currentLanguage === 'fr' 
                  ? 'Pourquoi et comment rédiger mes directives anticipées ?' 
                  : 'Why and how to write my advance directives?')}
            </Button>
            
            <Button
              variant="default"
              size="lg"
              onClick={navigateToFAQ}
              className="w-full max-w-2xl py-6 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {currentLanguage === 'fr' ? 'Questions/Réponses' : 'FAQ'}
            </Button>
            
            <Button
              variant="default"
              size="lg"
              onClick={navigateToAppInfo}
              className="w-full max-w-2xl py-6 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {currentLanguage === 'fr' 
                ? 'Informations sur l\'application DirectivesPlus' 
                : 'Information about DirectivesPlus application'}
            </Button>
            
            <Button
              variant="outline"
              onClick={onBackToHome}
              className="mt-8"
            >
              {currentLanguage === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
