import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const normalizeEmails = (value) => String(value || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const getAdminEmails = (env) => normalizeEmails(env.ADMIN_EMAILS || env.ADMIN_ORDER_EMAILS);

const getFirebaseAuth = (env) => {
  const serviceAccountJson = env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) return null;

  if (getApps().length === 0) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id });
  }
  return getAuth();
};

export async function verifyAdminRequest(headers = {}, env = process.env) {
  const isHostedEnvironment = Boolean(env.VERCEL || env.NETLIFY || env.NODE_ENV === 'production');
  if (!isHostedEnvironment && env.ADMIN_API_AUTH_REQUIRED !== 'true') {
    return { ok: true, email: 'local-dev' };
  }

  const adminEmails = getAdminEmails(env);
  if (!adminEmails.length) {
    return { ok: false, status: 503, error: 'ADMIN_EMAILS non configuré' };
  }

  const authHeader = headers.authorization || headers.Authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return { ok: false, status: 401, error: 'Authentification admin requise' };
  }

  const firebaseAuth = getFirebaseAuth(env);
  if (!firebaseAuth) {
    return { ok: false, status: 503, error: 'FIREBASE_SERVICE_ACCOUNT_KEY manquant' };
  }

  try {
    const decoded = await firebaseAuth.verifyIdToken(token);
    const email = String(decoded.email || '').toLowerCase();
    if (!adminEmails.includes(email)) {
      return { ok: false, status: 403, error: 'Accès admin refusé' };
    }
    return { ok: true, email };
  } catch {
    return { ok: false, status: 401, error: 'Token admin invalide ou expiré' };
  }
}
