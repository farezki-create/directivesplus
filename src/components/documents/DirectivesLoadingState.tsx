
import React from "react";

const DirectivesLoadingState: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
    </div>
  );
};

export default DirectivesLoadingState;
