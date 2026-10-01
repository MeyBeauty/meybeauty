import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function hasOrderStore(env = process.env) {
  return Boolean(env.FIREBASE_SERVICE_ACCOUNT_KEY);
}

export async function getStoredOrder(orderId, env = process.env) {
  const serviceAccountJson = env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson || !orderId) return null;

  if (getApps().length === 0) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id });
  }

  const snapshot = await getFirestore().collection('orders').doc(String(orderId)).get();
  return snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null;
}
