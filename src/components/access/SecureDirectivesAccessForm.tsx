
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Info } from "lucide-react";

const SecureDirectivesAccessForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    accessCode: ''
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
      // TODO: Implémenter la vérification sécurisée
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.firstName && formData.lastName && 
                     formData.birthDate && formData.accessCode;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Accès Sécurisé aux Directives
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Formulaire d'accès sécurisé temporairement simplifié.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessCode">Code d'accès sécurisé</Label>
            <Input id="accessCode" name="accessCode" value={formData.accessCode} onChange={handleChange} placeholder="Code d'accès" required disabled={isLoading} />
          </div>
          <Button type="submit" className="w-full" disabled={!isFormValid || isLoading}>
            {isLoading ? "Vérification sécurisée..." : "Accès sécurisé"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecureDirectivesAccessForm;
