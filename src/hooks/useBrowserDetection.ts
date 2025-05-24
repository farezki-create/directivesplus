
import { useState, useEffect } from "react";

export const useBrowserDetection = () => {
  const [isExternalBrowser, setIsExternalBrowser] = useState(false);

  useEffect(() => {
    const detectBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      const hasInAppParam = window.location.search.includes('inapp=true');
      
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
      
      console.log('Browser detection enhanced:', { 
        hostname, 
        protocol,
        hasInAppParam,
        isMobileBrowser,
        isDesktopBrowser,
        userAgent,
        isLovableApp 
      });
      
      setIsExternalBrowser(!isLovableApp && (isMobileBrowser || isDesktopBrowser));
    };
    
    detectBrowser();
  }, []);

  return { isExternalBrowser };
};
