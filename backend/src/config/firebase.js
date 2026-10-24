import 'dotenv/config';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firebaseApp = null;
let isFirebaseInitialized = false;

const initFirebase = () => {
  if (isFirebaseInitialized && firebaseApp) return;

  // 1. Try loading from serviceAccountKey.json
  const defaultSaPath = path.resolve(__dirname, '../../serviceAccountKey.json');
  const configuredSaPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    ? path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
    : defaultSaPath;

  const saPathToUse = fs.existsSync(configuredSaPath)
    ? configuredSaPath
    : fs.existsSync(defaultSaPath)
      ? defaultSaPath
      : null;

  if (saPathToUse) {
    try {
      const sa = JSON.parse(fs.readFileSync(saPathToUse, 'utf8'));
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(sa)
      });
      isFirebaseInitialized = true;
      console.log('[Firebase] Admin SDK initialized successfully from serviceAccountKey.json');
      return;
    } catch (err) {
      console.warn(`[Firebase] Service account file initialization warning: ${err.message}. Trying environment variables.`);
    }
  }

  // 2. Fallback to individual environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : null;

  if (projectId && clientEmail && privateKey) {
    try {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        })
      });
      isFirebaseInitialized = true;
      console.log('[Firebase] Admin SDK initialized successfully from environment variables');
      return;
    } catch (err) {
      console.warn(`[Firebase] Initialization warning: ${err.message}. Operating in fallback/mock mode.`);
    }
  }

  console.log('[Firebase] No service account credentials supplied. Running in academic fallback mode (safe simulated push & token verification).');
};

initFirebase();

/**
 * Verify a Firebase ID Token. Tokens are never trusted unless the Admin SDK
 * has verified their signature and claims.
 */
export const verifyFirebaseToken = async (idToken) => {
  if (!isFirebaseInitialized || !firebaseApp) {
    const error = new Error('Firebase authentication is not configured.');
    error.statusCode = 503;
    throw error;
  }

  try {
    return await admin.auth().verifyIdToken(idToken);
  } catch {
    const error = new Error('Firebase token verification failed.');
    error.statusCode = 401;
    throw error;
  }
};

/**
 * Send push notification to user device tokens via Firebase Cloud Messaging.
 * Always fails gracefully and logs rather than crashing.
 */
export const sendFirebasePush = async ({ tokens = [], title, body, data = {} }) => {
  if (!tokens || tokens.length === 0) {
    return { success: true, delivered: 0, reason: 'No device tokens registered' };
  }

  if (isFirebaseInitialized && firebaseApp) {
    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title, body },
        data: Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, String(v)])
        )
      });
      console.log(`[Firebase] Push sent: ${response.successCount} successful, ${response.failureCount} failed.`);
      return { success: true, delivered: response.successCount };
    } catch (error) {
      console.warn(`[Firebase] Push sending error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Fallback simulation log
  console.log(`[Firebase Simulation] Push dispatched to ${tokens.length} token(s) -> "${title}": "${body}"`);
  return { success: true, simulated: true, delivered: tokens.length };
};

export default {
  verifyFirebaseToken,
  sendFirebasePush
};
