
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Import des utilitaires de sécurité si disponibles
let helmet, rateLimit;
try {
  helmet = require('helmet');
  rateLimit = require('express-rate-limit');
} catch (error) {
  console.warn('Modules de sécurité non disponibles:', error.message);
}

// Configuration des headers de sécurité
const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Middleware de sécurité
app.use((req, res, next) => {
  // Appliquer les headers de sécurité
  Object.entries(securityHeaders).forEach(([header, value]) => {
    res.setHeader(header, value);
  });
  
  // HSTS en production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
});

// Rate limiting si disponible
if (rateLimit) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite à 100 requêtes par IP
    message: {
      error: 'Trop de requêtes, veuillez réessayer plus tard.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  app.use(limiter);
}

// Helmet si disponible
if (helmet) {
  app.use(helmet({
    contentSecurityPolicy: false, // On gère CSP manuellement
    hsts: process.env.NODE_ENV === 'production'
  }));
}

// Health check endpoint pour Scalingo
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Endpoint de conformité (développement uniquement)
if (process.env.NODE_ENV !== 'production') {
  app.get('/compliance-check', (req, res) => {
    res.status(200).json({
      security_headers: 'configured',
      rate_limiting: rateLimit ? 'active' : 'fallback',
      helmet: helmet ? 'active' : 'fallback',
      environment: process.env.NODE_ENV || 'development'
    });
  });
}

// Parse JSON avec limite de taille
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Gestionnaire d'erreur global
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  
  // Ne pas exposer les détails d'erreur en production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: isDevelopment ? error.message : 'Une erreur s\'est produite',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🔒 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🛡️ Sécurité: Headers configurés, Rate limiting ${rateLimit ? 'actif' : 'fallback'}`);
});
