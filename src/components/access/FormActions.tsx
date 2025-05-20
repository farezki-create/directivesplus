
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
    <div className="flex flex-col gap-3 w-full">
      <Button 
        className="w-full flex items-center gap-2" 
        onClick={handleAccessDirectives}
        disabled={loading}
        type="button"
      >
        <FileText size={18} />
        {loading ? "Vérification en cours..." : "Accéder aux directives anticipées"}
      </Button>
      
      <Button 
        className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700" 
        onClick={handleAccessMedicalData}
        disabled={loading}
        type="button"
      >
        <FileSearch size={18} />
        {loading ? "Vérification en cours..." : "Accéder aux données médicales"}
      </Button>
    </div>
  );
};

export default FormActions;
