
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, User } from "lucide-react";
import { useSymptomHistory } from "@/hooks/useSymptomHistory";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface SymptomHistoryProps {
  patientId?: string;
}

export default function SymptomHistory({ patientId }: SymptomHistoryProps) {
  const { symptoms, loading, error, deleteSymptom } = useSymptomHistory(patientId);

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

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?")) {
      await deleteSymptom(id);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Chargement de l'historique...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">Erreur: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Historique des Symptômes
        </CardTitle>
        <CardDescription>
          Vos dernières évaluations de symptômes
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {symptoms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune évaluation de symptômes enregistrée
          </div>
        ) : (
          <div className="space-y-4">
            {symptoms.map((symptom) => (
              <div key={symptom.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(new Date(symptom.created_at), { 
                      addSuffix: true, 
                      locale: fr 
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      {symptom.auteur}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(symptom.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
