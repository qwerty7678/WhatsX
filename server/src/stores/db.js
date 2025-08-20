const admin = require('firebase-admin');

let firestore = null;

function initializeFirestoreIfConfigured() {
  if (firestore) return firestore;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  try {
    if (projectId && clientEmail && privateKey) {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      }
      firestore = admin.firestore();
      // eslint-disable-next-line no-console
      console.log('[db] Firestore initialized');
    } else {
      // eslint-disable-next-line no-console
      console.log('[db] Firestore credentials not provided. Using in-memory store.');
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[db] Failed to initialize Firestore. Falling back to in-memory.', err.message);
  }
  return firestore;
}

module.exports = { initializeFirestoreIfConfigured };

