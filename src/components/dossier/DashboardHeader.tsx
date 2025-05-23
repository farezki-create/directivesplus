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
  return <Card className="mb-6">
      
    </Card>;
};
export default DashboardHeader;