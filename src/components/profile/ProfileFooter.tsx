
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

interface ProfileFooterProps {
  onLogout: () => Promise<void>;
}

export default function ProfileFooter({ onLogout }: ProfileFooterProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
    } catch (error) {
      setIsLoggingOut(false);
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
