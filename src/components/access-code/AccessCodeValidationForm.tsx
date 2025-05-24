
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Shield } from "lucide-react";
import { useUnifiedAccessCode } from "@/hooks/useUnifiedAccessCode";
import type { PersonalInfo } from "@/types/accessCode";

interface AccessCodeValidationFormProps {
  onValidationSuccess?: (documents: any[]) => void;
}

/**
 * Formulaire unifié pour valider n'importe quel code d'accès
 */
export const AccessCodeValidationForm: React.FC<AccessCodeValidationFormProps> = ({
  onValidationSuccess
}) => {
  const { isValidating, validateCode } = useUnifiedAccessCode();
  const [formData, setFormData] = useState({
    accessCode: "",
    firstName: "",
    lastName: "",
    birthDate: ""
  });
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const personalInfo: PersonalInfo | undefined = 
      formData.firstName && formData.lastName ? {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate
      } : undefined;

    const result = await validateCode(formData.accessCode, personalInfo);
    setValidationResult(result);
    
    if (result.success && result.documents && onValidationSuccess) {
      onValidationSuccess(result.documents);
    }
  };

  const resetForm = () => {
    setFormData({
      accessCode: "",
      firstName: "",
      lastName: "",
      birthDate: ""
    });
    setValidationResult(null);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Validation de code d'accès
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accessCode">Code d'accès</Label>
            <Input
              id="accessCode"
              name="accessCode"
              value={formData.accessCode}
              onChange={handleChange}
              placeholder="Saisissez le code d'accès"
              required
            />
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Optionnel :</strong> Pour certains codes, les informations personnelles 
              peuvent être requises pour renforcer la sécurité.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nom de famille (optionnel)</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="NOM"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom (optionnel)</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Prénom"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Date de naissance (optionnel)</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isValidating || !formData.accessCode}
          >
            {isValidating ? "Validation en cours..." : "Valider le code"}
          </Button>
        </form>

        {validationResult && (
          <div className="mt-4">
            <Alert variant={validationResult.success ? "default" : "destructive"} 
                   className={validationResult.success ? "bg-green-50 border-green-200" : ""}>
              {validationResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <AlertDescription className={validationResult.success ? "text-green-800" : ""}>
                {validationResult.message || validationResult.error}
                {validationResult.success && validationResult.documents && (
                  <div className="mt-2">
                    <strong>{validationResult.documents.length} document(s) accessible(s)</strong>
                  </div>
                )}
              </AlertDescription>
            </Alert>

            {validationResult.success && (
              <Button 
                onClick={resetForm}
                variant="outline"
                className="w-full mt-2"
              >
                Nouvelle validation
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
