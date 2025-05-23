import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, ChevronLeft, Home } from "lucide-react";
const DashboardNavigation: React.FC = () => {
  const navigate = useNavigate();
  return <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ChevronLeft size={16} />
          Retour
        </Button>
        
        <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-2">
          <Home size={16} />
          Accueil
        </Button>
      </div>
      
      
    </div>;
};
export default DashboardNavigation;