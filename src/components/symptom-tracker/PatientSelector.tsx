
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

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
}

export default function PatientSelector({ patients, selectedPatient, onPatientSelect }: PatientSelectorProps) {
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
                {patient.prenom} {patient.nom} ({patient.date_naissance})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
