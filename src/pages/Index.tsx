import { useEffect } from "react";
import { MainButtons } from "@/components/home/MainButtons";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { ExplanationDialog } from "@/components/ExplanationDialog";
import { useDialogState } from "@/hooks/useDialogState";

const Index = () => {
  const { explanationOpen, setExplanationOpen } = useDialogState();

  useEffect(() => {
    // Check if we should show the dialog (after login)
    const shouldShowDialog = sessionStorage.getItem('showExplanationDialog') === 'true';
    if (shouldShowDialog) {
      setExplanationOpen(true);
      // Remove the flag after showing the dialog
      sessionStorage.removeItem('showExplanationDialog');
    }
  }, [setExplanationOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            Vos directives anticipées en toute simplicité
          </h1>
          
          <p className="text-xl text-gray-600 mb-12">
            Rédigez vos directives anticipées et désignez vos personnes de confiance en quelques étapes simples et sécurisées.
          </p>

          <MainButtons />
          <FeatureHighlights />
        </div>
      </main>

      <ExplanationDialog 
        open={explanationOpen}
        onOpenChange={setExplanationOpen}
        onContinue={() => setExplanationOpen(false)}
      />
    </div>
  );
};

export default Index;