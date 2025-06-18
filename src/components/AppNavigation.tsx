
import { useAuth } from "@/contexts/AuthContext";
import ModernNavBar from "@/components/layout/ModernNavBar";

const AppNavigation = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-16 bg-gray-50 border-b flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <ModernNavBar />;
};

export default AppNavigation;
