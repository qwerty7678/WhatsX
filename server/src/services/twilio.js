const twilio = require('twilio');

function getTwilioClientOrNull() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  try {
    return twilio(sid, token);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[twilio] init error', err.message);
    return null;
  }
}

async function sendWhatsAppMessage({ to, body }) {
  // Prototype: we DO NOT actually send. We validate and log, returning a stub response.
  const from = process.env.TWILIO_FROM || 'whatsapp:+14155238886';
  const hasClient = !!getTwilioClientOrNull();
  // eslint-disable-next-line no-console
  console.log('[twilio-stub] would send', { from, to, body, hasClient });
  return { ok: true, sid: 'stubbed-message-sid', from, to, body };
}

module.exports = { getTwilioClientOrNull, sendWhatsAppMessage };

