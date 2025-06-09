
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Save } from "lucide-react";

const SymptomForm = () => {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState({
    douleur: 0,
    dyspnee: 0,
    anxiete: 0,
    fatigue: 0,
    appetit: 0,
    nausees: 0,
  });
  const [remarque, setRemarque] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSymptomChange = (symptom: string, value: number[]) => {
    setSymptoms(prev => ({
      ...prev,
      [symptom]: value[0]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos symptômes",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("symptom_tracking")
        .insert({
          patient_id: user.id,
          douleur: symptoms.douleur,
          dyspnee: symptoms.dyspnee,
          anxiete: symptoms.anxiete,
          fatigue: symptoms.fatigue,
          appetit: symptoms.appetit,
          nausees: symptoms.nausees,
          remarque: remarque.trim() || null,
          auteur: user.user_metadata?.first_name || user.email || "Utilisateur"
        });

      if (error) throw error;

      toast({
        title: "Symptômes enregistrés",
        description: "Vos symptômes ont été enregistrés avec succès",
      });

      // Réinitialiser le formulaire
      setSymptoms({
        douleur: 0,
        dyspnee: 0,
        anxiete: 0,
        fatigue: 0,
        appetit: 0,
        nausees: 0,
      });
      setRemarque("");

    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos symptômes",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getColorForValue = (value: number) => {
    if (value <= 3) return "text-green-600";
    if (value <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const symptomLabels = {
    douleur: "Douleur",
    dyspnee: "Dyspnée (difficulté à respirer)",
    anxiete: "Anxiété",
    fatigue: "Fatigue",
    appetit: "Perte d'appétit",
    nausees: "Nausées"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Évaluation des symptômes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.entries(symptoms).map(([symptom, value]) => (
            <div key={symptom} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={symptom} className="text-sm font-medium">
                  {symptomLabels[symptom as keyof typeof symptomLabels]}
                </Label>
                <span className={`text-sm font-bold ${getColorForValue(value)}`}>
                  {value}/10
                </span>
              </div>
              <Slider
                id={symptom}
                min={0}
                max={10}
                step={1}
                value={[value]}
                onValueChange={(newValue) => handleSymptomChange(symptom, newValue)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Aucun</span>
                <span>Modéré</span>
                <span>Sévère</span>
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="remarque" className="text-sm font-medium">
              Remarques (optionnel)
            </Label>
            <Textarea
              id="remarque"
              placeholder="Ajoutez des détails sur votre état, vos symptômes ou votre ressenti..."
              value={remarque}
              onChange={(e) => setRemarque(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SymptomForm;
