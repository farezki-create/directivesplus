
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

interface AccessLinkDisplayProps {
  accessUrl: string;
  onCopy: () => void;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function AccessLinkDisplay({ 
  accessUrl, 
  onCopy, 
  onLinkClick 
}: AccessLinkDisplayProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 mt-3">
      <span>Accès aux documents:</span>
      <RouterLink 
        to="/my-documents"
        onClick={onLinkClick}
        className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1 cursor-pointer"
      >
        Mes Documents <Link className="h-3 w-3" />
      </RouterLink>
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
