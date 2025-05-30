
import { useEffect } from 'react';
import { securityHeaders } from '@/utils/security/securityHeaders';

export const useSecurityHeaders = () => {
  useEffect(() => {
    // Apply client-side security measures
    
    // Disable right-click context menu in production
    if (process.env.NODE_ENV === 'production') {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
      };
      
      document.addEventListener('contextmenu', handleContextMenu);
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
    
    // Log that security headers should be applied at server level
    console.log('Security headers configuration:', securityHeaders);
  }, []);
};
