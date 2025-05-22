
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AffichageDossierRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Log the redirect
    console.log("Redirecting from /affichage-dossier to /dashboard");
    
    // Redirect to dashboard
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-medium">Redirection en cours...</h1>
        <p className="text-gray-600 mt-2">Vous allez être redirigé vers le tableau de bord.</p>
      </div>
    </div>
  );
};

export default AffichageDossierRedirect;
