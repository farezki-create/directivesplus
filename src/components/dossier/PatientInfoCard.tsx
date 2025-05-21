
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PatientInfoCardProps {
  patientInfo: any;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ patientInfo }) => {
  if (!patientInfo) return null;
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Informations du patient</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patientInfo.nom && (
            <div>
              <span className="font-medium">Nom:</span> {patientInfo.nom}
            </div>
          )}
          {patientInfo.prenom && (
            <div>
              <span className="font-medium">Prénom:</span> {patientInfo.prenom}
            </div>
          )}
          {patientInfo.date_naissance && (
            <div>
              <span className="font-medium">Date de naissance:</span> {patientInfo.date_naissance}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoCard;
