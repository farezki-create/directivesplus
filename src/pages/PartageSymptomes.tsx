
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Shield, AlertCircle } from "lucide-react";
import { usePalliativeCareAccess } from "@/hooks/usePalliativeCareAccess";
import SharedSymptomDashboard from "@/components/symptom-tracker/SharedSymptomDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
}

const PartageSymptomes = () => {
  const [searchParams] = useSearchParams();
  const prefilledCode = searchParams.get('code') || '';
  
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    birthDate: "",
    accessCode: prefilledCode
  });
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const { verifyAccess, loading, error } = usePalliativeCareAccess();

  const { data: symptoms = [], isLoading: symptomsLoading, error: symptomsError } = useQuery({
    queryKey: ['shared-symptoms', patient?.id],
    queryFn: async () => {
      if (!patient?.id) return [];
      
      const { data, error } = await supabase
        .from('symptomes')
        .select('*')
        .eq('patient_id', patient.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!patient?.id
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await verifyAccess(
      formData.lastName,
      formData.firstName,
      formData.birthDate,
      formData.accessCode
    );
    
    if (result) {
      setPatient({
        id: result.id,
        name: result.name,
        date_of_birth: result.date_of_birth
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="h-8 w-8 text-pink-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Suivi des Symptômes Palliatifs
                </h1>
              </div>
              <p className="text-lg text-gray-600">
                Accès professionnel sécurisé au suivi des symptômes
              </p>
            </div>

            <div className="space-y-6">
              <SharedSymptomDashboard
                patient={{
                  id: patient.id,
                  first_name: patient.name.split(' ')[0] || '',
                  last_name: patient.name.split(' ').slice(1).join(' ') || '',
                  birth_date: patient.date_of_birth
                }}
                symptoms={symptoms.map(s => ({
                  id: s.id,
                  douleur: s.severity || 0,
                  dyspnee: 0,
                  anxiete: 0,
                  remarque: null,
                  auteur: 'patient',
                  created_at: s.created_at,
                  patient_id: s.patient_id
                }))}
                loading={symptomsLoading}
                error={symptomsError?.message || null}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-pink-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Accès Suivi Palliatif
              </h1>
            </div>
            <p className="text-gray-600">
              Accès professionnel sécurisé
            </p>
          </div>

          <Card className="shadow-lg border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-800">
                <Shield className="h-5 w-5" />
                Vérification d'identité du patient
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <Alert className="mb-6 border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Pour accéder au suivi des symptômes, veuillez confirmer 
                  l'identité du patient et saisir le code d'accès fourni.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom de famille du patient</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="NOM"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom du patient</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Prénom"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date de naissance du patient</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessCode">Code d'accès</Label>
                  <Input
                    id="accessCode"
                    name="accessCode"
                    type="text"
                    value={formData.accessCode}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Code fourni par le patient"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  disabled={loading}
                >
                  {loading ? "Vérification..." : "Accéder au suivi"}
                </Button>
              </form>

              <Alert className="mt-4 border-pink-200 bg-pink-50">
                <Heart className="h-4 w-4 text-pink-600" />
                <AlertDescription className="text-pink-800">
                  <strong>Accès sécurisé :</strong> Ces informations sont vérifiées 
                  pour garantir que seuls les professionnels autorisés accèdent 
                  aux données de suivi palliatif.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartageSymptomes;
