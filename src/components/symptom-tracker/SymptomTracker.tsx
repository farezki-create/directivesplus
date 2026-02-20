
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, Save } from "lucide-react";
import MedicalDeviceDisclaimer from "./MedicalDeviceDisclaimer";
import CriticalSymptomAlert from "./CriticalSymptomAlert";
import CriticalSymptomWarning from "./CriticalSymptomWarning";
import SymptomInputs from "./SymptomInputs";
import { useSymptomForm } from "@/hooks/useSymptomForm";

export default function SymptomTracker() {
  const {
    symptoms,
    remarque,
    saving,
    alerting,
    setRemarque,
    handleSymptomChange,
    handleSave
  } = useSymptomForm();

  // Vérifier s'il y a des symptômes critiques
  const hasCriticalSymptoms = symptoms.douleur >= 7 || symptoms.dyspnee >= 7 || symptoms.anxiete >= 7;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-pink-600" />
          Évaluation des symptômes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CriticalSymptomWarning hasCriticalSymptoms={hasCriticalSymptoms} />

        <CriticalSymptomAlert 
          douleur={symptoms.douleur}
          dyspnee={symptoms.dyspnee}
          anxiete={symptoms.anxiete}
          className="mb-4"
        />

        <SymptomInputs 
          symptoms={symptoms}
          onSymptomChange={handleSymptomChange}
        />

        <div className="space-y-2">
          <Label htmlFor="remarque">Remarques ou observations</Label>
          <Textarea
            id="remarque"
            value={remarque}
            onChange={(e) => setRemarque(e.target.value)}
            placeholder="Décrivez vos sensations, ce qui améliore ou aggrave vos symptômes..."
            className="min-h-[100px]"
          />
        </div>

        <Button 
          onClick={handleSave}
          disabled={saving || alerting}
          className="w-full bg-pink-600 hover:bg-pink-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Enregistrement..." : alerting ? "Vérification des alertes..." : "Enregistrer"}
        </Button>

        <MedicalDeviceDisclaimer compact />
      </CardContent>
    </Card>
  );
}
