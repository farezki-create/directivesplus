import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { QuestionsDialog } from "@/components/QuestionsDialog";
import { ExplanationDialog } from "@/components/ExplanationDialog";
import { LifeSupportExplanationDialog } from "@/components/LifeSupportExplanationDialog";
import { LifeSupportQuestionsDialog } from "@/components/LifeSupportQuestionsDialog";

const Index = () => {
  const navigate = useNavigate();
  const [showSections, setShowSections] = useState(false);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [lifeSupportExplanationOpen, setLifeSupportExplanationOpen] = useState(false);
  const [lifeSupportQuestionsOpen, setLifeSupportQuestionsOpen] = useState(false);

  const handleGeneralOpinionClick = () => {
    setExplanationOpen(true);
  };

  const handleExplanationContinue = () => {
    setExplanationOpen(false);
    setQuestionsOpen(true);
  };

  const handleLifeSupportClick = () => {
    setLifeSupportExplanationOpen(true);
  };

  const handleLifeSupportExplanationContinue = () => {
    setLifeSupportExplanationOpen(false);
    setLifeSupportQuestionsOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Vos directives anticipées en toute simplicité
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 text-center">
            Rédigez vos directives anticipées et désignez vos personnes de confiance
            en quelques étapes simples et sécurisées.
          </p>

          {!showSections ? (
            <div className="grid gap-4 md:grid-cols-2 max-w-lg mx-auto">
              <Button
                size="lg"
                onClick={() => setShowSections(true)}
              >
                Commencer
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/dashboard")}
              >
                En savoir plus
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 max-w-lg mx-auto">
              <Button
                size="lg"
                onClick={handleGeneralOpinionClick}
                className="w-full"
              >
                Mon avis d'une façon générale
              </Button>
              <Button
                size="lg"
                onClick={handleLifeSupportClick}
                className="w-full"
              >
                Maintien en vie
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="w-full"
              >
                Maladie avancée
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="w-full"
              >
                maladie avancée
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="w-full flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Désignation d'une personne de confiance
              </Button>
            </div>
          )}

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Simple et guidé</h3>
              <p className="text-muted-foreground">
                Un processus pas à pas pour vous accompagner dans la rédaction.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">100% sécurisé</h3>
              <p className="text-muted-foreground">
                Vos données sont protégées et confidentielles.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Toujours accessible</h3>
              <p className="text-muted-foreground">
                Consultez et modifiez vos directives à tout moment.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ExplanationDialog 
        open={explanationOpen}
        onOpenChange={setExplanationOpen}
        onContinue={handleExplanationContinue}
      />

      <QuestionsDialog 
        open={questionsOpen}
        onOpenChange={setQuestionsOpen}
      />

      <LifeSupportExplanationDialog
        open={lifeSupportExplanationOpen}
        onOpenChange={setLifeSupportExplanationOpen}
        onContinue={handleLifeSupportExplanationContinue}
      />

      <LifeSupportQuestionsDialog
        open={lifeSupportQuestionsOpen}
        onOpenChange={setLifeSupportQuestionsOpen}
      />
    </div>
  );
};

export default Index;