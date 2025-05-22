
import React from "react";
import { Button } from "@/components/ui/button";
import { useDirectivesAccessForm } from "@/hooks/access/useDirectivesAccessForm";
import DirectivesFormFields from "./DirectivesFormFields";

interface DirectivesAccessFormProps {
  onSubmit?: (accessCode: string, formData: any) => Promise<void>;
}

const DirectivesAccessForm: React.FC<DirectivesAccessFormProps> = ({ onSubmit }) => {
  const {
    form,
    loading,
    errorMessage,
    remainingAttempts,
    blockedAccess,
    handleAccessDirectives
  } = useDirectivesAccessForm(onSubmit);
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center mb-6 text-directiveplus-700">
        Accès aux directives anticipées
      </h1>
      
      <p className="mb-6 text-gray-700">
        Veuillez entrer le code d'accès aux directives anticipées ainsi que 
        les informations d'identification demandées pour y accéder.
      </p>
      
      <form onSubmit={(e) => { 
        e.preventDefault();
        handleAccessDirectives();
      }}>
        <DirectivesFormFields 
          form={form} 
          loading={loading}
          blockedAccess={blockedAccess}
          errorMessage={errorMessage}
          remainingAttempts={remainingAttempts}
        />
        
        <div className="mt-6">
          <Button
            type="submit"
            className="w-full bg-directiveplus-600 hover:bg-directiveplus-700"
            disabled={loading || blockedAccess}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full"></span>
                Vérification...
              </span>
            ) : (
              "Accéder aux directives"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DirectivesAccessForm;
