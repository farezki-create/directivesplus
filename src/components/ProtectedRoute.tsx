
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  console.log('🛡️ [PROTECTED-ROUTE] Vérification accès:', {
    pathname: location.pathname,
    isAuthenticated,
    isLoading,
    requireAuth,
    requireAdmin,
    userEmail: user?.email
  });

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Check admin access if required
  if (requireAdmin) {
    const isAdmin = user?.email?.endsWith('@directivesplus.fr') || false;
    
    console.log('🔐 [PROTECTED-ROUTE] Vérification admin:', {
      userEmail: user?.email,
      isAdmin,
      isAuthenticated
    });
    
    if (!isAuthenticated) {
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }
    
    if (!isAdmin) {
      console.log('❌ [PROTECTED-ROUTE] Accès admin refusé');
      return <Navigate to="/" replace />;
    }
  }

  // Define routes that should be publicly accessible
  const publicRoutes = [
    '/',
    '/mes-directives',
    '/directives-access',
    '/secure-directives-access',
    '/institution-access',
    '/carte-acces',
    '/support',
    '/legal',
    '/privacy',
    '/donation',
    '/auth'
  ];

  // Define routes that allow shared access (with special parameters)
  const sharedAccessRoutes = [
    '/mes-directives/shared',
    '/direct-document'
  ];

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => 
    location.pathname === route || 
    location.pathname.startsWith(route + '/')
  );

  // Check if current route allows shared access
  const isSharedAccessRoute = sharedAccessRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // Allow access to public routes without authentication
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Allow shared access routes with proper validation
  if (isSharedAccessRoute) {
    const hasValidSharedParams = 
      location.search.includes('shared_code=') || 
      location.pathname.includes('/direct-document/');
    
    if (hasValidSharedParams) {
      // Log the shared access attempt for security monitoring
      console.log('Shared access attempt:', {
        path: location.pathname,
        search: location.search,
        timestamp: new Date().toISOString()
      });
      return <>{children}</>;
    }
    
    // If shared route but no valid params, redirect to access form
    return <Navigate to="/mes-directives" replace />;
  }

  // For protected routes, require authentication
  if (requireAuth && !isAuthenticated) {
    // Store the attempted URL for redirect after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user is authenticated but trying to access auth page, redirect to profile completion
  if (isAuthenticated && location.pathname === '/auth') {
    return <Navigate to="/profile" replace />;
  }

  console.log('✅ [PROTECTED-ROUTE] Accès autorisé');
  return <>{children}</>;
};

export default ProtectedRoute;
