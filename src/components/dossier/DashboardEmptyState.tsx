
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

const DashboardEmptyState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-gray-50 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <FileText size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-medium mb-2">Aucun dossier actif</h3>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Vous n'avez pas encore de dossier actif. Accédez à vos directives pour en consulter un.
        </p>
        <Button onClick={() => navigate("/mes-directives")}>
          Consulter mes documents
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardEmptyState;
