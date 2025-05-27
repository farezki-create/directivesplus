
import { Link } from "react-router-dom";
import { ScrollText, Database, ShieldAlert, FileText } from "lucide-react";

const DataProtectionLinks = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link 
        to="/confidentialite" 
        className="flex items-center gap-2 text-gray-600 hover:text-directiveplus-600 transition-colors"
      >
        <FileText className="h-4 w-4" />
        Politique de confidentialité
      </Link>
      
      <Link 
        to="/analyse-impact-protection-donnees" 
        className="flex items-center gap-2 text-gray-600 hover:text-directiveplus-600 transition-colors"
      >
        <ScrollText className="h-4 w-4" />
        Analyse d'impact RGPD
      </Link>
      
      <Link 
        to="/politique-sauvegarde" 
        className="flex items-center gap-2 text-gray-600 hover:text-directiveplus-600 transition-colors"
      >
        <Database className="h-4 w-4" />
        Politique de sauvegarde
      </Link>
      
      <Link 
        to="/procedure-violation-donnees" 
        className="flex items-center gap-2 text-gray-600 hover:text-directiveplus-600 transition-colors"
      >
        <ShieldAlert className="h-4 w-4" />
        Procédure violation de données
      </Link>
    </div>
  );
};

export default DataProtectionLinks;
