
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AppNavigation from "@/components/AppNavigation";

interface AccessRestrictedViewProps {
  onBackClick: () => void;
}

export default function AccessRestrictedView({ onBackClick }: AccessRestrictedViewProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={onBackClick}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour au tableau de bord
          </Button>
        </div>
        
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Accès Restreint
          </h1>
          <p className="text-gray-600">
            Cette page est réservée au personnel soignant. 
            Vous devez avoir un compte avec une adresse email @directivesplus.fr pour y accéder.
          </p>
        </div>
      </main>
    </div>
  );
}
