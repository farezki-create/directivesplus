
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useSymptomAlerting } from "@/hooks/useSymptomAlerting";

interface SymptomValues {
  douleur: number;
  dyspnee: number;
  anxiete: number;
  fatigue: number;
  sommeil: number;
}

export const useSymptomForm = () => {
  const { user } = useAuth();
  const { checkAndTriggerAlert, showAlertDialog, alerting } = useSymptomAlerting();
  
  const [symptoms, setSymptoms] = useState<SymptomValues>({
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

  const resetForm = () => {
    setSymptoms({
      douleur: 0,
      dyspnee: 0,
      anxiete: 0,
      fatigue: 0,
      sommeil: 0
    });
    setRemarque("");
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
      const symptomData = {
        patient_id: user.id,
        douleur: Number(symptoms.douleur),
        dyspnee: Number(symptoms.dyspnee),
        anxiete: Number(symptoms.anxiete),
        fatigue: Number(symptoms.fatigue),
        sommeil: Number(symptoms.sommeil),
        remarque: remarque || null,
        auteur: user.email || "patient"
      };

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

      toast({
        title: "Symptômes enregistrés",
        description: "Vos symptômes ont été sauvegardés avec succès"
      });

      // Vérifier et déclencher les alertes APRÈS l'enregistrement réussi
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
        toast({
          title: "Alerte non envoyée",
          description: "Les symptômes sont enregistrés mais l'alerte n'a pas pu être envoyée",
          variant: "destructive"
        });
      }

      resetForm();

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

  return {
    symptoms,
    remarque,
    saving,
    alerting,
    setRemarque,
    handleSymptomChange,
    handleSave
  };
};
