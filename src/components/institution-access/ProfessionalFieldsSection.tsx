
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCheck, Shield, ExternalLink } from "lucide-react";

interface ProfessionalFieldsSectionProps {
  formData: {
    rpps: string;
    finess: string;
    adeli: string;
    prosanteConnect: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
  onProsanteConnect: () => void;
}

export const ProfessionalFieldsSection: React.FC<ProfessionalFieldsSectionProps> = ({
  formData,
  onChange,
  onProsanteConnect
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow numbers for professional IDs
    const numericValue = value.replace(/[^0-9]/g, '');
    onChange(name, numericValue);
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <UserCheck className="h-5 w-5" />
          Identification Professionnelle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-blue-200 bg-blue-100">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Saisissez votre numéro d'identification professionnel pour un accès sécurisé
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rpps">Numéro RPPS</Label>
            <Input
              id="rpps"
              name="rpps"
              value={formData.rpps}
              onChange={handleInputChange}
              placeholder="11 chiffres"
              maxLength={11}
              autoComplete="off"
            />
            <p className="text-xs text-gray-600">Répertoire Partagé des Professionnels de Santé</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adeli">Numéro ADELI</Label>
            <Input
              id="adeli"
              name="adeli"
              value={formData.adeli}
              onChange={handleInputChange}
              placeholder="9 chiffres"
              maxLength={9}
              autoComplete="off"
            />
            <p className="text-xs text-gray-600">Automatisation DEs LIstes</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="finess">Numéro FINESS</Label>
            <Input
              id="finess"
              name="finess"
              value={formData.finess}
              onChange={handleInputChange}
              placeholder="9 chiffres"
              maxLength={9}
              autoComplete="off"
            />
            <p className="text-xs text-gray-600">Fichier National des Établissements</p>
          </div>

          <div className="space-y-2">
            <Label>ProSanté Connect</Label>
            <Button
              type="button"
              onClick={onProsanteConnect}
              variant="outline"
              className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Se connecter via ProSanté Connect
            </Button>
            <p className="text-xs text-gray-600">Authentification nationale sécurisée</p>
          </div>
        </div>

        <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
          <strong>Note :</strong> L'identification professionnelle permet de tracer les accès 
          et garantit la sécurité des données médicales selon les exigences HDS.
        </div>
      </CardContent>
    </Card>
  );
};
