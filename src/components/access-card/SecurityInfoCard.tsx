
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, Clock, Users } from "lucide-react";

export const SecurityInfoCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Sécurité et utilisation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Validité 12 mois</h4>
              <p className="text-sm text-gray-600">
                Le code d'accès est valable pendant 12 mois à partir de sa génération.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Accès professionnel</h4>
              <p className="text-sm text-gray-600">
                Réservé aux professionnels de santé et institutions médicales autorisées.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Traçabilité</h4>
              <p className="text-sm text-gray-600">
                Tous les accès sont journalisés pour garantir la sécurité de vos données.
              </p>
            </div>
          </div>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Révocation :</strong> Vous pouvez révoquer l'accès à tout moment 
            en générant un nouveau code. L'ancien code sera automatiquement désactivé.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
