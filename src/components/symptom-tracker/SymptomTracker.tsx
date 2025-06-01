
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSymptomAlerts } from "@/hooks/useSymptomAlerts";

interface SymptomTrackerProps {
  patientId?: string;
}

export default function SymptomTracker({ patientId }: SymptomTrackerProps) {
  const { user } = useAuth();
  const { checkAndCreateAlert, alerting } = useSymptomAlerts();
  const [douleur, setDouleur] = useState([0]);
  const [dyspnee, setDyspnee] = useState([0]);
  const [anxiete, setAnxiete] = useState([0]);
  const [remarque, setRemarque] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "warning" | null>(null);

  // Utiliser l'ID utilisateur connecté si patientId n'est pas fourni
  const currentPatientId = patientId || user?.id;

  const handleSubmit = async () => {
    if (!currentPatientId) {
      setMessage("Erreur: Utilisateur non connecté");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType(null);

    try {
      const { error } = await supabase.from("symptom_tracking").insert({
        patient_id: currentPatientId,
        douleur: douleur[0],
        dyspnee: dyspnee[0],
        anxiete: anxiete[0],
        remarque: remarque.trim() || null,
        auteur: user?.email || "patient"
      });

      if (error) {
        console.error("Erreur Supabase:", error);
        setMessage("Erreur lors de l'enregistrement: " + error.message);
        setMessageType("error");
      } else {
        // Vérifier et créer des alertes si nécessaire
        const alertCreated = await checkAndCreateAlert(douleur[0], dyspnee[0], anxiete[0]);
        
        if (alertCreated) {
          setMessage("Symptômes enregistrés avec succès ! Une alerte a été envoyée à l'équipe soignante en raison de valeurs critiques.");
          setMessageType("warning");
        } else {
          setMessage("Symptômes enregistrés avec succès !");
          setMessageType("success");
        }
        
        // Réinitialiser le formulaire
        setRemarque("");
        setDouleur([0]);
        setDyspnee([0]);
        setAnxiete([0]);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Erreur inattendue lors de l'enregistrement");
      setMessageType("error");
    }

    setLoading(false);
  };

  const getSeverityColor = (value: number) => {
    if (value <= 3) return "text-green-600";
    if (value <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getSeverityLabel = (value: number) => {
    if (value === 0) return "Aucun";
    if (value <= 3) return "Léger";
    if (value <= 6) return "Modéré";
    return "Sévère";
  };

  const isCriticalValue = (value: number, type: "douleur" | "dyspnee" | "anxiete") => {
    if (type === "douleur" && value >= 8) return true;
    if (type === "dyspnee" && value >= 7) return true;
    if (type === "anxiete" && value >= 8) return true;
    return false;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📊</span>
          Suivi des Symptômes
        </CardTitle>
        <CardDescription>
          Évaluez vos symptômes sur une échelle de 0 à 10
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Douleur */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-base font-medium flex items-center gap-2">
              Douleur
              {isCriticalValue(douleur[0], "douleur") && (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </Label>
            <span className={`font-semibold ${getSeverityColor(douleur[0])}`}>
              {douleur[0]}/10 - {getSeverityLabel(douleur[0])}
            </span>
          </div>
          <Slider
            min={0}
            max={10}
            step={1}
            value={douleur}
            onValueChange={setDouleur}
            className="w-full"
          />
          {isCriticalValue(douleur[0], "douleur") && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Niveau de douleur critique détecté. Une alerte sera envoyée à l'équipe soignante.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Dyspnée */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-base font-medium flex items-center gap-2">
              Dyspnée (Essoufflement)
              {isCriticalValue(dyspnee[0], "dyspnee") && (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </Label>
            <span className={`font-semibold ${getSeverityColor(dyspnee[0])}`}>
              {dyspnee[0]}/10 - {getSeverityLabel(dyspnee[0])}
            </span>
          </div>
          <Slider
            min={0}
            max={10}
            step={1}
            value={dyspnee}
            onValueChange={setDyspnee}
            className="w-full"
          />
          {isCriticalValue(dyspnee[0], "dyspnee") && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Niveau de dyspnée critique détecté. Une alerte sera envoyée à l'équipe soignante.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Anxiété */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-base font-medium flex items-center gap-2">
              Anxiété
              {isCriticalValue(anxiete[0], "anxiete") && (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </Label>
            <span className={`font-semibold ${getSeverityColor(anxiete[0])}`}>
              {anxiete[0]}/10 - {getSeverityLabel(anxiete[0])}
            </span>
          </div>
          <Slider
            min={0}
            max={10}
            step={1}
            value={anxiete}
            onValueChange={setAnxiete}
            className="w-full"
          />
          {isCriticalValue(anxiete[0], "anxiete") && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Niveau d'anxiété critique détecté. Une alerte sera envoyée à l'équipe soignante.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Remarque */}
        <div className="space-y-2">
          <Label htmlFor="remarque" className="text-base font-medium">
            Remarques ou commentaires
          </Label>
          <Textarea
            id="remarque"
            value={remarque}
            onChange={(e) => setRemarque(e.target.value)}
            placeholder="Décrivez vos symptômes ou ajoutez des détails..."
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Message de retour */}
        {message && (
          <Alert className={
            messageType === "success" 
              ? "border-green-200 bg-green-50" 
              : messageType === "warning"
              ? "border-orange-200 bg-orange-50"
              : "border-red-200 bg-red-50"
          }>
            {messageType === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : messageType === "warning" ? (
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={
              messageType === "success" 
                ? "text-green-800" 
                : messageType === "warning"
                ? "text-orange-800"
                : "text-red-800"
            }>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Bouton d'enregistrement */}
        <Button 
          onClick={handleSubmit} 
          disabled={loading || alerting || !currentPatientId}
          className="w-full"
          size="lg"
        >
          {loading || alerting ? "Enregistrement..." : "Enregistrer les symptômes"}
        </Button>

        {!currentPatientId && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Vous devez être connecté pour enregistrer vos symptômes.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
