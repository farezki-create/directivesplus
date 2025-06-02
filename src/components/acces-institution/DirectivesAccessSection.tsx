
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { InstitutionAccessFormComplete } from "@/components/institution-access/InstitutionAccessFormComplete";

export const DirectivesAccessSection: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Accès Institution - Directives Anticipées
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InstitutionAccessFormComplete />
      </CardContent>
    </Card>
  );
};
