
import { Button } from "@/components/ui/button";

interface ProfileFooterProps {
  onLogout: () => Promise<void>;
}

export default function ProfileFooter({ onLogout }: ProfileFooterProps) {
  return (
    <Button
      variant="outline"
      className="w-full text-red-500 border-red-300 hover:bg-red-50"
      onClick={onLogout}
    >
      Déconnexion
    </Button>
  );
}
