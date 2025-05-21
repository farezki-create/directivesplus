
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Activity, RefreshCw } from "lucide-react";

interface AccessCodeCardsProps {
  directiveCode: string | null;
  medicalCode: string | null;
  directiveLoading?: boolean;
  medicalLoading?: boolean;
  onRegenerateDirective?: () => void;
  onRegenerateMedical?: () => void;
}

const AccessCodeCards = ({ 
  directiveCode, 
  medicalCode, 
  directiveLoading = false,
  medicalLoading = false,
  onRegenerateDirective,
  onRegenerateMedical
}: AccessCodeCardsProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-directiveplus-600" />
              <h3 className="text-base font-medium text-gray-900">Code d'accès directives</h3>
            </div>
            {onRegenerateDirective && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerateDirective}
                disabled={directiveLoading}
                className="flex items-center gap-1"
              >
                <RefreshCw size={14} className={directiveLoading ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Régénérer</span>
              </Button>
            )}
          </div>
          {directiveLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : directiveCode ? (
            <div className="bg-gray-50 rounded-md p-2 text-center">
              <code className="text-lg font-bold font-mono tracking-wider">
                {directiveCode}
              </code>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-md p-2 text-center text-gray-500">
              Aucun code disponible
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-directiveplus-600" />
              <h3 className="text-base font-medium text-gray-900">Code d'accès médical</h3>
            </div>
            {onRegenerateMedical && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerateMedical}
                disabled={medicalLoading}
                className="flex items-center gap-1"
              >
                <RefreshCw size={14} className={medicalLoading ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Régénérer</span>
              </Button>
            )}
          </div>
          {medicalLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : medicalCode ? (
            <div className="bg-gray-50 rounded-md p-2 text-center">
              <code className="text-lg font-bold font-mono tracking-wider">
                {medicalCode}
              </code>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-md p-2 text-center text-gray-500">
              Aucun code disponible
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessCodeCards;
