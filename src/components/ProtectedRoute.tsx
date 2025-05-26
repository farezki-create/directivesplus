
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const location = useLocation();
  const [timeoutReached, setTimeoutReached] = useState(false);
  
  // Routes COMPLÈTEMENT publiques - AUCUNE vérification d'authentification
  const fullyPublicRoutes = [
    '/', 
    '/affichage-dossier', 
    '/mes-directives', 
    '/directives-acces',
    '/directives-docs',
    '/acces-institution',
    '/acces-institution-simple'
  ];
  
  console.log("ProtectedRoute check:", {
    pathname: location.pathname,
    isPublic: fullyPublicRoutes.includes(location.pathname),
    isAuthenticated,
    isLoading,
    timeoutReached
  });

  // Timeout de sécurité pour éviter le chargement infini
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("ProtectedRoute: Timeout atteint, arrêt du chargement");
      setTimeoutReached(true);
    }, 5000); // 5 secondes maximum

    return () => clearTimeout(timer);
  }, []);

  // BYPASS COMPLET pour les routes publiques - AUCUNE VÉRIFICATION
  if (fullyPublicRoutes.includes(location.pathname)) {
    console.log("ProtectedRoute: Route publique, accès direct autorisé sans vérification");
    return <>{children}</>;
  }

  // Si timeout atteint et toujours en chargement, traiter comme non authentifié
  if (timeoutReached && isLoading) {
    console.log("ProtectedRoute: Timeout atteint, redirection vers /auth");
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Afficher l'indicateur de chargement pendant la vérification (max 5 secondes)
  if (isLoading && !timeoutReached) {
    console.log("ProtectedRoute: Chargement de l'état d'authentification...");
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-directiveplus-600" />
        <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
      </div>
    );
  }

  // Pour les routes protégées, vérifier l'authentification
  if (!isAuthenticated) {
    console.log("ProtectedRoute: Non authentifié, redirection vers /auth");
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Vérifier le rôle si requis
  if (requiredRole && profile) {
    const userRoles = profile.roles || [];
    const userRole = profile.role;
    
    // Vérifier si l'utilisateur a le rôle requis (soit dans roles[] soit dans role)
    const hasRequiredRole = Array.isArray(userRoles) 
      ? userRoles.includes(requiredRole)
      : userRole === requiredRole;
    
    if (!hasRequiredRole) {
      console.log(`ProtectedRoute: Rôle insuffisant: ${requiredRole}`);
      return <Navigate to="/" state={{ from: location.pathname }} replace />;
    }
  }

  console.log("ProtectedRoute: Accès autorisé");
  return <>{children}</>;
};

export { ProtectedRoute };
export default ProtectedRoute;
