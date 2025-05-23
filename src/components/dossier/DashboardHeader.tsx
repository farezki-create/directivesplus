
import React from "react";
import { useDossierStore } from "@/store/dossierStore";
import { extractPatientInfo } from "@/utils/directives";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardHeader: React.FC = () => {
  const dossierActif = useDossierStore((state) => state.dossierActif);
  const decryptedContent = useDossierStore((state) => state.decryptedContent);
  
  // Extract patient info
  const patientInfo = extractPatientInfo(decryptedContent, dossierActif);
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium">
              {patientInfo.firstName && patientInfo.lastName ? (
                <>Dossier de {patientInfo.firstName} {patientInfo.lastName}</>
              ) : (
                <Skeleton className="h-6 w-[250px]" />
              )}
            </h2>
            {patientInfo.birthDate && (
              <p className="text-gray-500 text-sm mt-1">
                Né(e) le {new Date(patientInfo.birthDate).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
          <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Dossier actif
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;
