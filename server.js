import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Démarre le serveur sur le port spécifié par l'environnement ou 3000
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Gestion des erreurs serveur
server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
