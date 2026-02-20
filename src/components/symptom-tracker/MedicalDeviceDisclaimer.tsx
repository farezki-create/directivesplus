import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MedicalDeviceDisclaimerProps {
  compact?: boolean;
}

export default function MedicalDeviceDisclaimer({ compact = false }: MedicalDeviceDisclaimerProps) {
  if (compact) {
    return (
      <p className="text-xs text-muted-foreground italic mt-2">
        ⚠️ Cette application n'est pas un dispositif médical au sens du Règlement (UE) 2017/745. 
        Elle ne fournit aucun diagnostic, conseil thérapeutique ni recommandation de traitement. 
        Consultez toujours un professionnel de santé.
      </p>
    );
  }

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <Info className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800 text-sm">
        <strong>Information réglementaire importante :</strong> DirectivesPlus n'est <strong>pas un dispositif médical</strong> au sens 
        du Règlement (UE) 2017/745. Cette application est un outil de <strong>communication et de documentation</strong> destiné 
        à faciliter l'expression des volontés du patient et le suivi subjectif de son ressenti. 
        Les données saisies reflètent l'auto-évaluation du patient et <strong>ne constituent en aucun cas 
        un diagnostic médical, un avis thérapeutique ou une recommandation de traitement</strong>. 
        Les seuils d'alerte sont des repères indicatifs pour faciliter la communication avec l'équipe soignante. 
        En cas de symptômes préoccupants, contactez immédiatement votre équipe médicale.
      </AlertDescription>
    </Alert>
  );
}
