const express = require('express');
const { authMiddleware } = require('./auth');
const { getTwilioClientOrNull } = require('../services/twilio');

const router = express.Router();

router.use(authMiddleware);

router.get('/status', async (req, res) => {
  const from = process.env.TWILIO_FROM || '';
  const client = getTwilioClientOrNull();
  const configured = Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
  const fromValid = typeof from === 'string' && from.toLowerCase().startsWith('whatsapp:');
  return res.json({ configured, from, fromValid, canInitializeClient: Boolean(client) });
});

module.exports = { twilioRouter: router };

