
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force le scroll vers le haut à chaque changement de page
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
