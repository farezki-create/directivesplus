
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DirectivesGrid from "@/components/DirectivesGrid";
import AppLayout from "@/components/layouts/AppLayout";

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  // Important: Only render page content if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
          Vos directives anticipées en toute simplicité
        </h1>
        <p className="text-gray-600 text-lg">
          Rédigez vos directives anticipées et désignez vos personnes de confiance en quelques étapes simples et sécurisées.
        </p>
      </div>
      
      <DirectivesGrid />
    </AppLayout>
  );
};

export default Dashboard;
