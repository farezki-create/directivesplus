
import React from "react";
import { Card } from "@/components/ui/card";

const DossierLoadingState: React.FC = () => {
  return (
    <div className="container max-w-4xl py-8">
      <Card className="shadow-lg p-8">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
          <p className="mt-4 text-gray-600">Chargement du dossier en cours...</p>
        </div>
      </Card>
    </div>
  );
};

export default DossierLoadingState;
