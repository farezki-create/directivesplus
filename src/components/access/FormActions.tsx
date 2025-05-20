
import { Button } from "@/components/ui/button";
import { FileText, FileSearch, Loader2, LucideIcon } from "lucide-react";
import { useState } from "react";

type FormActionsProps = {
  loading: boolean;
  onAction: () => void;
  actionLabel: string;
  actionIcon: "file-text" | "file-search";
  buttonColor?: string;
};

const FormActions = ({ 
  loading, 
  onAction, 
  actionLabel, 
  actionIcon,
  buttonColor = "bg-directiveplus-700 hover:bg-directiveplus-800" 
}: FormActionsProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // Get the icon component based on the provided icon name
  const getIcon = () => {
    if (actionIcon === "file-text") return <FileText size={18} />;
    if (actionIcon === "file-search") return <FileSearch size={18} />;
    return <FileText size={18} />; // Default fallback
  };
  
  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent action if already clicked or loading
    if (isActive || loading) return;
    
    // Set this button as active
    setIsActive(true);
    onAction();
    
    // Reset active state after a delay
    setTimeout(() => setIsActive(false), 1000);
  };

  return (
    <Button 
      className={`w-full flex items-center gap-2 ${buttonColor}`} 
      onClick={handleAction}
      disabled={loading || isActive}
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
