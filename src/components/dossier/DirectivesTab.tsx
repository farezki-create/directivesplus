
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { logDirectiveDebugInfo, extractDirectives } from "./utils/directiveContentUtils";
import DirectivesHeader from "./directives/DirectivesHeader";
import DirectivesContent from "./directives/DirectivesContent";
import NoDirectivesAlert from "./directives/NoDirectivesAlert";

interface DirectivesTabProps {
  decryptedContent: any;
  hasDirectives: boolean;
  getDirectives?: () => any;
}

const DirectivesTab: React.FC<DirectivesTabProps> = ({ 
  decryptedContent, 
  hasDirectives,
  getDirectives 
}) => {
  // Log debug information when component renders
  useEffect(() => {
    logDirectiveDebugInfo(decryptedContent, hasDirectives, getDirectives);
  }, [decryptedContent, hasDirectives, getDirectives]);
  
  // Extract directives content with fallback strategies
  const directivesData = extractDirectives(decryptedContent, hasDirectives, getDirectives);
  
  const renderDirectives = () => {
    if (!directivesData) {
      return <NoDirectivesAlert />;
    }

    const { directives, source } = directivesData;
    return <DirectivesContent directives={directives} source={source} />;
  };

  return (
    <Card className="shadow-lg">
      <DirectivesHeader />
      <CardContent>
        {renderDirectives()}
      </CardContent>
    </Card>
  );
};

export default DirectivesTab;
