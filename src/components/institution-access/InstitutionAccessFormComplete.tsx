
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, Shield, CheckCircle } from "lucide-react";
import { useInstitutionCodeAccess } from "@/hooks/useInstitutionCodeAccess";

export const InstitutionAccessFormComplete: React.FC = () => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    birthDate: "",
    institutionCode: ""
  });
  const [submitted, setSubmitted] = useState(false);

  // Utiliser le hook d'accès institution
  const institutionAccess = useInstitutionCodeAccess(
    submitted ? formData.institutionCode : null,
    submitted ? formData.lastName : null,
    submitted ? formData.firstName : null,
    submitted ? formData.birthDate : null,
    submitted && formData.lastName && formData.firstName && formData.birthDate && formData.institutionCode
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const isFormValid = formData.lastName && formData.firstName && formData.birthDate && formData.institutionCode;

  // Si l'accès est accordé, afficher un message de succès
  if (institutionAccess.accessGranted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Accès autorisé
          </h3>
          <p className="text-green-700 mb-4">
            Vous avez maintenant accès aux directives anticipées du patient.
          </p>
          <p className="text-sm text-green-600">
            Les directives sont maintenant consultables dans l'interface.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Accès sécurisé pour professionnels de santé</strong><br />
          Toutes les consultations sont tracées et sécurisées conformément à la réglementation.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom de famille du patient</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="NOM"
            required
            disabled={institutionAccess.loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom du patient</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Prénom"
            required
            disabled={institutionAccess.loading}
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
            disabled={institutionAccess.loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="institutionCode">Code d'accès institution</Label>
          <Input
            id="institutionCode"
            name="institutionCode"
            value={formData.institutionCode}
            onChange={handleChange}
            placeholder="Code fourni par le patient"
            required
            disabled={institutionAccess.loading}
          />
        </div>

        {institutionAccess.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {institutionAccess.error}
            </AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={!isFormValid || institutionAccess.loading}
        >
          {institutionAccess.loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification en cours...
            </>
          ) : (
            "Accéder aux directives"
          )}
        </Button>
      </form>

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Information :</strong> Le code d'accès vous est fourni par le patient.</p>
        <p><strong>Sécurité :</strong> Vérification complète de l'identité requise.</p>
        <p><strong>Conformité :</strong> Accès tracé selon les exigences réglementaires.</p>
      </div>
    </div>
  );
};
