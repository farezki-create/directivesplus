
import React from "react";
import { useDossierStore } from "@/store/dossierStore";
import { extractPatientInfo } from "@/utils/directives";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardHeader: React.FC = () => {
  const dossierActif = useDossierStore(state => state.dossierActif);
  const decryptedContent = useDossierStore(state => state.decryptedContent);

  // Extract patient info
  const patientInfo = extractPatientInfo(decryptedContent, dossierActif);
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        {patientInfo ? (
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {patientInfo.firstName} {patientInfo.lastName}
            </h2>
            {patientInfo.birthDate && (
              <p className="text-gray-600">
                Né(e) le {new Date(patientInfo.birthDate).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        ) : (
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;
