
import { Badge } from "@/components/ui/badge";
import { Calendar, User, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface SymptomEntry {
  id: string;
  douleur: number;
  dyspnee: number;
  anxiete: number;
  remarque: string | null;
  auteur: string;
  created_at: string;
  patient_id: string;
}

interface SymptomHistoryCardProps {
  symptom: SymptomEntry;
}

export default function SymptomHistoryCard({ symptom }: SymptomHistoryCardProps) {
  const getSeverityBadge = (value: number, type: "douleur" | "dyspnee" | "anxiete") => {
    let color = "bg-gray-100 text-gray-800";
    let label = "Aucun";

    if (value > 0 && value <= 3) {
      color = "bg-green-100 text-green-800";
      label = "Léger";
    } else if (value > 3 && value <= 6) {
      color = "bg-yellow-100 text-yellow-800";
      label = "Modéré";
    } else if (value > 6) {
      color = "bg-red-100 text-red-800";
      label = "Sévère";
    }

    const typeLabels = {
      douleur: "Douleur",
      dyspnee: "Dyspnée",
      anxiete: "Anxiété"
    };

    return (
      <Badge className={color}>
        {typeLabels[type]}: {value}/10 ({label})
      </Badge>
    );
  };

  const isCriticalSymptom = (symptom: SymptomEntry) => {
    return symptom.douleur >= 8 || symptom.dyspnee >= 7 || symptom.anxiete >= 8;
  };

  return (
    <div
      className={`border rounded-lg p-4 ${
        isCriticalSymptom(symptom) 
          ? 'border-red-200 bg-red-50' 
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          {formatDistanceToNow(new Date(symptom.created_at), { 
            addSuffix: true, 
            locale: fr 
          })}
        </div>
        <div className="flex items-center gap-2">
          {isCriticalSymptom(symptom) && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Critique
            </Badge>
          )}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <User className="h-4 w-4" />
            {symptom.auteur}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {getSeverityBadge(symptom.douleur, "douleur")}
        {getSeverityBadge(symptom.dyspnee, "dyspnee")}
        {getSeverityBadge(symptom.anxiete, "anxiete")}
      </div>

      {symptom.remarque && (
        <div className="bg-gray-50 rounded p-3 text-sm">
          <strong>Remarques:</strong> {symptom.remarque}
        </div>
      )}
    </div>
  );
}
