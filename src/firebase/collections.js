import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase.js';

async function collectionHasAnyDocs(path) {
  const q = query(collection(db, path), limit(1));
  const snap = await getDocs(q);
  return snap.size > 0;
}

export function listenProducts(onData, onError) {
  const q = query(collection(db, 'products'), orderBy('updatedAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onData(list);
    },
    onError
  );
}

export async function upsertProduct(product) {
  const id = String(product.id || '').trim();
  if (!id) throw new Error('Missing product id');
  const ref = doc(db, 'products', id);
  await setDoc(
    ref,
    {
      ...product,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, 'products', id));
}

export function listenPosts(onData, onError) {
  const q = query(collection(db, 'posts'), orderBy('updatedAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onData(list);
    },
    onError
  );
}

export async function upsertPost(post) {
  const id = String(post.id || '').trim();
  if (!id) throw new Error('Missing post id');
  const ref = doc(db, 'posts', id);
  await setDoc(
    ref,
    {
      ...post,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function seedProductsIfEmpty(products) {
  const hasAny = await collectionHasAnyDocs('products');
  if (hasAny) return { seeded: false, count: 0 };
  const list = Array.isArray(products) ? products : [];
  await Promise.all(
    list
      .filter((p) => p && String(p.id || '').trim())
      .map((p) =>
        upsertProduct({
          ...p,
          status: p.status || 'active',
        })
      )
  );
  return { seeded: true, count: list.length };
}

export async function syncAllProducts(products) {
  const list = Array.isArray(products) ? products : [];
  await Promise.all(
    list
      .filter((p) => p && String(p.id || '').trim())
      .map((p) =>
        upsertProduct({
          ...p,
          status: p.status || 'active',
        })
      )
  );
  return { synced: true, count: list.length };
}

export async function seedPostsIfEmpty(posts) {
  const hasAny = await collectionHasAnyDocs('posts');
  if (hasAny) return { seeded: false, count: 0 };
  const list = Array.isArray(posts) ? posts : [];
  await Promise.all(
    list
      .filter((p) => p && String(p.id || '').trim())
      .map((p) =>
        upsertPost({
          ...p,
          status: p.status || 'published',
        })
      )
  );
  return { seeded: true, count: list.length };
}

export async function seedPostsMerge(posts) {
  const list = Array.isArray(posts) ? posts : [];
  await Promise.all(
    list
      .filter((p) => p && String(p.id || '').trim())
      .map((p) =>
        upsertPost({
          ...p,
          status: p.status || 'published',
        })
      )
  );
  return { merged: true, count: list.length };
}

export async function seedProductsMerge(products) {
  const list = Array.isArray(products) ? products : [];
  await Promise.all(
    list
      .filter((p) => p && String(p.id || '').trim())
      .map((p) =>
        upsertProduct({
          ...p,
          status: p.status || 'active',
        })
      )
  );
  return { merged: true, count: list.length };
}

export async function syncExistingProducts(products) {
  const list = Array.isArray(products) ? products : [];
  const snap = await getDocs(collection(db, 'products'));
  const existingIds = new Set(snap.docs.map((d) => d.id));

  const results = { updated: 0, skipped: 0, errors: [] };

  await Promise.all(
    list
      .filter((p) => p && String(p.id || '').trim() && existingIds.has(String(p.id).trim()))
      .map(async (p) => {
        try {
          const { images, id, ...payload } = p;
          await setDoc(
            doc(db, 'products', String(id).trim()),
            {
              ...payload,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
          results.updated++;
        } catch (e) {
          results.errors.push({ id: p.id, reason: e.message });
        }
      })
  );

  results.skipped = list.length - results.updated - results.errors.length;
  return results;
}

export async function deletePost(id) {
  await deleteDoc(doc(db, 'posts', id));
}

// Migrate all posts to add slug field
export async function migratePostsWithSlugs(posts) {
  const results = { updated: 0, skipped: 0, errors: [] };
  const list = Array.isArray(posts) ? posts : [];
  
  for (const post of list) {
    try {
      // Skip if already has slug
      if (post.slug && post.slug.trim()) {
        results.skipped++;
        continue;
      }
      
      // Generate slug from title
      const title = (post.title || '').trim();
      if (!title) {
        results.errors.push({ id: post.id, reason: 'Missing title' });
        continue;
      }
      
      // Generate slug
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      
      await upsertPost({
        ...post,
        slug,
        updatedAt: serverTimestamp(),
      });
      results.updated++;
    } catch (e) {
      results.errors.push({ id: post.id, reason: e.message });
    }
  }
  
  return results;
}

// Promotions
export function listenPromotions(onData, onError) {
  const q = query(collection(db, 'promotions'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onData(list);
    },
    onError
  );
}

export async function upsertPromotion(promotion) {
  const id = String(promotion.id || '').trim();
  if (!id) throw new Error('Missing promotion id');
  const ref = doc(db, 'promotions', id);
  await setDoc(
    ref,
    {
      ...promotion,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deletePromotion(id) {
  await deleteDoc(doc(db, 'promotions', id));
}

export async function seedPromotionsIfEmpty(promotions) {
  const hasAny = await collectionHasAnyDocs('promotions');
  if (hasAny) return { seeded: false, count: 0 };
  const list = Array.isArray(promotions) ? promotions : [];
  await Promise.all(
    list
      .filter((p) => p && String(p.id || '').trim())
      .map((p) =>
        upsertPromotion({
          ...p,
          status: p.status || 'active',
        })
      )
  );
  return { seeded: true, count: list.length };
}

// Orders
export function listenOrders(onData, onError) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onData(list);
    },
    onError
  );
}

export async function createOrder(order) {
  try {
    const id = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('[createOrder] Creating order with ID:', id);
    const ref = doc(db, 'orders', id);

    // Ensure the data is serializable
    const orderData = {
      ...order,
      id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log('[createOrder] Saving order data:', JSON.stringify(orderData, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt') return '[timestamp]';
      return value;
    }));

    await setDoc(ref, orderData, { merge: true });
    console.log('[createOrder] Order saved successfully:', id);
    return { id, ...order };
  } catch (err) {
    console.error('[createOrder] Error saving order:', err);
    console.error('[createOrder] Error details:', {
      code: err.code,
      message: err.message,
      stack: err.stack
    });
    throw err;
  }
}

export async function updateOrderStatus(id, status) {
  const ref = doc(db, 'orders', id);
  await setDoc(
    ref,
    {
      status,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deleteOrder(id) {
  await deleteDoc(doc(db, 'orders', id));
}
