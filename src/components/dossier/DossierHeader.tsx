
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

export interface DossierHeaderProps {
  onClose: () => void;
  patientInfo?: any;
}

const DossierHeader: React.FC<DossierHeaderProps> = ({ onClose, patientInfo }) => {
  const patientName = patientInfo ? 
    `${patientInfo.first_name || ''} ${patientInfo.last_name || ''}`.trim() : 
    'Patient';
    
  const displayName = patientName || 'Dossier Patient';
  
  return (
    <CardHeader className="border-b">
      <div className="flex items-center justify-between">
        <CardTitle>{displayName}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};

export default DossierHeader;
