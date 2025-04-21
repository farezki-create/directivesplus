import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

const app = express();

// Middleware pour des headers de sécurité
app.use(helmet());

// Middleware pour la compression
app.use(compression());

// Middleware pour gérer les demandes CORS
app.use(cors());

// Exemple d'API pour vérifier la santé de l'application
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Gérer les routes non spécifiées
app.get('*', (req, res) => {
  res.status(404).send('Page Not Found');
});

// Utiliser la variable d'environnement PORT
const port = process.env.PORT || 3000;

// Initialisation du serveur
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Gestion des erreurs du serveur
server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite à 100 requêtes par IP
});

app.use(limiter);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});