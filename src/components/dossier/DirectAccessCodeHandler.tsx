
import React from "react";

interface DirectAccessCodeHandlerProps {
  logDossierEvent: (event: string, success: boolean) => void;
  setInitialLoading: (loading: boolean) => void;
}

// This is now a simplified component since direct access has been removed
const DirectAccessCodeHandler: React.FC<DirectAccessCodeHandlerProps> = ({ 
  logDossierEvent, 
  setInitialLoading 
}) => {
  React.useEffect(() => {
    // Log event that direct access feature has been disabled
    logDossierEvent("direct_access_disabled", true);
    setInitialLoading(false);
    
    console.log("Direct access to documents without login has been disabled.");
  }, [logDossierEvent, setInitialLoading]);

  return null; // This component doesn't render anything
};

export default DirectAccessCodeHandler;
