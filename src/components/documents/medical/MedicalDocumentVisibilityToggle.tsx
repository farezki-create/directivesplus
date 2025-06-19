
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Building2, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MedicalDocumentVisibilityToggleProps {
  documentId: string;
  isVisibleToInstitutions: boolean;
  onVisibilityChange?: (documentId: string, isVisible: boolean) => void;
}

const MedicalDocumentVisibilityToggle = ({ 
  documentId, 
  isVisibleToInstitutions, 
  onVisibilityChange 
}: MedicalDocumentVisibilityToggleProps) => {
  const handleVisibilityChange = (checked: boolean) => {
    if (onVisibilityChange) {
      onVisibilityChange(documentId, checked);
      
      toast({
        title: checked ? "Document accessible aux institutions" : "Document privé",
        description: checked 
          ? "Les institutions médicales autorisées pourront accéder à ce document" 
          : "Seul vous pouvez accéder à ce document",
      });
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Switch
          id={`institution-access-${documentId}`}
          checked={isVisibleToInstitutions}
          onCheckedChange={handleVisibilityChange}
        />
        <Label htmlFor={`institution-access-${documentId}`} className="flex items-center gap-2 text-sm">
          {isVisibleToInstitutions ? <Building2 size={16} className="text-blue-600" /> : <Lock size={16} className="text-gray-600" />}
          <span>
            {isVisibleToInstitutions ? "Accessible aux institutions" : "Document privé"}
          </span>
        </Label>
      </div>
    </div>
  );
};

export default MedicalDocumentVisibilityToggle;
