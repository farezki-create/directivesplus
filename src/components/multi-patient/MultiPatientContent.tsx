
import PatientSelector from "@/components/symptom-tracker/PatientSelector";
import PatientSymptomsDashboard from "@/components/symptom-tracker/PatientSymptomsDashboard";
import MultiPatientHeader from "./MultiPatientHeader";

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

interface MultiPatientContentProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  symptoms: SymptomEntry[];
  loading: boolean;
  error: string | null;
  onPatientSelect: (patient: Patient | null) => void;
}

export default function MultiPatientContent({
  patients,
  selectedPatient,
  symptoms,
  loading,
  error,
  onPatientSelect
}: MultiPatientContentProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <MultiPatientHeader />

      {/* Sélecteur de patient avec alertes */}
      <PatientSelector 
        patients={patients}
        selectedPatient={selectedPatient}
        onPatientSelect={onPatientSelect}
        symptoms={symptoms}
      />

      {/* Affichage des symptômes avec alertes critiques */}
      {selectedPatient && (
        <PatientSymptomsDashboard
          selectedPatient={selectedPatient}
          symptoms={symptoms}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}
