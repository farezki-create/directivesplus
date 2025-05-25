
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, Shield, CheckCircle, FileText, Eye } from "lucide-react";
import { useInstitutionCodeAccess } from "@/hooks/useInstitutionCodeAccess";
import { useNavigate } from "react-router-dom";

export const InstitutionAccessFormComplete: React.FC = () => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    birthDate: "",
    institutionCode: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Utiliser le hook d'accès institution
  const institutionAccess = useInstitutionCodeAccess(
    submitted ? formData.institutionCode : null,
    submitted ? formData.lastName : null,
    submitted ? formData.firstName : null,
    submitted ? formData.birthDate : null,
    Boolean(submitted && formData.lastName && formData.firstName && formData.birthDate && formData.institutionCode)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleViewDirectives = () => {
    // Naviguer vers la page de consultation des directives
    navigate("/directives-acces");
  };

  const isFormValid = formData.lastName && formData.firstName && formData.birthDate && formData.institutionCode;

  // Si l'accès est accordé, afficher les options de consultation
  if (institutionAccess.accessGranted) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Accès autorisé
            </h3>
            <p className="text-green-700 mb-4">
              Vous avez maintenant accès aux directives anticipées de{" "}
              <strong>
                {institutionAccess.patientData?.first_name}{" "}
                {institutionAccess.patientData?.last_name}
              </strong>
            </p>
            
            <div className="flex flex-col gap-3 mt-6">
              <Button 
                onClick={handleViewDirectives}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Eye className="mr-2 h-5 w-5" />
                Consulter les directives
              </Button>
              
              <Button 
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    lastName: "",
                    firstName: "",
                    birthDate: "",
                    institutionCode: ""
                  });
                }}
                variant="outline"
                size="sm"
              >
                Nouvel accès
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informations sur les données accessibles */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Données accessibles</h4>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Directives anticipées du patient</li>
              <li>• Documents associés (si disponibles)</li>
              <li>• Informations de contact des personnes de confiance</li>
            </ul>
          </CardContent>
        </Card>
      </div>
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
