
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import DirectivesAccessForm from "@/components/access/DirectivesAccessForm";

interface DirectivesAccessFormViewProps {
  onSubmit?: (accessCode: string, formData: any) => Promise<void>;
  loading?: boolean;
}

const DirectivesAccessFormView: React.FC<DirectivesAccessFormViewProps> = ({
  onSubmit,
  loading = false
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Accès aux Directives
          </h1>
          <p className="text-gray-600 mt-2">
            Saisissez vos informations pour accéder aux directives
          </p>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Vous devez saisir vos informations personnelles exactes pour accéder aux directives partagées.
          </AlertDescription>
        </Alert>

        <DirectivesAccessForm
          onSubmit={onSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DirectivesAccessFormView;
