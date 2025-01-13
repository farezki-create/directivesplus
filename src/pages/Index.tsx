import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { QuestionsDialog } from "@/components/QuestionsDialog";

const Index = () => {
  const navigate = useNavigate();
  const [showSections, setShowSections] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-center px-2">
            Vos directives anticipées en toute simplicité
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 text-center px-2">
            Rédigez vos directives anticipées et désignez vos personnes de confiance
            en quelques étapes simples et sécurisées.
          </p>

          {!showSections ? (
            <div className="grid gap-3 md:gap-4 md:grid-cols-2 max-w-lg mx-auto px-4">
              <Button
                size="lg"
                onClick={() => setShowSections(true)}
                className="w-full"
              >
                Commencer
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="w-full"
              >
                En savoir plus
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 md:gap-4 max-w-lg mx-auto px-4">
              <Button
                size="lg"
                onClick={() => setDialogOpen(true)}
                className="w-full"
              >
                Mon avis d'une façon générale
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="w-full"
              >
                Maintien en vie
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="w-full"
              >
                Allégement des souffrances
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="w-full"
              >
                Privilégier le laisser mourir
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

          <div className="mt-8 md:mt-12 grid gap-6 md:gap-8 md:grid-cols-3 px-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Simple et guidé</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Un processus pas à pas pour vous accompagner dans la rédaction.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">100% sécurisé</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Vos données sont protégées et confidentielles.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Toujours accessible</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Consultez et modifiez vos directives à tout moment.
              </p>
            </div>
          </div>
        </div>
      </main>

      <QuestionsDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Index;