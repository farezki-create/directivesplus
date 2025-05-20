
import { Button } from "@/components/ui/button";
import { FileText, FileSearch } from "lucide-react";
import { useState } from "react";

type FormActionsProps = {
  loading: boolean;
  onAccessDirectives: () => void;
  onAccessMedicalData: () => void;
};

const FormActions = ({ loading, onAccessDirectives, onAccessMedicalData }: FormActionsProps) => {
  // Track which button was clicked to prevent multiple actions
  const [activeButton, setActiveButton] = useState<string | null>(null);
  
  // Create completely isolated handlers with debounce mechanism
  const handleAccessDirectives = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent action if already clicked or other button is active
    if (activeButton || loading) return;
    
    // Set this button as active
    setActiveButton("directives");
    onAccessDirectives();
    
    // Reset active state after a delay
    setTimeout(() => setActiveButton(null), 1000);
  };
  
  const handleAccessMedicalData = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent action if already clicked or other button is active
    if (activeButton || loading) return;
    
    // Set this button as active
    setActiveButton("medical");
    onAccessMedicalData();
    
    // Reset active state after a delay
    setTimeout(() => setActiveButton(null), 1000);
  };

  // Determine button states
  const directivesDisabled = loading || activeButton === "medical";
  const medicalDisabled = loading || activeButton === "directives";

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* First button for directives */}
      <div className="w-full">
        <Button 
          className="w-full flex items-center gap-2 bg-directiveplus-700 hover:bg-directiveplus-800" 
          onClick={handleAccessDirectives}
          disabled={directivesDisabled}
          type="button"
          variant="default"
          data-testid="access-directives-button"
        >
          <FileText size={18} />
          {loading ? "Vérification en cours..." : "Accéder aux directives anticipées"}
        </Button>
      </div>
      
      {/* Visual separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-sm text-gray-500">ou</span>
        </div>
      </div>
      
      {/* Second button for medical data */}
      <div className="w-full">
        <Button 
          className="w-full flex items-center gap-2" 
          onClick={handleAccessMedicalData}
          disabled={medicalDisabled}
          type="button"
          variant="default"
          style={{ backgroundColor: '#3b82f6', color: 'white' }}
          data-testid="access-medical-button"
        >
          <FileSearch size={18} />
          {loading ? "Vérification en cours..." : "Accéder aux données médicales"}
        </Button>
      </div>
    </div>
  );
};

export default FormActions;
