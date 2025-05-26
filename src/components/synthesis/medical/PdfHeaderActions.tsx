
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, Eye, EyeOff } from "lucide-react";

interface PdfHeaderActionsProps {
  showPdf: boolean;
  setShowPdf: (show: boolean) => void;
  onRemove: () => void;
}

const PdfHeaderActions: React.FC<PdfHeaderActionsProps> = ({
  showPdf,
  setShowPdf,
  onRemove
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowPdf(!showPdf)}
        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
      >
        {showPdf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PdfHeaderActions;
