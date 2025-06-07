
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import SynthesisContent from "@/components/synthesis/SynthesisContent";
import { Navigate } from "react-router-dom";

const Synthese = () => {
  const { user, profile, isLoading, isAuthenticated } = useAuth();

  console.log("Synthese - Auth state:", { 
    isAuthenticated, 
    isLoading, 
    userId: user?.id,
    profileExists: !!profile 
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <SynthesisContent 
          profileData={profile}
          userId={user.id}
        />
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Synthese;
