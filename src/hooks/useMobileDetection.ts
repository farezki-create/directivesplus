
import { useState, useEffect } from "react";

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Détection mobile plus précise
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipod', 'blackberry', 'windows phone'];
      const tabletKeywords = ['ipad', 'tablet', 'kindle'];
      
      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isTabletUA = tabletKeywords.some(keyword => userAgent.includes(keyword));
      
      // Détection par taille d'écran
      const isMobileSize = width <= 768;
      const isTabletSize = width > 768 && width <= 1024;
      
      // Détection tactile
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsMobile(isMobileUA || (isMobileSize && isTouchDevice));
      setIsTablet(isTabletUA || (isTabletSize && isTouchDevice));
    };
    
    checkDevice();
    
    // Réévaluer lors du redimensionnement
    const handleResize = () => {
      setTimeout(checkDevice, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { 
    isMobile, 
    isTablet, 
    isMobileOrTablet: isMobile || isTablet 
  };
};
