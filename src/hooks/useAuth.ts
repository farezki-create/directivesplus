
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  
  // Vérification simple si l'utilisateur est admin (email se terminant par @directivesplus.fr)
  const isAdmin = user?.email?.endsWith('@directivesplus.fr') || false;
  
  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    loading: isLoading
  };
};
