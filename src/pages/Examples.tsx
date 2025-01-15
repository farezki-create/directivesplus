import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";

const Examples = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">
              Exemples et documents utiles
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Consultez des exemples de directives anticipées et des documents d'information
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <Button 
              size="lg" 
              className="h-auto min-h-[5rem] py-4 px-6 text-lg font-medium hover:scale-105 transition-transform duration-200 whitespace-normal text-center"
            >
              Exemples de modèles de directives déjà remplis
            </Button>
            <Button 
              size="lg"
              className="h-auto min-h-[5rem] py-4 px-6 text-lg font-medium hover:scale-105 transition-transform duration-200 whitespace-normal text-center"
            >
              Télécharger des documents utiles pour les directives anticipées
            </Button>
          </div>

          <div className="flex justify-center pt-8">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="w-full max-w-md text-lg font-medium hover:bg-primary/5 transition-colors duration-200"
            >
              Récupérer mes directives
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Examples;