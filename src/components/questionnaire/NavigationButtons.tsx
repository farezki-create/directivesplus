
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";

interface NavigationButtonsProps {
  onSave: () => void;
  saving: boolean;
}

const NavigationButtons = ({ onSave, saving }: NavigationButtonsProps) => {
  return (
    <div className="flex justify-between pt-4">
      <Button 
        variant="outline" 
        asChild
        className="flex items-center"
      >
        <Link to="/rediger">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Link>
      </Button>
      
      <Button
        onClick={onSave}
        disabled={saving}
        className="bg-directiveplus-600 hover:bg-directiveplus-700"
      >
        {saving ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Enregistrer
      </Button>
    </div>
  );
};

export default NavigationButtons;
