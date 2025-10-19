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

// ✅ ROUTE SÉCURISÉE 1 : Protection contre SQL Injection
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  
  // ✅ Validation stricte de l'ID (seulement des chiffres)
  if (!/^\d+$/.test(userId)) {
    return res.status(400).json({ 
      error: 'Invalid user ID format. Only numbers allowed.' 
    });
  }
  
  // ✅ Utilisation de requêtes préparées (simulé)
  const query = 'SELECT * FROM users WHERE id = ?';
  res.json({ 
    message: 'Secure query executed',
    userId: parseInt(userId),
    note: 'Parameterized query prevents SQL injection'
  });
});

// ✅ ROUTE SÉCURISÉE 2 : Protection contre XSS
app.get('/api/search', (req, res) => {
  const searchTerm = req.query.q;
  
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term required' });
  }
  
  // ✅ Échappement HTML pour prévenir XSS
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  
  const safeTerm = escapeHtml(searchTerm);
  
  // ✅ Retour JSON au lieu de HTML brut
  res.json({
    searchTerm: safeTerm,
    results: [],
    note: 'HTML escaped - XSS prevented'
  });
});

// ✅ ROUTE SÉCURISÉE 3 : Pas d'exposition de secrets
app.get('/api/info', (req, res) => {
  // ✅ Seulement des informations publiques
  res.json({
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    status: 'operational',
    note: 'Sensitive data is protected'
  });
});


const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = { app, server };