
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

interface AccessLinkDisplayProps {
  accessUrl: string;
  onCopy: () => void;
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function AccessLinkDisplay({ 
  accessUrl, 
  onCopy, 
  onLinkClick 
}: AccessLinkDisplayProps) {
  const navigate = useNavigate();
  
  const handleDocumentsClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default navigation
    
    // Call the onLinkClick handler if provided
    if (onLinkClick) {
      onLinkClick(e as React.MouseEvent<HTMLAnchorElement>);
    }
    
    // Direct navigation using navigate
    navigate("/my-documents");
  };
  
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 mt-3">
      <span>Accès aux documents:</span>
      <Button 
        variant="link" 
        onClick={handleDocumentsClick}
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 p-0 h-auto font-normal underline"
      >
        Mes Documents <Link className="h-3 w-3" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onCopy}
        className="h-7 px-2 md:ml-2"
      >
        Copier
      </Button>
    </div>
  );
}
