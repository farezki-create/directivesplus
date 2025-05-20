
import React from "react";
import { Link } from "lucide-react";

interface CardFooterProps {
  websiteUrl?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({ 
  websiteUrl = "directivesplus.fr" 
}) => {
  const handleWebsiteClick = () => {
    // Ensure URL has proper protocol
    const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="flex items-center gap-2 bg-white/20 rounded p-2 cursor-pointer hover:bg-white/30 transition-colors"
      onClick={handleWebsiteClick}
      role="button"
      aria-label={`Visiter le site web: ${websiteUrl}`}
    >
      <Link size={20} className="shrink-0 text-white" />
      <div>
        <p className="text-xs font-semibold">Site web:</p>
        <p className="font-mono font-bold tracking-wider text-sm">{websiteUrl}</p>
      </div>
    </div>
  );
};

export default CardFooter;
