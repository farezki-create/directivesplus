
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { InstitutionForm } from "./InstitutionForm";

export const InstitutionAccessFormComplete: React.FC = () => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    birthDate: '',
    institutionCode: '',
    professionalId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Logique simplifiée pour l'instant
      console.log("Données du formulaire:", formData);
      // TODO: Implémenter la vérification du code d'accès
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.lastName && formData.firstName && 
                     formData.birthDate && formData.institutionCode && 
                     formData.professionalId;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Accès Professionnel aux Directives</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Accès temporairement simplifié suite au nettoyage de l'authentification.
          </AlertDescription>
        </Alert>
        
        <InstitutionForm
          formData={formData}
          isFormValid={Boolean(isFormValid)}
          isLoading={isLoading}
          error={error}
          onSubmit={handleSubmit}
          onChange={handleChange}
        />
      </CardContent>
    </Card>
  );
};
