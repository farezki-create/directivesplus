
import React from "react";
import { Link } from "lucide-react";

const CardFooter: React.FC = () => {
  return (
    <div className="flex items-center gap-2 bg-white/20 rounded p-1.5">
      <Link size={16} className="shrink-0" />
      <div>
        <p className="text-xs font-semibold">Site web:</p>
        <p className="font-mono font-bold tracking-wider text-sm">directivesplus.fr</p>
      </div>
    </div>
  );
};

export default CardFooter;
