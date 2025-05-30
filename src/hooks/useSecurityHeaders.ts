
import { useEffect } from 'react';

export const useSecurityHeaders = () => {
  useEffect(() => {
    // Content Security Policy (via meta tag for client-side)
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://api.stripe.com",
      "frame-src 'self' https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');
    
    // Only add if not already present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      document.head.appendChild(cspMeta);
    }

    // Referrer Policy
    const referrerMeta = document.createElement('meta');
    referrerMeta.name = 'referrer';
    referrerMeta.content = 'strict-origin-when-cross-origin';
    
    if (!document.querySelector('meta[name="referrer"]')) {
      document.head.appendChild(referrerMeta);
    }

    // X-Content-Type-Options
    const noSniffMeta = document.createElement('meta');
    noSniffMeta.httpEquiv = 'X-Content-Type-Options';
    noSniffMeta.content = 'nosniff';
    
    if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
      document.head.appendChild(noSniffMeta);
    }

    // Disable autocomplete on sensitive forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      if (form.classList.contains('sensitive-form')) {
        form.setAttribute('autocomplete', 'off');
      }
    });

    // Prevent context menu on sensitive elements
    const preventContextMenu = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('no-context-menu')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', preventContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);
};
