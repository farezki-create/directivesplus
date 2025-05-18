
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lock, Unlock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VisibilityToggleProps {
  documentId: string;
  isPrivate: boolean;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
}

const VisibilityToggle = ({ 
  documentId, 
  isPrivate, 
  onVisibilityChange 
}: VisibilityToggleProps) => {
  const handleVisibilityChange = (checked: boolean) => {
    if (onVisibilityChange) {
      onVisibilityChange(documentId, checked);
      
      toast({
        title: checked ? "Document privé" : "Document visible avec code",
        description: checked 
          ? "Seul vous pouvez accéder à ce document" 
          : "Ce document est accessible avec un code d'accès",
      });
    }
  };

  return (
    <div className="flex items-center mt-2 gap-3">
      <div className="flex items-center space-x-2">
        <Switch
          id={`visibility-${documentId}`}
          checked={isPrivate}
          onCheckedChange={handleVisibilityChange}
        />
        <Label htmlFor={`visibility-${documentId}`} className="flex items-center gap-1 text-xs text-gray-600">
          {isPrivate ? <Lock size={14} /> : <Unlock size={14} />}
          {isPrivate ? "Document privé" : "Document visible avec code"}
        </Label>
      </div>
    </div>
  );
};

export default VisibilityToggle;
