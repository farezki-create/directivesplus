
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const context = useAuthContext();
  
  console.log('🔍 [USE-AUTH] Context utilisé:', {
    isAuthenticated: context.isAuthenticated,
    userEmail: context.user?.email,
    isAdmin: context.isAdmin,
    isLoading: context.isLoading
  });
  
  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    isAdmin: context.isAdmin,
    loading: context.isLoading
  };
};
