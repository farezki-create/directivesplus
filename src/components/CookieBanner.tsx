
import { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-50 p-4 shadow-lg border-t z-50">
      <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-700">
          Ce site utilise uniquement des cookies essentiels au bon fonctionnement (authentification, sécurité).
          Aucune donnée publicitaire n'est collectée.
        </p>
        <button 
          onClick={acceptCookies}
          className="whitespace-nowrap bg-directiveplus-600 hover:bg-directiveplus-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          J'ai compris
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
