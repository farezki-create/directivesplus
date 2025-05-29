
/**
 * Configuration des headers de sécurité pour la conformité HDS
 */
export const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co https://js.stripe.com https://translate.google.com https://translate.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com https://translate.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com https://www.gstatic.com",
    "img-src 'self' data: https: https://www.gstatic.com https://translate.googleapis.com",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com https://translate.googleapis.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; '),
  
  // Security headers
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  
  // HSTS (sera géré par Scalingo en production)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

/**
 * Applique les headers de sécurité à une réponse Express
 */
export const applySecurityHeaders = (res: any) => {
  Object.entries(securityHeaders).forEach(([header, value]) => {
    res.setHeader(header, value);
  });
};
