
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem("cookies-accepted");
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookies-accepted", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Cookie className="h-5 w-5 text-blue-600" />
          <p className="text-sm">
            Ce site utilise uniquement des cookies nécessaires au bon fonctionnement de l'application 
            (connexion, sécurité). Aucun cookie publicitaire n'est utilisé.
          </p>
        </div>
        <Button
          onClick={acceptCookies}
          className="whitespace-nowrap"
        >
          J'accepte
        </Button>
      </div>
    </div>
  );
}
