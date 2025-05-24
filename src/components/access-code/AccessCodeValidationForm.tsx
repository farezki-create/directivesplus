
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Shield } from "lucide-react";

interface AccessCodeValidationFormProps {
  onValidationSuccess?: (documents: any[]) => void;
}

export const AccessCodeValidationForm: React.FC<AccessCodeValidationFormProps> = ({
  onValidationSuccess
}) => {
  const [formData, setFormData] = useState({
    accessCode: "",
    firstName: "",
    lastName: "",
    birthDate: ""
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    
    // Simulation de validation
    setTimeout(() => {
      setValidationResult({
        success: false,
        message: "Fonctionnalité temporairement désactivée"
      });
      setIsValidating(false);
    }, 1000);
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
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Cette fonctionnalité a été temporairement désactivée pour simplification.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accessCode">Code d'accès</Label>
            <Input
              id="accessCode"
              name="accessCode"
              value={formData.accessCode}
              onChange={handleChange}
              placeholder="Saisissez le code d'accès"
              disabled
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={true}
          >
            Validation désactivée
          </Button>
        </form>

        {validationResult && (
          <div className="mt-4">
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>
                {validationResult.message}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
