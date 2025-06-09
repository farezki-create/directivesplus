
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SymptomEntry {
  id: string;
  douleur: number;
  dyspnee: number;
  anxiete: number;
  fatigue: number;
  appetit: number;
  nausees: number;
  remarque: string | null;
  auteur: string;
  created_at: string;
  updated_at: string;
}

export const useSymptomHistory = (patientId?: string) => {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPatientId = patientId || user?.id;

  const fetchSymptoms = async () => {
    if (!currentPatientId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("symptom_tracking")
        .select("*")
        .eq("patient_id", currentPatientId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (fetchError) {
        console.error("Erreur lors du chargement des symptômes:", fetchError);
        setError("Erreur lors du chargement des données");
      } else {
        setSymptoms(data || []);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, [currentPatientId]);

  const deleteSymptom = async (id: string) => {
    try {
      const { error } = await supabase
        .from("symptom_tracking")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erreur lors de la suppression:", error);
        return false;
      }

      // Mettre à jour la liste locale
      setSymptoms(prev => prev.filter(s => s.id !== id));
      return true;
    } catch (err) {
      console.error("Erreur:", err);
      return false;
    }
  };

  return {
    symptoms,
    loading,
    error,
    refetch: fetchSymptoms,
    deleteSymptom
  };
};
