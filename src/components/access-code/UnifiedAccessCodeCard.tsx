
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const UnifiedAccessCodeCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Codes d'accès unifiés</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Le système de codes d'accès a été temporairement désactivé pour simplification.
            Une nouvelle version plus simple sera bientôt disponible.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
