
import { Button } from "@/components/ui/button";
import { FileText, FileSearch } from "lucide-react";

type FormActionsProps = {
  loading: boolean;
  onAccessDirectives: () => void;
  onAccessMedicalData: () => void;
};

const FormActions = ({ loading, onAccessDirectives, onAccessMedicalData }: FormActionsProps) => {
  // Create completely isolated handlers with separate functions
  const handleAccessDirectives = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAccessDirectives();
  };
  
  const handleAccessMedicalData = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAccessMedicalData();
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* First button for directives */}
      <div className="w-full">
        <Button 
          className="w-full flex items-center gap-2 bg-directiveplus-700 hover:bg-directiveplus-800" 
          onClick={handleAccessDirectives}
          disabled={loading}
          type="button"
          variant="default"
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
          disabled={loading}
          type="button"
          variant="default"
          style={{ backgroundColor: '#3b82f6', color: 'white' }}
        >
          <FileSearch size={18} />
          {loading ? "Vérification en cours..." : "Accéder aux données médicales"}
        </Button>
      </div>
    </div>
  );
};

export default FormActions;
