
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Info } from "lucide-react";

interface StatisticsCardsProps {
  directivesCount: number;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ directivesCount }) => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-600">{directivesCount}</p>
          <p className="text-sm text-gray-600">Document(s) trouvé(s)</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-green-600 font-bold">✓</span>
          </div>
          <p className="text-2xl font-bold text-green-600">Autorisé</p>
          <p className="text-sm text-gray-600">Accès validé</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <Info className="h-8 w-8 text-gray-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-600">Simple</p>
          <p className="text-sm text-gray-600">Mode d'accès</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
