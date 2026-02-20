
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
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await signOut();
      }
    } catch (error) {
      console.error('❌ ProfileFooter: Erreur lors de la déconnexion:', error);
      window.location.replace('/auth');
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
