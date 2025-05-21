
import { Button } from "@/components/ui/button";
import { FileText, FileSearch, Loader2 } from "lucide-react";
import { useState } from "react";

type FormActionsProps = {
  loading: boolean;
  onAction?: () => void;
  actionLabel?: string;
  actionIcon?: "file-text" | "file-search";
  buttonColor?: string;
  isDisabled?: boolean;
  // Support pour les gestionnaires d'action séparés
  onAccessDirectives?: () => void;
  onAccessMedicalData?: () => void;
};

const FormActions = ({ 
  loading, 
  onAction,
  actionLabel,
  actionIcon,
  buttonColor = "bg-directiveplus-700 hover:bg-directiveplus-800",
  isDisabled = false,
  onAccessDirectives,
  onAccessMedicalData
}: FormActionsProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // Get the icon component based on the provided icon name
  const getIcon = () => {
    if (actionIcon === "file-text") return <FileText size={18} />;
    if (actionIcon === "file-search") return <FileSearch size={18} />;
    return <FileText size={18} />; // Default fallback
  };
  
  // Handle single action button
  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent action if already clicked or loading
    if (isActive || loading || isDisabled) return;
    
    // Set this button as active
    setIsActive(true);
    
    // Call the appropriate action handler
    if (onAction) {
      onAction();
    }
    
    // Reset active state after a delay
    setTimeout(() => setIsActive(false), 1000);
  };

  // Handle directives access button click
  const handleAccessDirectives = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isActive || loading || isDisabled) return;
    
    setIsActive(true);
    if (onAccessDirectives) {
      onAccessDirectives();
    }
    
    setTimeout(() => setIsActive(false), 1000);
  };

  // Handle medical data access button click
  const handleAccessMedicalData = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isActive || loading || isDisabled) return;
    
    setIsActive(true);
    if (onAccessMedicalData) {
      onAccessMedicalData();
    }
    
    setTimeout(() => setIsActive(false), 1000);
  };

  // If we have both specific handlers, render two buttons
  if (onAccessDirectives && onAccessMedicalData) {
    return (
      <div className="w-full space-y-4">
        <Button 
          className="w-full flex items-center gap-2 bg-directiveplus-700 hover:bg-directiveplus-800" 
          onClick={handleAccessDirectives}
          disabled={loading || isActive || isDisabled}
          type="button"
          variant="default"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText size={18} />
          )}
          {loading ? "Vérification en cours..." : "Accéder aux directives anticipées"}
        </Button>

        <Button 
          className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700" 
          onClick={handleAccessMedicalData}
          disabled={loading || isActive || isDisabled}
          type="button"
          variant="default"
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
  }

  // Otherwise render single action button
  return (
    <Button 
      className={`w-full flex items-center gap-2 ${buttonColor}`} 
      onClick={handleAction}
      disabled={loading || isActive || isDisabled}
      type="button"
      variant="default"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        getIcon()
      )}
      {loading ? "Vérification en cours..." : actionLabel}
    </Button>
  );
};

export default FormActions;
