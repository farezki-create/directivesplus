
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Cette page redirige vers le tableau de bord (page Rediger)
 * Une ancienne page qui a été remplacée
 */
const AffichageDossierRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer le code d'accès direct s'il existe dans le sessionStorage
    const directAccessCode = sessionStorage.getItem('directAccessCode');
    
    // Si un code d'accès existe, redirige vers la page Rediger
    if (directAccessCode) {
      sessionStorage.removeItem('directAccessCode');
    }
    
    // Redirection vers la page Rediger qui sert maintenant de tableau de bord
    navigate('/rediger', { replace: true });
  }, [navigate]);

  return null;
};

export default AffichageDossierRedirect;
