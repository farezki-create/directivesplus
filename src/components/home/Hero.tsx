import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  onDownload: () => void;
}

export const Hero = ({ onDownload }: HeroProps) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">
        Vos directives anticipées en toute simplicité
      </h1>
      
      <p className="text-xl text-muted-foreground mb-8">
        Rédigez vos directives anticipées et désignez vos personnes de confiance
        en quelques étapes simples et sécurisées.
      </p>

      <div className="grid gap-4 md:grid-cols-2 max-w-lg mx-auto">
        <Button
          size="lg"
          onClick={onDownload}
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
    </div>
  );
};