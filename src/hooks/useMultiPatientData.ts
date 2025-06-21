
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  created_at: string;
}

interface SymptomEntry {
  id: string;
  douleur: number;
  dyspnee: number;
  anxiete: number;
  fatigue: number;
  sommeil: number;
  remarque: string | null;
  auteur: string;
  created_at: string;
  patient_id: string;
}

export const useMultiPatientData = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, birth_date, created_at")
        .not("first_name", "is", null)
        .not("last_name", "is", null)
        .not("birth_date", "is", null);

      if (error) {
        console.error("Erreur lors du chargement des patients:", error);
        setError("Erreur lors du chargement des patients");
      } else {
        const transformedPatients: Patient[] = (data || []).map(profile => ({
          id: profile.id,
          nom: profile.last_name || '',
          prenom: profile.first_name || '',
          date_naissance: profile.birth_date || '',
          created_at: profile.created_at || ''
        }));
        setPatients(transformedPatients);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur inattendue");
    }
  };

  const fetchSymptoms = async (patientId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("symptom_tracking")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement des symptômes:", error);
        setError("Erreur lors du chargement des symptômes");
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

  return {
    patients,
    selectedPatient,
    setSelectedPatient,
    symptoms,
    loading,
    error,
    fetchPatients,
    fetchSymptoms
  };
};
