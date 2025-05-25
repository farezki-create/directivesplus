
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const AccessibleDataCard: React.FC = () => {
  return (
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
  );
};
