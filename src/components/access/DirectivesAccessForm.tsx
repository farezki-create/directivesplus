
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface DirectivesAccessFormProps {
  onSubmit: (accessCode: string, formData: any) => void;
}

export const DirectivesAccessForm: React.FC<DirectivesAccessFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    accessCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
    
    try {
      await onSubmit(formData.accessCode, formData);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.firstName && formData.lastName && 
                     formData.birthDate && formData.accessCode;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Accès aux Directives Anticipées</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Saisissez vos informations et votre code d'accès pour consulter vos directives.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessCode">Code d'accès</Label>
            <Input
              id="accessCode"
              name="accessCode"
              value={formData.accessCode}
              onChange={handleChange}
              placeholder="Votre code d'accès"
              required
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Vérification..." : "Accéder aux directives"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DirectivesAccessForm;
