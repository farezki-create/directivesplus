
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DirectivesNavigation: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <Button
        variant="outline"
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Retour au tableau de bord
      </Button>
    </div>
  );
};

export default DirectivesNavigation;
