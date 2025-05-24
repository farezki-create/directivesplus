
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useReadOnlyAccess } from "@/hooks/useReadOnlyAccess";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  requireWriteAccess?: boolean; // Nouvelle prop pour indiquer si l'écriture est requise
}

const ProtectedRoute = ({ children, requiredRole, requireWriteAccess = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const { hasEquivalentAuth, hasWriteAccess } = useReadOnlyAccess(isAuthenticated);
  const location = useLocation();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
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
    hasEquivalentAuth,
    hasWriteAccess,
    requireWriteAccess,
    isLoading
  });

  useEffect(() => {
    if (!isLoading) {
      setHasCheckedAuth(true);
    }
  }, [isLoading]);

  // BYPASS COMPLET pour les routes publiques - AUCUNE VÉRIFICATION
  if (fullyPublicRoutes.includes(location.pathname)) {
    console.log("ProtectedRoute: Route publique, accès direct autorisé sans vérification");
    return <>{children}</>;
  }

  // Afficher l'indicateur de chargement pendant la vérification
  if (isLoading || !hasCheckedAuth) {
    console.log("ProtectedRoute: Chargement de l'état d'authentification...");
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-directiveplus-600" />
        <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
      </div>
    );
  }

  // Pour les routes protégées, vérifier l'accès équivalent à l'authentification
  if (!hasEquivalentAuth) {
    console.log("ProtectedRoute: Aucun accès (ni authentifié ni code d'accès), redirection vers /auth");
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Si l'accès en écriture est requis mais que l'utilisateur n'a qu'un accès lecture seule
  if (requireWriteAccess && !hasWriteAccess) {
    console.log("ProtectedRoute: Accès en écriture requis mais utilisateur en lecture seule");
    return <Navigate to="/mes-directives" state={{ from: location.pathname }} replace />;
  }

  // Vérifier le rôle si requis (uniquement pour les utilisateurs vraiment authentifiés)
  if (requiredRole && profile && isAuthenticated) {
    const userRoles = profile.roles || [];
    const hasRequiredRole = Array.isArray(userRoles) 
      ? userRoles.includes(requiredRole)
      : userRoles === requiredRole;
    
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
