import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";

const Examples = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Exemples et documents utiles
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 text-center">
            Consultez des exemples de directives anticipées et des documents d'information
          </p>

          <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto mb-8">
            <Button size="lg">
              Exemples de modèles de directives déjà remplis
            </Button>
            <Button size="lg">
              Télécharger des documents utiles pour les directives anticipées
            </Button>
          </div>

          <div className="flex justify-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="w-full max-w-md"
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