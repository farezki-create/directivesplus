
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
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  // Routes COMPLÈTEMENT publiques - AUCUNE vérification d'authentification
  const fullyPublicRoutes = [
    '/', 
    '/affichage-dossier', 
    '/mes-directives', 
    '/directives-acces',
    '/directives-docs',
    '/acces-institution',
    '/acces-institution-simple',
    '/pdf-viewer' // Route publique pour QR codes
  ];

  // Vérifier si c'est un accès QR code (paramètres access=card ou shared_code ou id)
  const searchParams = new URLSearchParams(location.search);
  const hasQRAccess = searchParams.get('access') === 'card' || 
                      searchParams.get('shared_code') || 
                      searchParams.get('id'); // Pour les liens directs vers des documents

  // Vérifier si c'est un accès institution (présence de tous les paramètres nécessaires)
  const hasInstitutionAccess = searchParams.get('code') && 
                               searchParams.get('nom') && 
                               searchParams.get('prenom') && 
                               searchParams.get('naissance');

  // Vérifier si on vient de la page d'accès institution (referrer ou session)
  const comesFromInstitution = document.referrer.includes('/acces-institution') ||
                               sessionStorage.getItem('institutionAccess') === 'true';

  console.log("🔒 ProtectedRoute check:", {
    pathname: location.pathname,
    isPublicRoute: fullyPublicRoutes.includes(location.pathname),
    hasQRAccess,
    hasInstitutionAccess,
    comesFromInstitution,
    searchParams: location.search,
    isAuthenticated,
    isLoading,
    authCheckComplete,
    decision: fullyPublicRoutes.includes(location.pathname) || hasQRAccess || hasInstitutionAccess || comesFromInstitution ? 'ALLOW_PUBLIC' : 'CHECK_AUTH'
  });

  // BYPASS COMPLET pour les routes publiques OU accès QR code OU accès institution
  if (fullyPublicRoutes.includes(location.pathname) || hasQRAccess || hasInstitutionAccess || comesFromInstitution) {
    console.log("✅ ProtectedRoute: Accès public autorisé - route publique, QR code ou accès institution détecté");
    return <>{children}</>;
  }

  // Gestion intelligente de l'état de chargement sans timeout arbitraire
  useEffect(() => {
    // Si on n'est plus en chargement, marquer la vérification comme complète
    if (!isLoading) {
      console.log("✅ Auth check completed, loading finished");
      setAuthCheckComplete(true);
    }
  }, [isLoading]);

  // Attendre que la vérification d'auth soit complète
  if (!authCheckComplete && isLoading) {
    console.log("⏳ ProtectedRoute: Vérification d'authentification en cours...");
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-directiveplus-600" />
        <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
      </div>
    );
  }

  // Pour les routes protégées, vérifier l'authentification
  if (!isAuthenticated) {
    console.log("🚫 ProtectedRoute: Non authentifié, redirection vers /auth");
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Vérifier le rôle si requis
  if (requiredRole && profile) {
    const userRoles = profile.roles || [];
    const userRole = profile.role;
    
    const hasRequiredRole = Array.isArray(userRoles) 
      ? userRoles.includes(requiredRole)
      : userRole === requiredRole;
    
    if (!hasRequiredRole) {
      console.log(`🚫 ProtectedRoute: Rôle insuffisant: ${requiredRole}`);
      return <Navigate to="/" state={{ from: location.pathname }} replace />;
    }
  }

  console.log("✅ ProtectedRoute: Accès autorisé");
  return <>{children}</>;
};

export { ProtectedRoute };
export default ProtectedRoute;
