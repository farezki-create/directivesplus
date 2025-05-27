
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileFooterProps {
  onLogout?: () => Promise<void>;
}

export default function ProfileFooter({ onLogout }: ProfileFooterProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    console.log("🔴 === ProfileFooter: BOUTON DÉCONNEXION CLIQUÉ === 🔴");
    
    // Empêcher les clics multiples
    if (isLoggingOut) {
      console.log("⚠️ Déconnexion déjà en cours, ignore le clic");
      return;
    }
    
    setIsLoggingOut(true);
    
    try {
      if (onLogout) {
        console.log("🔄 ProfileFooter: Utilisation du onLogout custom");
        await onLogout();
      } else {
        console.log("🔄 ProfileFooter: Utilisation du signOut du contexte AUTH");
        await signOut();
      }
    } catch (error) {
      console.error('❌ ProfileFooter: Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, forcer la redirection radicale
      console.log("🚨 ProfileFooter: REDIRECTION DE SECOURS");
      window.location.replace('/auth');
    } finally {
      // Ne pas remettre à false car on va être redirigé
      console.log("🔚 ProfileFooter: Fin du processus de déconnexion");
    }
  };
  
  return (
    <Button
      variant="outline"
      className="w-full text-red-500 border-red-300 hover:bg-red-50"
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <span className="flex items-center gap-2">
          <LoaderCircle className="animate-spin h-4 w-4" />
          Déconnexion en cours...
        </span>
      ) : (
        "Déconnexion"
      )}
    </Button>
  );
}
