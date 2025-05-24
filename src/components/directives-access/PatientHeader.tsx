
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { PatientInfo } from "@/utils/patient/patientInfoExtractor";

interface PatientHeaderProps {
  patientInfo: PatientInfo;
  onReturnHome: () => void;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ patientInfo, onReturnHome }) => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-green-600" />
            <div>
              <CardTitle className="text-green-800">
                Dossier Patient - Accès Autorisé
              </CardTitle>
              <p className="text-green-700 text-sm mt-1">
                Consultation des directives anticipées
              </p>
            </div>
          </div>
          <Button 
            onClick={onReturnHome}
            variant="outline"
            size="sm"
            className="border-green-300 text-green-700 hover:bg-green-100"
          >
            Fermer l'accès
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-green-800">Patient</p>
            <p className="text-green-700">
              {patientInfo.firstName} {patientInfo.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">Date de naissance</p>
            <p className="text-green-700">
              {patientInfo.birthDate}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientHeader;
