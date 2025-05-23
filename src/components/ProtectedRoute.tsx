
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, profile, session } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
  // Liste explicite des routes publiques
  const publicRoutes = ['/directives-acces', '/', '/mes-directives', '/auth', '/directives-acces', '/affichage-dossier'];
  const hasCodeParam = searchParams.has("code");
  
  useEffect(() => {
    console.log("ProtectedRoute for", location.pathname, {
      isAuthenticated,
      isLoading,
      hasCodeParam,
      isPublicRoute: publicRoutes.includes(location.pathname)
    });
    
    // Marquer l'authentification comme vérifiée une fois le chargement terminé
    if (!isLoading) {
      setHasCheckedAuth(true);
    }
    
    // Réinitialiser l'état de redirection si l'authentification réussit
    if (isAuthenticated && isRedirecting) {
      setIsRedirecting(false);
    }
  }, [isAuthenticated, isLoading, location.pathname, isRedirecting, session, searchParams, hasCodeParam]);

  // Afficher l'indicateur de chargement pendant la vérification de l'état d'authentification
  if (isLoading || !hasCheckedAuth) {
    console.log("ProtectedRoute: Chargement de l'état d'authentification...");
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-directiveplus-600" />
        <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
      </div>
    );
  }

  // Si c'est une route publique, autoriser l'accès sans authentification
  if (publicRoutes.includes(location.pathname)) {
    console.log("ProtectedRoute: Route publique, accès autorisé");
    return <>{children}</>;
  }
  
  // Exception spéciale: autoriser l'accès direct à /mes-directives avec un code d'accès dans l'URL
  if (location.pathname === "/mes-directives" && hasCodeParam) {
    console.log("ProtectedRoute: Accès direct aux directives avec code, autorisation spéciale");
    return <>{children}</>;
  }

  // Si l'utilisateur est authentifié, autoriser l'accès
  if (isAuthenticated) {
    console.log("ProtectedRoute: Utilisateur authentifié, accès autorisé pour", location.pathname);
    return <>{children}</>;
  }

  // Empêcher la boucle de navigation en vérifiant si nous redirigeons déjà
  if (!isAuthenticated && !isRedirecting) {
    // Stocker le chemin actuel pour rediriger après la connexion
    console.log("ProtectedRoute: Non authentifié, redirection vers auth depuis:", location.pathname);
    setIsRedirecting(true);
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Vérifier l'accès basé sur le rôle si requiredRole est fourni
  if (requiredRole && profile) {
    const userRoles = profile.roles || [];
    const hasRequiredRole = Array.isArray(userRoles) 
      ? userRoles.includes(requiredRole)
      : userRoles === requiredRole;
    
    if (!hasRequiredRole && !isRedirecting) {
      console.log(`ProtectedRoute: L'utilisateur n'a pas le rôle requis: ${requiredRole}`);
      setIsRedirecting(true);
      // Rediriger vers l'accueil au lieu du dashboard
      return <Navigate to="/" state={{ from: location.pathname }} replace />;
    }
  }

  console.log("ProtectedRoute: Authentifié, affichage du contenu protégé pour", location.pathname);
  return <>{children}</>;
};

export { ProtectedRoute };
export default ProtectedRoute;
