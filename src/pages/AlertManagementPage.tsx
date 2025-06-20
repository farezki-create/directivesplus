
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AlertManagement from '@/components/alerts/AlertManagement';
import AppNavigation from '@/components/AppNavigation';
import Footer from '@/components/Footer';

const AlertManagementPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: "/alert-management" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour au profil
          </Button>
        </div>
        
        <AlertManagement />
      </main>
      
      <Footer />
    </div>
  );
};

export default AlertManagementPage;
