
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function IntroSection() {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Vérification importante</AlertTitle>
      <AlertDescription>
        Prenez le temps nécessaire pour vérifier que toutes vos informations sont complètes avant de générer le document final.
        Un document complet doit inclure vos réponses aux questionnaires, votre texte libre et idéalement une personne de confiance.
      </AlertDescription>
    </Alert>
  );
}
