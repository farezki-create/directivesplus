
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionsDialog } from "@/components/QuestionsDialog";
import { ExplanationDialog } from "@/components/ExplanationDialog";
import { LifeSupportExplanationDialog } from "@/components/LifeSupportExplanationDialog";
import { LifeSupportQuestionsDialog } from "@/components/LifeSupportQuestionsDialog";
import { AdvancedIllnessExplanationDialog } from "@/components/AdvancedIllnessExplanationDialog";
import { AdvancedIllnessQuestionsDialog } from "@/components/AdvancedIllnessQuestionsDialog";
import { PreferencesExplanationDialog } from "@/components/PreferencesExplanationDialog";
import { PreferencesQuestionsDialog } from "@/components/PreferencesQuestionsDialog";
import { MainButtons } from "@/components/home/MainButtons";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { useDialogState } from "@/hooks/useDialogState";
import { useLanguage } from "@/hooks/language/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [showSections, setShowSections] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dialogState = useDialogState();
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();

  const handleGeneralOpinionClick = () => {
    dialogState.setExplanationOpen(true);
  };

  const handleExplanationContinue = () => {
    dialogState.setExplanationOpen(false);
    dialogState.setQuestionsOpen(true);
  };

  const handleLifeSupportClick = () => {
    dialogState.setLifeSupportExplanationOpen(true);
  };

  const handleLifeSupportExplanationContinue = () => {
    dialogState.setLifeSupportExplanationOpen(false);
    dialogState.setLifeSupportQuestionsOpen(true);
  };

  const handleAdvancedIllnessClick = () => {
    dialogState.setAdvancedIllnessExplanationOpen(true);
  };

  const handleAdvancedIllnessExplanationContinue = () => {
    dialogState.setAdvancedIllnessExplanationOpen(false);
    dialogState.setAdvancedIllnessQuestionsOpen(true);
  };

  const handlePreferencesClick = () => {
    dialogState.setPreferencesExplanationOpen(true);
  };

  const handlePreferencesExplanationContinue = () => {
    dialogState.setPreferencesExplanationOpen(false);
    dialogState.setPreferencesQuestionsOpen(true);
  };

  const handleLearnMore = () => {
    setShowMoreInfo(true);
  };

  const navigateToGuideInfo = async () => {
    try {
      setIsLoading(true);
      
      console.log("Tentative de récupération du document depuis le stockage...");
      
      // getPublicUrl ne retourne pas d'erreur, seulement un objet data
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

  const handleBackToHome = () => {
    setShowMoreInfo(false);
  };

  if (showMoreInfo) {
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
                onClick={handleBackToHome}
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">
            {currentLanguage === 'fr' 
              ? 'Vos directives anticipées en toute simplicité' 
              : 'Your advance directives with simplicity'}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 text-center">
            {currentLanguage === 'fr' 
              ? 'Rédigez vos directives anticipées et désignez vos personnes de confiance en quelques étapes simples et sécurisées.' 
              : 'Write your advance directives and designate your trusted persons in a few simple and secure steps.'}
          </p>

          {!showSections ? (
            <div className="flex flex-col space-y-4 max-w-lg mx-auto">
              <Button
                size="lg"
                onClick={() => setShowSections(true)}
              >
                {currentLanguage === 'fr' ? 'Commencer' : 'Start'}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleLearnMore}
              >
                {currentLanguage === 'fr' ? 'En savoir plus' : 'Learn more'}
              </Button>
            </div>
          ) : (
            <MainButtons 
              onGeneralOpinionClick={handleGeneralOpinionClick}
              onLifeSupportClick={handleLifeSupportClick}
              onAdvancedIllnessClick={handleAdvancedIllnessClick}
              onPreferencesClick={handlePreferencesClick}
            />
          )}

          <FeatureHighlights />
        </div>
      </main>

      <ExplanationDialog 
        open={dialogState.explanationOpen}
        onOpenChange={dialogState.setExplanationOpen}
        onContinue={handleExplanationContinue}
      />

      <QuestionsDialog 
        open={dialogState.questionsOpen}
        onOpenChange={dialogState.setQuestionsOpen}
      />

      <LifeSupportExplanationDialog
        open={dialogState.lifeSupportExplanationOpen}
        onOpenChange={dialogState.setLifeSupportExplanationOpen}
        onContinue={handleLifeSupportExplanationContinue}
      />

      <LifeSupportQuestionsDialog
        open={dialogState.lifeSupportQuestionsOpen}
        onOpenChange={dialogState.setLifeSupportQuestionsOpen}
      />

      <AdvancedIllnessExplanationDialog
        open={dialogState.advancedIllnessExplanationOpen}
        onOpenChange={dialogState.setAdvancedIllnessExplanationOpen}
        onContinue={handleAdvancedIllnessExplanationContinue}
      />

      <AdvancedIllnessQuestionsDialog
        open={dialogState.advancedIllnessQuestionsOpen}
        onOpenChange={dialogState.setAdvancedIllnessQuestionsOpen}
      />

      <PreferencesExplanationDialog
        open={dialogState.preferencesExplanationOpen}
        onOpenChange={dialogState.setPreferencesExplanationOpen}
        onContinue={handlePreferencesExplanationContinue}
      />

      <PreferencesQuestionsDialog
        open={dialogState.preferencesQuestionsOpen}
        onOpenChange={dialogState.setPreferencesQuestionsOpen}
      />
    </div>
  );
};

export default Index;
