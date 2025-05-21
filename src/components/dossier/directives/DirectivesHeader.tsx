
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DirectivesHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>Directives Anticipées</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <FileText size={18} className="text-blue-600" />
            </TooltipTrigger>
            <TooltipContent>Directives du patient</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardTitle>
    </CardHeader>
  );
};

export default DirectivesHeader;
