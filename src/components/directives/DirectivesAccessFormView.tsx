
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import PublicDirectivesAccessForm from "@/components/access/PublicDirectivesAccessForm";

interface DirectivesAccessFormViewProps {
  onSubmit: (formData: any) => void;
  loading: boolean;
}

const DirectivesAccessFormView: React.FC<DirectivesAccessFormViewProps> = ({
  onSubmit,
  loading
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">
            Accès aux directives anticipées
          </h1>
          
          <PublicDirectivesAccessForm 
            onSubmit={onSubmit} 
            loading={loading} 
          />

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Si vous avez un compte, vous pouvez également{" "}
              <a href="/auth" className="text-directiveplus-600 hover:underline">
                vous connecter
              </a>
              {" "}pour accéder à vos directives.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default DirectivesAccessFormView;
