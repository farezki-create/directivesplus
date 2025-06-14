
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Heart, Save } from "lucide-react";
import CriticalSymptomAlert from "./CriticalSymptomAlert";
import { useSymptomAlerts } from "@/hooks/useSymptomAlerts";

export default function SymptomTracker() {
  const { user } = useAuth();
  const { checkAndCreateAlert, alerting } = useSymptomAlerts();
  
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

    try {
      const { error } = await supabase
        .from("symptom_tracking")
        .insert({
          patient_id: user.id,
          douleur: symptoms.douleur,
          dyspnee: symptoms.dyspnee,
          anxiete: symptoms.anxiete,
          fatigue: symptoms.fatigue,
          sommeil: symptoms.sommeil,
          remarque: remarque || null,
          auteur: user.email || "patient"
        });

      if (error) {
        console.error("Erreur lors de l'enregistrement:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer vos symptômes",
          variant: "destructive"
        });
        return;
      }

      // Vérifier les seuils critiques et créer une alerte si nécessaire
      await checkAndCreateAlert(symptoms.douleur, symptoms.dyspnee, symptoms.anxiete);

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
      console.error("Erreur:", err);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-pink-600" />
          Évaluation des symptômes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
                <span className="text-sm font-bold text-gray-600">
                  {value}/10
                </span>
              </div>
              <Slider
                value={[value]}
                onValueChange={(newValue) => handleSymptomChange(symptom, newValue)}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Aucun</span>
                <span>Léger</span>
                <span>Modéré</span>
                <span>Sévère</span>
                <span>Insupportable</span>
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
          {saving ? "Enregistrement..." : alerting ? "Création d'alerte..." : "Enregistrer"}
        </Button>
      </CardContent>
    </Card>
  );
}
