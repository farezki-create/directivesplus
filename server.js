import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Sécurité avec Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://*.stripe.com"],
      connectSrc: ["'self'", "https://*.supabase.co"]
    }
  }
}));

// Compression et CORS
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://*.scalingo.io',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Middleware pour parser les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques et en-têtes de cache
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.set('Cache-Control', 'no-store');
    } else {
      res.set('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Route API pour vérifier la santé de l'application
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Gérer toutes les autres routes avec index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Déclarez le port assigné par Scalingo
const port = process.env.PORT || 3000;

// Démarrer le serveur
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

// Gestion des erreurs de serveur
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    throw err;
  }
});

// Gestion des erreurs globales
process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});