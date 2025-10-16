const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes sécurisées
app.get('/', (req, res) => {
  res.json({ message: 'Application sécurisée' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});


const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = { app, server };