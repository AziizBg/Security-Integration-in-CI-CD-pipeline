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

// ⚠️ VULNÉRABILITÉ 1 : SQL Injection
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  // Pas de validation - injection SQL possible
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  res.json({ query, warning: 'SQL Injection vulnerability!' });
});

// ⚠️ VULNÉRABILITÉ 2 : XSS (Cross-Site Scripting)
app.get('/api/search', (req, res) => {
  const searchTerm = req.query.q;
  // Pas d'échappement HTML - XSS possible
  res.send(`<h1>Résultats pour: ${searchTerm}</h1>`);
});

// ⚠️ VULNÉRABILITÉ 3 : Exposition de données sensibles
app.get('/api/debug', (req, res) => {
  res.json({
    env: process.env,
    database: {
      host: 'prod-db.example.com',
      password: 'super_secret_password_123',
      apiKey: 'sk-1234567890abcdef'
    }
  });
});


const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = { app, server };