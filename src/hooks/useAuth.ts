
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  
  // Vérification simple si l'utilisateur est admin (email se terminant par @directivesplus.fr)
  const isAdmin = isAuthenticated && user?.email?.endsWith('@directivesplus.fr') || false;
  
  console.log('🔍 [USE-AUTH] Vérification admin:', {
    isAuthenticated,
    userEmail: user?.email,
    isAdmin,
    isLoading
  });
  
  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    loading: isLoading
  };
};
