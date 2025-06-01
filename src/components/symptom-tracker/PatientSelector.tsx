
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  created_at: string;
}

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onPatientSelect: (patient: Patient | null) => void;
  symptoms?: any[];
}

export default function PatientSelector({ 
  patients, 
  selectedPatient, 
  onPatientSelect,
  symptoms = []
}: PatientSelectorProps) {
  
  const getPatientCriticalStatus = (patientId: string) => {
    if (!symptoms || symptoms.length === 0) return false;
    
    // Vérifier le dernier symptôme de ce patient
    const patientSymptoms = symptoms.filter(s => s.patient_id === patientId);
    if (patientSymptoms.length === 0) return false;
    
    const lastSymptom = patientSymptoms[0]; // Les symptômes sont triés par date DESC
    return lastSymptom.douleur >= 8 || lastSymptom.dyspnee >= 7 || lastSymptom.anxiete >= 8;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Sélection du Patient
        </CardTitle>
        <CardDescription>
          Choisissez un patient pour consulter son historique de symptômes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedPatient?.id || ""}
          onValueChange={(value) => {
            const patient = patients.find(p => p.id === value);
            onPatientSelect(patient || null);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="-- Sélectionner un patient --" />
          </SelectTrigger>
          <SelectContent>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{patient.prenom} {patient.nom} ({patient.date_naissance})</span>
                  {getPatientCriticalStatus(patient.id) && (
                    <Badge variant="destructive" className="ml-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      🔥
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
