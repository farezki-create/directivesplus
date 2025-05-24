
import { Shield } from "lucide-react";

const AccessCardHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Shield className="h-8 w-8 text-directiveplus-600" />
        <h1 className="text-3xl font-bold text-directiveplus-800">
          Accès Professionnel
        </h1>
      </div>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Générez un code sécurisé pour permettre aux professionnels de santé 
        d'accéder à vos directives anticipées.
      </p>
    </div>
  );
};

export default AccessCardHeader;
