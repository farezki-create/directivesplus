import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">DirectivesPlus</h1>
        </div>
        <nav className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
          >
            Accueil
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            Tableau de bord
          </Button>
          <Button variant="default">
            Connexion
          </Button>
        </nav>
      </div>
    </header>
  );
};