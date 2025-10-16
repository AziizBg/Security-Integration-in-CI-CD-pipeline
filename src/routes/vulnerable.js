const express = require('express');
const router = express.Router();

// VULNÉRABILITÉ 1 : Injection SQL simulée
router.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  // Pas de validation - injection possible
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  res.json({ query, warning: 'SQL Injection vulnerability!' });
});

// VULNÉRABILITÉ 2 : XSS
router.get('/search', (req, res) => {
  const searchTerm = req.query.q;
  // Pas d'échappement HTML
  res.send(`<h1>Résultats pour: ${searchTerm}</h1>`);
});

// VULNÉRABILITÉ 3 : Exposition de données sensibles
router.get('/debug', (req, res) => {
  res.json({
    env: process.env,
    config: {
      dbPassword: 'super_secret_password',
      apiKey: 'sk-1234567890'
    }
  });
});

module.exports = router;