
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle } from "lucide-react";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
}

interface SharedSymptomAccessFormProps {
  shareCode: string;
  onAccessGranted: (patient: Patient) => void;
}

export default function SharedSymptomAccessForm({ 
  shareCode, 
  onAccessGranted 
}: SharedSymptomAccessFormProps) {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    birthDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: verifyError } = await supabase
        .rpc('verify_symptom_shared_access', {
          input_access_code: shareCode,
          input_last_name: formData.lastName,
          input_first_name: formData.firstName,
          input_birth_date: formData.birthDate
        });

      if (verifyError) {
        console.error("Erreur lors de la vérification:", verifyError);
        setError("Erreur lors de la vérification de l'accès");
        return;
      }

      const result = data?.[0];
      if (!result || !result.access_granted) {
        setError("Accès refusé. Vérifiez les informations saisies.");
        return;
      }

      // Log successful access
      await supabase.from("symptom_access_logs").insert({
        patient_id: result.patient_id,
        access_code: shareCode,
        accessor_name: formData.lastName,
        accessor_first_name: formData.firstName,
        accessor_birth_date: formData.birthDate,
        success: true
      });

      onAccessGranted({
        id: result.patient_id,
        first_name: result.patient_info.first_name,
        last_name: result.patient_info.last_name,
        birth_date: result.patient_info.birth_date
      });

    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur inattendue lors de la vérification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Vérification d'identité
        </CardTitle>
        <CardDescription>
          Pour accéder au suivi de symptômes, veuillez confirmer l'identité du patient
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom de famille du patient</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom du patient</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Date de naissance du patient</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Vérification..." : "Accéder au suivi"}
          </Button>
        </form>

        <Alert className="mt-4 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Accès sécurisé :</strong> Ces informations sont vérifiées pour garantir 
            que seuls les professionnels autorisés accèdent aux données médicales.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
