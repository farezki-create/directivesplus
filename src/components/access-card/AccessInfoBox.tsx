
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Key, Hospital } from "lucide-react";

const AccessInfoBox = () => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Informations importantes sur l'accès professionnel
        </h3>
        
        <div className="space-y-4 text-sm text-blue-700">
          <div className="flex items-start gap-3">
            <Key className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Code sécurisé</p>
              <p>Le code d'accès institution permet aux professionnels de santé autorisés d'accéder à vos directives anticipées de manière sécurisée.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Validité limitée</p>
              <p>Chaque code est valable pendant 30 jours maximum et peut être révoqué à tout moment.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Hospital className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Usage professionnel</p>
              <p>Ne partagez ce code qu'avec des professionnels de santé de confiance dans un cadre médical approprié.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded-md">
          <p className="text-xs text-blue-800">
            <strong>Traçabilité :</strong> Tous les accès via ce code sont journalisés pour des raisons de sécurité et de conformité réglementaire.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessInfoBox;
