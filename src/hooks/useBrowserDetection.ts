
import { useState, useEffect } from "react";

export const useBrowserDetection = () => {
  const [isExternalBrowser, setIsExternalBrowser] = useState(false);

  useEffect(() => {
    const detectBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      const hasInAppParam = window.location.search.includes('inapp=true');
      
      console.log('useBrowserDetection: Informations détectées:', {
        userAgent: userAgent.substring(0, 100) + '...', // Truncate for readability
        hostname,
        protocol,
        hasInAppParam,
        fullUrl: window.location.href
      });
      
      // Détection plus précise
      const isLovableApp = hostname === 'localhost' || 
                          hostname.includes('lovableproject.com') ||
                          protocol === 'capacitor:' ||
                          (window as any).ReactNativeWebView ||
                          hasInAppParam;
      
      // Détection des navigateurs mobiles courants
      const isMobileBrowser = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isDesktopBrowser = !isMobileBrowser && (
        userAgent.includes('chrome') || 
        userAgent.includes('firefox') || 
        userAgent.includes('safari') || 
        userAgent.includes('edge')
      );
      
      console.log('useBrowserDetection: Résultat de détection:', { 
        isLovableApp,
        isMobileBrowser,
        isDesktopBrowser,
        finalResult: !isLovableApp && (isMobileBrowser || isDesktopBrowser)
      });
      
      const result = !isLovableApp && (isMobileBrowser || isDesktopBrowser);
      setIsExternalBrowser(result);
      
      console.log('useBrowserDetection: isExternalBrowser défini à:', result);
    };
    
    detectBrowser();
  }, []);

  return { isExternalBrowser };
};
