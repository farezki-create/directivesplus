
import { Button } from "@/components/ui/button";
import { FileText, FileSearch, Loader2 } from "lucide-react";

type FormActionsProps = {
  loading: boolean;
  onAccessDirectives: () => void;
  onAccessMedicalData: () => void;
};

const FormActions = ({ loading, onAccessDirectives, onAccessMedicalData }: FormActionsProps) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Button 
        className="w-full flex items-center justify-center gap-2" 
        onClick={(e) => {
          e.preventDefault();
          onAccessDirectives();
        }}
        disabled={loading}
        type="button"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText size={18} />
        )}
        {loading ? "Vérification en cours..." : "Accéder aux directives anticipées"}
      </Button>
      
      <Button 
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700" 
        onClick={(e) => {
          e.preventDefault();
          onAccessMedicalData();
        }}
        disabled={loading}
        type="button"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileSearch size={18} />
        )}
        {loading ? "Vérification en cours..." : "Accéder aux données médicales"}
      </Button>
    </div>
  );
};

export default FormActions;
