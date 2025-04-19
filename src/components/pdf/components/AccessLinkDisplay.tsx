
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

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
  const handleDocumentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "https://directivesplus.fr";
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
