
import Header from "@/components/Header";

export const EmailConfirmationView = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-directiveplus-600"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Confirmation en cours...
            </h2>
            <p className="text-gray-600">
              Votre email a été confirmé avec succès. Redirection vers votre espace dans quelques instants.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
