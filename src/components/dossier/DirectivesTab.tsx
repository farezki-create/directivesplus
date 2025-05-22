
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
  decryptionError?: string | null;
}

const DirectivesTab: React.FC<DirectivesTabProps> = ({ 
  decryptedContent, 
  hasDirectives = false,
  getDirectives,
  decryptionError
}) => {
  // Log debug information for better visibility in the console
  useEffect(() => {
    console.log("DirectivesTab rendered with:", {
      hasContent: !!decryptedContent,
      hasDirectives,
      hasGetDirectives: !!getDirectives,
      decryptionError
    });
    
    logDirectiveDebugInfo(decryptedContent, hasDirectives, getDirectives);
  }, [decryptedContent, hasDirectives, getDirectives, decryptionError]);
  
  // Display error if there is one
  if (decryptionError) {
    console.log("DirectivesTab - Showing error state:", decryptionError);
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
      console.log("DirectivesTab - No directives data found");
      return <NoDirectivesAlert />;
    }

    const { directives, source } = directivesData;
    console.log("DirectivesTab - Rendering directives from source:", source);
    return <DirectivesContent directives={directives} source={source} />;
  };

  return (
    <Card className="shadow-lg">
      <DirectivesHeader />
      <CardContent className="p-6">
        {renderDirectives()}
      </CardContent>
    </Card>
  );
};

export default DirectivesTab;
