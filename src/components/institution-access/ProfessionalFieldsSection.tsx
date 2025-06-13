
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, ExternalLink } from "lucide-react";

interface ProfessionalFieldsSectionProps {
  formData: {
    rpps?: string;
    finess?: string;
    adeli?: string;
    prosanteConnect?: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
  onProsanteConnect: () => void;
}

export const ProfessionalFieldsSection: React.FC<ProfessionalFieldsSectionProps> = ({
  formData,
  onChange,
  onProsanteConnect
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Identification Professionnelle
        </h3>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="rpps">Numéro RPPS (Répertoire Partagé des Professionnels de Santé)</Label>
            <Input
              id="rpps"
              value={formData.rpps || ''}
              onChange={(e) => onChange('rpps', e.target.value)}
              placeholder="11 chiffres (ex: 12345678901)"
              maxLength={11}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <p className="text-xs text-gray-500">Pour médecins, pharmaciens, dentistes...</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adeli">Numéro ADELI (Automatisation DEs LIstes)</Label>
            <Input
              id="adeli"
              value={formData.adeli || ''}
              onChange={(e) => onChange('adeli', e.target.value)}
              placeholder="9 chiffres (ex: 123456789)"
              maxLength={9}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <p className="text-xs text-gray-500">Pour infirmiers, kinésithérapeutes, psychologues...</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="finess">Numéro FINESS (Établissement)</Label>
            <Input
              id="finess"
              value={formData.finess || ''}
              onChange={(e) => onChange('finess', e.target.value)}
              placeholder="9 chiffres (ex: 123456789)"
              maxLength={9}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <p className="text-xs text-gray-500">Pour établissements de santé, EHPAD...</p>
          </div>
        </div>
      </div>

      {/* Connexion ProSanté Connect */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-green-800 mb-2">Connexion ProSanté Connect</h3>
            <p className="text-sm text-green-700">
              Authentification sécurisée via votre compte professionnel de santé
            </p>
          </div>
          <Button 
            onClick={onProsanteConnect}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Se connecter
          </Button>
        </div>
      </div>

      <Alert className="bg-yellow-50 border-yellow-200">
        <Shield className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Information :</strong> Au moins un numéro d'identification professionnel est requis pour l'accès aux directives anticipées. ProSanté Connect est la méthode d'authentification recommandée.
        </AlertDescription>
      </Alert>
    </div>
  );
};
