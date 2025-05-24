
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Search, AlertTriangle } from "lucide-react";

interface SharedDocumentErrorProps {
  error: string;
  shareCode?: string;
}

export const SharedDocumentError: React.FC<SharedDocumentErrorProps> = ({ 
  error, 
  shareCode 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            Document non disponible
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{error}</p>
          
          {shareCode && (
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Code recherché:</strong> 
                <span className="font-mono bg-white px-2 py-1 rounded ml-2">
                  {shareCode}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Longueur: {shareCode.length} caractères
              </p>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Search size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Diagnostic en cours</span>
            </div>
            <p className="text-xs text-blue-700">
              Vérifiez la console (F12) pour voir les détails du diagnostic automatique.
              Les logs montrent tous les documents partagés disponibles et les tentatives de correspondance.
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>Suggestions:</strong>
            </p>
            <ul className="text-xs text-yellow-700 mt-1 space-y-1">
              <li>• Vérifiez que le lien de partage est complet</li>
              <li>• Le document n'a peut-être pas expiré</li>
              <li>• Contactez la personne qui a partagé le document</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
