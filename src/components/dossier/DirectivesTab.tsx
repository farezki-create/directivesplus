
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { logDirectiveDebugInfo, extractDirectives } from "./utils/directives";
import DirectivesHeader from "./directives/DirectivesHeader";
import DirectivesContent from "./directives/DirectivesContent";
import NoDirectivesAlert from "./directives/NoDirectivesAlert";

export interface DirectivesTabProps {
  decryptedContent: any;
  hasDirectives?: boolean;
  getDirectives?: () => any;
  decryptionError?: string | null; // Added decryptionError prop
}

const DirectivesTab: React.FC<DirectivesTabProps> = ({ 
  decryptedContent, 
  hasDirectives = false,
  getDirectives,
  decryptionError
}) => {
  // Log debug information when component renders
  useEffect(() => {
    logDirectiveDebugInfo(decryptedContent, hasDirectives, getDirectives);
  }, [decryptedContent, hasDirectives, getDirectives]);
  
  // Display error if there is one
  if (decryptionError) {
    return (
      <CardContent className="p-6">
        <NoDirectivesAlert />
      </CardContent>
    );
  }
  
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
