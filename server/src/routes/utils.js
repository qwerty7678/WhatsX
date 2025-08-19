const express = require('express');
const { authMiddleware } = require('./auth');
const { normalizeAndDeduplicate } = require('../services/deduplicate');

const router = express.Router();

router.use(authMiddleware);

router.post('/deduplicate', async (req, res) => {
  const { contacts, defaultCountryCode } = req.body || {};
  if (!Array.isArray(contacts)) {
    return res.status(400).json({ error: 'contacts must be an array of strings' });
  }
  const result = normalizeAndDeduplicate(contacts, defaultCountryCode);
  return res.json(result);
});

module.exports = { utilsRouter: router };

