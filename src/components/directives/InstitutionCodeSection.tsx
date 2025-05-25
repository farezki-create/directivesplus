
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ChevronDown, ChevronUp } from "lucide-react";
import { InstitutionCodesManager } from "@/components/institution-codes/InstitutionCodesManager";

export const InstitutionCodeSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <CardTitle>Accès Institution</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-1"
          >
            {isExpanded ? (
              <>
                Réduire <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Gérer <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        {!isExpanded && (
          <p className="text-sm text-muted-foreground">
            Générez des codes d'accès pour permettre aux institutions médicales 
            d'accéder à vos directives anticipées.
          </p>
        )}
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <InstitutionCodesManager />
        </CardContent>
      )}
    </Card>
  );
};
