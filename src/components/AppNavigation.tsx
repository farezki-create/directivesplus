
import { useAuth } from "@/contexts/AuthContext";
import { ModernSidebar } from "@/components/navigation/ModernSidebar";

interface AppNavigationProps {
  hideEditingFeatures?: boolean;
}

const AppNavigation = ({ hideEditingFeatures = false }: AppNavigationProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-b flex items-center justify-center z-40">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <ModernSidebar hideEditingFeatures={hideEditingFeatures} />;
};

export default AppNavigation;
