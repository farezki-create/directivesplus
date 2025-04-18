
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { UserProfile, TrustedPerson } from "../types";

interface CardGenerateButtonProps {
  onGenerate: (profile: UserProfile, trustedPersons: TrustedPerson[]) => void;
  profile: UserProfile | null;
  trustedPersons: TrustedPerson[];
  isGenerating: boolean;
}

export function CardGenerateButton({ 
  onGenerate, 
  profile, 
  trustedPersons, 
  isGenerating 
}: CardGenerateButtonProps) {
  return (
    <Button 
      onClick={() => profile && onGenerate(profile, trustedPersons)} 
      disabled={isGenerating}
      className="flex items-center gap-2"
    >
      <CreditCard className="h-4 w-4" />
      {isGenerating ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Génération...
        </span>
      ) : 'Générer la carte'}
    </Button>
  );
}
