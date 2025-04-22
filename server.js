
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build script function to run before starting server
function runBuild() {
  return new Promise((resolve, reject) => {
    console.log('Building application...');
    exec('npx vite build', (error, stdout, stderr) => {
      if (error) {
        console.error('Build error:', error);
        console.error('Build stderr:', stderr);
        reject(error);
        return;
      }
      console.log('Build output:', stdout);
      resolve();
    });
  });
}

// Middleware de sécurité
app.use(helmet());

// Compression des réponses
app.use(compression());

// Autorise les requêtes cross-origin
app.use(cors());

// Logger simple
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Limite le nombre de requêtes par IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requêtes par IP
});
app.use(limiter);

// Route de vérification de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Sert les fichiers statiques du frontend (React buildé dans dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Redirige toutes les autres routes vers index.html (pour React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Check if we need to run the build (in production)
if (process.env.NODE_ENV === 'production') {
  runBuild()
    .then(() => {
      // Démarre le serveur sur le port spécifié par l'environnement ou 3000
      const port = process.env.PORT || 3000;
      const server = app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
      });

      // Gestion des erreurs serveur
      server.on('error', (err) => {
        console.error('Server error:', err);
      });
    })
    .catch(err => {
      console.error('Failed to build the application:', err);
      process.exit(1);
    });
} else {
  // In development, just start the server without building
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  // Gestion des erreurs serveur
  server.on('error', (err) => {
    console.error('Server error:', err);
  });
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
