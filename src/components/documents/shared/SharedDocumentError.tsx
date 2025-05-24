
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface SharedDocumentErrorProps {
  error: string;
  shareCode?: string;
}

export const SharedDocumentError: React.FC<SharedDocumentErrorProps> = ({ 
  error, 
  shareCode 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Lock size={20} />
            Debug - Document non trouvé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{error}</p>
          {shareCode && (
            <p className="text-sm text-gray-500 mb-4">
              Code recherché: <strong>{shareCode}</strong>
            </p>
          )}
          <p className="text-xs text-gray-400">
            Mode debug actif - toutes les sécurités sont désactivées.
            Vérifiez les logs de la console pour plus de détails.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
