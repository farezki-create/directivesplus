import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@supabase/auth-helpers-react";

const Examples = () => {
  const navigate = useNavigate();
  const user = useAuth();
  const { responses, isLoading, hasErrors } = useQuestionnairesResponses(user?.id);

  const renderSynthesis = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (hasErrors) {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertDescription>
            Une erreur est survenue lors de la récupération de vos réponses.
          </AlertDescription>
        </Alert>
      );
    }

    if (!responses.synthesis?.free_text) {
      return (
        <p className="text-muted-foreground">
          Aucune synthèse n'a été saisie.
        </p>
      );
    }

    return (
      <ScrollArea className="h-[200px] rounded-md border p-4">
        <p className="whitespace-pre-wrap">
          {responses.synthesis.free_text}
        </p>
      </ScrollArea>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">
              Documents
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Consultez des directives anticipées et des documents d'information
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <Button 
              size="lg" 
              className="h-auto min-h-[5rem] py-4 px-6 text-lg font-medium hover:scale-105 transition-transform duration-200 whitespace-normal text-center"
              onClick={() => navigate("/dashboard?tab=persons")}
            >
              Personne de confiance
            </Button>
            <Button 
              size="lg"
              className="h-auto min-h-[5rem] py-4 px-6 text-lg font-medium hover:scale-105 transition-transform duration-200 whitespace-normal text-center"
              onClick={() => navigate("/dashboard")}
            >
              Directives anticipées
            </Button>
          </div>

          {user && (
            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-semibold">
                Synthèse de vos directives anticipées
              </h2>
              {renderSynthesis()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Examples;