import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from './firebase.js';

export async function fetchPublicProducts() {
  const q = query(collection(db, 'products'), where('status', '==', 'active'), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchPopularProducts(max = 8) {
  const q = query(
    collection(db, 'products'),
    where('status', '==', 'active'),
    orderBy('updatedAt', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchPublicPosts(max) {
  const base = query(collection(db, 'posts'), where('status', '==', 'published'));
  const q = typeof max === 'number' ? query(base, limit(max)) : base;
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const toMillis = (v) => {
    if (!v) return 0;
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const t = Date.parse(v);
      return Number.isFinite(t) ? t : 0;
    }
    if (typeof v?.toMillis === 'function') return v.toMillis();
    if (typeof v?.seconds === 'number') return v.seconds * 1000;
    return 0;
  };

  list.sort((a, b) => {
    const at = Math.max(toMillis(a.updatedAt), toMillis(a.date));
    const bt = Math.max(toMillis(b.updatedAt), toMillis(b.date));
    return bt - at;
  });

  return typeof max === 'number' ? list.slice(0, max) : list;
}
