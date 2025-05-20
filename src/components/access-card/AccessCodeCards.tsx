
import { Card, CardContent } from "@/components/ui/card";

interface AccessCodeCardsProps {
  directiveCode: string | null;
  medicalCode: string | null;
  directiveLoading: boolean;
  medicalLoading: boolean;
}

const AccessCodeCards = ({ 
  directiveCode, 
  medicalCode, 
  directiveLoading, 
  medicalLoading 
}: AccessCodeCardsProps) => {
  return (
    <Card className="mb-6 border-purple-200">
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-4">Vos codes d'accès</h2>
        <div className="space-y-4">
          {directiveCode ? (
            <div className="p-3 bg-purple-50 rounded-md border border-purple-200">
              <p className="text-sm font-medium text-gray-500 mb-1">Code d'accès directives anticipées</p>
              <p className="font-mono text-lg font-bold tracking-wider">{directiveCode}</p>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm font-medium text-gray-500 mb-1">Code d'accès directives anticipées</p>
              <p className="text-gray-400 italic">
                {directiveLoading ? "En cours de génération..." : "Non disponible"}
              </p>
            </div>
          )}
          
          {medicalCode ? (
            <div className="p-3 bg-sky-50 rounded-md border border-sky-200">
              <p className="text-sm font-medium text-gray-500 mb-1">Code d'accès données médicales</p>
              <p className="font-mono text-lg font-bold tracking-wider">{medicalCode}</p>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm font-medium text-gray-500 mb-1">Code d'accès données médicales</p>
              <p className="text-gray-400 italic">
                {medicalLoading ? "En cours de génération..." : "Non disponible"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessCodeCards;
