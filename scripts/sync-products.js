import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const envPath = join(rootDir, '.env');

// Parse optional .env file at project root
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

// Validate required env vars
const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error('Variables d\'environnement manquantes :', missing.join(', '));
  console.error('Crée un fichier .env à la racine ou exporte les variables VITE_FIREBASE_* avant de lancer ce script.');
  process.exit(1);
}

// Import after env vars are set so firebase.js initializes correctly
const { products } = await import(join(rootDir, 'src', 'data', 'products.js'));
const { syncExistingProducts } = await import(join(rootDir, 'src', 'firebase', 'collections.js'));

console.log(`[Sync] ${products.length} produits locaux trouvés`);
console.log('[Sync] Vérification des documents existants dans Firestore...');

const results = await syncExistingProducts(products);

console.log('\n[Sync] Résultat :');
console.log(`  Mis à jour : ${results.updated}`);
console.log(`  Ignorés (inexistants dans Firestore) : ${results.skipped}`);
console.log(`  Erreurs : ${results.errors.length}`);

if (results.errors.length > 0) {
  console.error('\n[Sync] Erreurs rencontrées :');
  for (const err of results.errors) {
    console.error(`  - ${err.id}: ${err.reason}`);
  }
  process.exit(1);
}

console.log('\n[Sync] Terminé avec succès.');
