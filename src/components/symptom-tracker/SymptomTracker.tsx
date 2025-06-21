
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Heart, Save, AlertTriangle } from "lucide-react";
import CriticalSymptomAlert from "./CriticalSymptomAlert";
import { useSymptomAlerting } from "@/hooks/useSymptomAlerting";

export default function SymptomTracker() {
  const { user } = useAuth();
  const { checkAndTriggerAlert, showAlertDialog, alerting } = useSymptomAlerting();
  
  const [symptoms, setSymptoms] = useState({
    douleur: 0,
    dyspnee: 0,
    anxiete: 0,
    fatigue: 0,
    sommeil: 0
  });
  
  const [remarque, setRemarque] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSymptomChange = (symptom: string, value: number[]) => {
    setSymptoms(prev => ({
      ...prev,
      [symptom]: value[0]
    }));
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos symptômes",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    console.log("Début de l'enregistrement des symptômes pour l'utilisateur:", user.id);
    console.log("Symptômes à enregistrer:", symptoms);

    try {
      // Enregistrer les symptômes
      const symptomData = {
        patient_id: user.id,
        douleur: symptoms.douleur,
        dyspnee: symptoms.dyspnee,
        anxiete: symptoms.anxiete,
        fatigue: symptoms.fatigue,
        sommeil: symptoms.sommeil,
        remarque: remarque || null,
        auteur: user.email || "patient"
      };

      console.log("Données à insérer:", symptomData);

      const { error } = await supabase
        .from("symptom_tracking")
        .insert(symptomData);

      if (error) {
        console.error("Erreur Supabase lors de l'enregistrement:", error);
        toast({
          title: "Erreur de base de données",
          description: `Erreur: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log("Symptômes enregistrés avec succès");

      // Vérifier et déclencher les alertes
      try {
        const alertResult = await checkAndTriggerAlert(
          symptoms.douleur, 
          symptoms.dyspnee, 
          symptoms.anxiete,
          symptoms.fatigue,
          symptoms.sommeil
        );

        if (alertResult && alertResult.redirectToAlerts) {
          showAlertDialog(alertResult.criticalSymptoms);
        }
      } catch (alertError) {
        console.error("Erreur lors de la vérification des alertes:", alertError);
        // Ne pas faire échouer l'enregistrement si les alertes échouent
      }

      toast({
        title: "Symptômes enregistrés",
        description: "Vos symptômes ont été sauvegardés avec succès"
      });

      // Reset du formulaire
      setSymptoms({
        douleur: 0,
        dyspnee: 0,
        anxiete: 0,
        fatigue: 0,
        sommeil: 0
      });
      setRemarque("");

    } catch (err) {
      console.error("Erreur générale:", err);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de l'enregistrement",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const symptomLabels = {
    douleur: "Douleur",
    dyspnee: "Dyspnée (essoufflement)",
    anxiete: "Anxiété/Angoisse",
    fatigue: "Fatigue/État général",
    sommeil: "Sommeil/Confort global"
  };

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
        {hasCriticalSymptoms && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Symptômes critiques détectés</h4>
                <p className="text-sm text-red-700">
                  Des évaluations élevées seront signalées à vos contacts d'alerte après l'enregistrement.
                </p>
              </div>
            </div>
          </div>
        )}

        <CriticalSymptomAlert 
          douleur={symptoms.douleur}
          dyspnee={symptoms.dyspnee}
          anxiete={symptoms.anxiete}
          className="mb-4"
        />

        <div className="grid gap-6">
          {Object.entries(symptoms).map(([symptom, value]) => (
            <div key={symptom} className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-medium">
                  {symptomLabels[symptom as keyof typeof symptomLabels]}
                </Label>
                <span className={`text-sm font-bold ${value >= 7 ? 'text-red-600' : 'text-gray-600'}`}>
                  {value}/10
                </span>
              </div>
              <Slider
                value={[value]}
                onValueChange={(newValue) => handleSymptomChange(symptom, newValue)}
                max={10}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>2.5</span>
                <span>5</span>
                <span>7.5</span>
                <span>10</span>
              </div>
            </div>
          ))}
        </div>

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
      </CardContent>
    </Card>
  );
}
