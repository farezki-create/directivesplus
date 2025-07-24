import { Button } from "@/components/ui/button";
import { ExternalLink, Home } from "lucide-react";

interface PublicPageButtonProps {
  className?: string;
}

export const PublicPageButton = ({ className = "" }: PublicPageButtonProps) => {
  const openHealthNews = () => {
    // Ouvrir dans la même fenêtre pour éviter les popups et cookies
    window.location.href = "https://www.santepubliquefrance.fr/les-actualites";
  };

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div className={`flex gap-3 ${className}`}>
      <Button
        variant="outline"
        onClick={goHome}
        className="flex items-center gap-2"
      >
        <Home size={16} />
        Accueil
      </Button>
      
      <Button
        variant="secondary"
        onClick={openHealthNews}
        className="flex items-center gap-2"
      >
        <ExternalLink size={16} />
        Actualités Santé
      </Button>
    </div>
  );
};