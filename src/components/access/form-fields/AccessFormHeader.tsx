
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AccessFormHeader = () => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl text-center text-directiveplus-700">
          Accès aux directives anticipées
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 mb-3 p-3 bg-blue-50 rounded-md border border-blue-100">
          Pour accéder aux directives, veuillez saisir les informations du patient et le code d'accès fourni.
        </div>
      </CardContent>
    </>
  );
};

export default AccessFormHeader;
