import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Plus,
  Search,
  X,
  LayoutDashboard,
  ShoppingBag,
  ReceiptText,
  FileText,
  User,
  Eye,
  Pencil,
  Trash2,
  Sun,
  Moon,
  LogOut,
  Menu,
  Tag,
  RefreshCw,
  Database,
} from 'lucide-react';
import AdminPromotions from '../components/AdminPromotions.jsx';
import AdminOrders from '../components/AdminOrders.jsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { products as catalogProducts, formatPriceEUR } from '../data/products.js';
import { auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { isAdminEmail } from '../firebase/adminAllowlist.js';
import { uploadImageToCloudinary } from '../cloudinary.js';
import { generateSlug } from '../utils/slug.js';
import {
  deletePost,
  deleteProduct,
  listenPosts,
  listenProducts,
  listenOrders,
  seedPostsIfEmpty,
  seedProductsIfEmpty,
  seedPostsMerge,
  syncAllProducts,
  upsertPost,
  upsertProduct,
} from '../firebase/collections.js';

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

const LS_PRODUCTS = 'mey_admin_products_v1';
const LS_POSTS = 'mey_admin_posts_v1';
const LS_THEME = 'mey_admin_theme_v1';

function seedAdminProducts() {
  return catalogProducts.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.id,
    category: p.category || '—',
    priceCents: p.priceCents || 0,
    stock: 50,
    status: 'active',
    image: p.images?.[0] || '',
    description: p.description || '',
  }));
}

function seedAdminPosts() {
  const img = (p) => encodeURI(p);
  return [
    {
      id: 'post-1',
      title: 'Beauté & Spa : rituels bien‑être à adopter',
      author: 'Mey Beauty',
      category: 'Bien‑être',
      status: 'published',
      date: '2024-10-27',
      excerpt:
        'Les gestes simples qui changent tout : vapeur, massage, hydratation, et une routine spa à reproduire à la maison pour une peau lumineuse.',
      image: img('/soin visage (2).PNG'),
      contentHtml: `
        <p class="blog-article-p">Entre le rythme du quotidien et le stress, notre peau et notre esprit ont besoin de pauses. Le spa, ce n’est pas seulement une “parenthèse plaisir” : c’est un vrai rituel d’équilibre. Bonne nouvelle : tu peux recréer une expérience proche du spa à la maison, avec les bons gestes.</p>

        <h2 class="blog-article-h2">Les 3 piliers d’un rituel spa efficace</h2>
        <p class="blog-article-p">Un rituel qui fonctionne, c’est une combinaison de chaleur (pour détendre), de soins (pour nourrir) et de massage (pour stimuler). L’objectif : relancer la micro‑circulation, apaiser les tensions et redonner de l’éclat.</p>

        <div class="blog-article-img-row">
          <img src="${img('/soin spa (1).JPG')}" alt="Rituel spa" />
          <img src="${img('/massage-corps (2).jpg')}" alt="Massage" />
        </div>

        <h2 class="blog-article-h2">Checklist spa à la maison</h2>
        <ul class="blog-article-list">
          <li>Nettoyage doux (sans agresser)</li>
          <li>Vapeur tiède 3 à 5 minutes</li>
          <li>Masque adapté (hydratant ou purifiant)</li>
          <li>Massage du visage 2 minutes</li>
          <li>Sérum + crème pour sceller l’hydratation</li>
          <li>Infusion + respiration 4‑7‑8</li>
        </ul>

        <div class="blog-article-quote">
          <p>“Une routine simple, répétée régulièrement, fait plus de différence qu’un soin occasionnel.”</p>
          <cite>— Mey Beauty</cite>
        </div>

        <p class="blog-article-p">Astuce : fais ce rituel 1 fois par semaine. Entre‑temps, garde un mini‑rituel quotidien (nettoyage + hydratation + SPF le matin).</p>
      `,
    },
    {
      id: 'post-2',
      title: 'Soin visage : éclat, hydratation et confort',
      author: 'Mey Beauty',
      category: 'Soin Visage',
      status: 'published',
      date: '2024-10-28',
      excerpt:
        'Peau terne, tiraillements, manque d’éclat ? Voici une routine et des techniques simples pour hydrater et illuminer le visage durablement.',
      image: img('/soin visage (2).PNG'),
      contentHtml: `
        <p class="blog-article-p">L’éclat ne se résume pas à un “effet glow” immédiat. Une peau lumineuse est une peau équilibrée : bien hydratée, protégée, et soutenue par une barrière cutanée forte. On te guide pas à pas.</p>

        <h2 class="blog-article-h2">Hydrater vs nourrir : la différence</h2>
        <p class="blog-article-p">Hydrater = apporter de l’eau (humectants). Nourrir = apporter des lipides (huiles, beurres). Les deux sont complémentaires, surtout si la peau tiraille.</p>

        <h2 class="blog-article-h2">Routine éclat (matin/soir)</h2>
        <ul class="blog-article-list">
          <li>Nettoyant doux (matin & soir)</li>
          <li>Sérum hydratant (acide hyaluronique)</li>
          <li>Crème barrière (céramides / beurre léger)</li>
          <li>SPF 50 tous les matins</li>
          <li>Gommage doux 1x/semaine (pas plus)</li>
          <li>Masque hydratant 1x/semaine</li>
        </ul>

        <div class="blog-article-img-row">
          <img src="${img('/soin visage (1).PNG')}" alt="Soin visage" />
          <img src="${img('/beauté regard (3).PNG')}" alt="Regard" />
        </div>

        <div class="blog-article-quote">
          <p>“La constance vaut mieux que la perfection : 10 minutes chaque jour, c’est déjà énorme.”</p>
          <cite>— Mey Beauty</cite>
        </div>

        <p class="blog-article-p">Si ta peau réagit facilement : simplifie (moins de produits), évite les actifs trop forts, et privilégie une routine barrière.</p>
      `,
    },
    {
      id: 'post-3',
      title: 'Beauté du regard : astuces pro pour sublimer',
      author: 'Mey Beauty',
      category: 'Regard',
      status: 'published',
      date: '2024-10-29',
      excerpt:
        'Cils, sourcils, contour de l’œil : les bons réflexes pour un regard frais et structuré, même sans maquillage.',
      image: img('/beauté regard (3).PNG'),
      contentHtml: `
        <p class="blog-article-p">Un regard reposé peut transformer tout le visage. La zone du contour de l’œil est fine et fragile : elle a besoin de douceur, de drainage, et d’une routine ciblée.</p>

        <h2 class="blog-article-h2">Le combo gagnant : froid + drainage</h2>
        <p class="blog-article-p">Le froid aide à décongestionner. Le drainage relance la circulation. Ensemble, ils réduisent l’apparence des poches et réveillent le regard.</p>

        <div class="blog-article-img-row">
          <img src="${img('/Beauty regard.JPG')}" alt="Contour des yeux" />
          <img src="${img('/beauté regard (2).jpg')}" alt="Sourcils" />
        </div>

        <h2 class="blog-article-h2">Routine express (2 minutes)</h2>
        <ul class="blog-article-list">
          <li>Tapotements du coin interne vers l’externe</li>
          <li>Pressions légères sous l’œil (jamais frotter)</li>
          <li>Massage sourcil (lisser vers les tempes)</li>
          <li>Crème contour des yeux (petite quantité)</li>
        </ul>

        <div class="blog-article-quote">
          <p>“Le secret : des gestes légers. Sur le contour de l’œil, moins c’est plus.”</p>
          <cite>— Mey Beauty</cite>
        </div>

        <p class="blog-article-p">Astuce : dors avec la tête légèrement surélevée et hydrate-toi bien. Les poches sont souvent liées à la rétention d’eau et au manque de sommeil.</p>
      `,
    },
    {
      id: 'post-4',
      title: 'Massage du corps : anti‑stress, énergie et récupération',
      author: 'Mey Beauty',
      category: 'Massage',
      status: 'published',
      date: '2024-10-31',
      excerpt:
        'Tensions dans le dos, fatigue mentale, sommeil léger : le massage aide à relâcher et à recharger. Voici comment en tirer le maximum.',
      image: img('/massage-corps (2).jpg'),
      contentHtml: `
        <p class="blog-article-p">Le massage est un soin complet : il agit sur les muscles, le système nerveux et la qualité du sommeil. Que tu choisisses un massage relaxant ou plus tonique, le bénéfice est réel dès la première séance.</p>

        <h2 class="blog-article-h2">Pourquoi on se sent mieux après un massage ?</h2>
        <p class="blog-article-p">Le toucher stimule la relaxation, diminue la sensation de stress et aide le corps à “revenir au calme”. C’est aussi un excellent complément si tu fais du sport ou si tu es souvent assise.</p>

        <h2 class="blog-article-h2">Zones à cibler</h2>
        <ul class="blog-article-list">
          <li>Nuque et trapèzes (tensions écran)</li>
          <li>Bas du dos (posture)</li>
          <li>Jambes (circulation)</li>
          <li>Pieds (détente globale)</li>
        </ul>

        <div class="blog-article-img-row">
          <img src="${img('/massage-corps (1).jpg')}" alt="Massage relaxant" />
          <img src="${img('/soin visage (2).PNG')}" alt="Ambiance spa" />
        </div>

        <div class="blog-article-quote">
          <p>“Ton corps parle en tensions. Le massage, c’est lui répondre avec douceur.”</p>
          <cite>— Mey Beauty</cite>
        </div>

        <p class="blog-article-p">Conseil : après un massage, bois de l’eau et évite le sport intense le jour même. Ton corps a besoin d’intégrer le relâchement.</p>
      `,
    },
    {
      id: 'post-5',
      title: 'Soins minceur : drainage, légèreté et silhouette',
      author: 'Mey Beauty',
      category: 'Minceur',
      status: 'published',
      date: '2024-10-31',
      excerpt:
        'Ballonnements, jambes lourdes, rétention d’eau : le drainage et les soins minceur aident à se sentir plus légère et plus tonique.',
      image: img('/soin minceur (2).jpg'),
      contentHtml: `
        <p class="blog-article-p">Les soins minceur ne sont pas “magiques”, mais ils sont très efficaces pour la sensation de légèreté, la circulation et l’aspect de la peau. Ils fonctionnent encore mieux avec de bonnes habitudes (hydratation, mouvement, sommeil).</p>

        <h2 class="blog-article-h2">Drainage : pour qui ?</h2>
        <p class="blog-article-p">Si tu as les jambes lourdes, de la rétention d’eau ou une sensation de gonflement, le drainage est un excellent choix. Il vise à relancer les flux et améliorer le confort.</p>

        <div class="blog-article-img-row">
          <img src="${img('/soin minceur (1).jpg')}" alt="Soins minceur" />
          <img src="${img('/soin minceur (2).jpg')}" alt="Drainage" />
        </div>

        <h2 class="blog-article-h2">Habitudes qui boostent les résultats</h2>
        <ul class="blog-article-list">
          <li>Marcher 20 minutes par jour</li>
          <li>Boire régulièrement (pas tout d’un coup)</li>
          <li>Limiter le sel le soir</li>
          <li>Auto‑massage 2 minutes/jour</li>
        </ul>

        <div class="blog-article-quote">
          <p>“L’objectif : se sentir bien. La silhouette suit quand le corps retrouve son équilibre.”</p>
          <cite>— Mey Beauty</cite>
        </div>

        <p class="blog-article-p">Pour une vraie cure : 1 séance/semaine pendant 4 à 6 semaines, puis entretien selon ton rythme.</p>
      `,
    },
    {
      id: 'post-6',
      title: 'Routine bien‑être : sommeil, peau et sérénité',
      author: 'Mey Beauty',
      status: 'published',
      category: 'Lifestyle',
      date: '2024-11-01',
      excerpt:
        'Une peau plus belle commence souvent par une vie plus douce : sommeil, respiration, hydratation et micro‑rituels au quotidien.',
      image: img('/meybeauty.jpg'),
      contentHtml: `
        <p class="blog-article-p">On cherche parfois le produit parfait… alors que la base, c’est l’équilibre. Le stress chronique, le manque de sommeil et l’hydratation insuffisante se voient vite sur la peau : teint terne, boutons, sensibilités.</p>

        <h2 class="blog-article-h2">Le trio qui change tout</h2>
        <ul class="blog-article-list">
          <li>Sommeil : régularité + coucher plus tôt</li>
          <li>Hydratation : petites gorgées toute la journée</li>
          <li>Respiration : 2 minutes matin/soir</li>
        </ul>

        <h2 class="blog-article-h2">Rituel du soir (10 minutes)</h2>
        <p class="blog-article-p">Démaquillage doux, crème réconfort, lumière tamisée, et un mini scan corporel (relâcher la mâchoire, les épaules, le ventre). L’objectif : envoyer au cerveau le signal “tout va bien”.</p>

        <div class="blog-article-quote">
          <p>“Le bien‑être, ce n’est pas une destination. C’est une façon de se traiter chaque jour.”</p>
          <cite>— Mey Beauty</cite>
        </div>

        <p class="blog-article-p">Si tu veux un effet visible : choisis 1 micro‑habitude et tiens-la 14 jours. Ensuite, ajoute la suivante. C’est comme ça qu’on crée une vraie routine durable.</p>
      `,
    },
  ];
}

function usePersistentState(key, seedFn) {
  const [state, setState] = useState(() => {
    const existing = readJson(key, null);
    if (existing && Array.isArray(existing)) return existing;
    const seeded = seedFn();
    writeJson(key, seeded);
    return seeded;
  });

  useEffect(() => {
    writeJson(key, state);
  }, [key, state]);

  return [state, setState];
}

function AdminAuth({ onReady }) {
  const [mode, setMode] = useState('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setMode('login');
        onReady(null);
        return;
      }
      const ok = isAdminEmail(user.email);
      if (!ok) {
        setMode('forbidden');
        onReady(null);
        return;
      }
      setMode('ok');
      onReady(user);
    });
    return () => unsub();
  }, [onReady]);

  const doLogin = async () => {
    setError('');
    const e = (email || '').trim();
    if (!e || !password) {
      setError('Email et mot de passe requis.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, e, password);
    } catch (err) {
      setError(err?.message || 'Connexion impossible');
    }
  };

  if (mode === 'loading') {
    return (
      <div className="admin-auth">
        <div className="admin-auth-card">
          <div className="admin-auth-title">Mey Beauty Admin</div>
          <div className="admin-auth-sub">Chargement…</div>
        </div>
      </div>
    );
  }

  if (mode === 'forbidden') {
    return (
      <div className="admin-auth">
        <div className="admin-auth-card">
          <div className="admin-auth-title">Accès refusé</div>
          <div className="admin-auth-sub">Ce compte n’est pas autorisé.</div>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => signOut(auth)}>
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'ok') return null;

  return (
    <div className="admin-auth">
      <div className="admin-auth-card">
        <div className="admin-auth-title">Connexion Admin</div>
        <div className="admin-auth-sub">Email / mot de passe</div>

        <div className="admin-auth-form">
          <div className="admin-form-group admin-form-full">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="admin-form-group admin-form-full">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              onKeyDown={(e) => {
                if (e.key === 'Enter') doLogin();
              }}
            />
          </div>
        </div>

        {error ? <div className="admin-auth-error">{error}</div> : null}

        <button type="button" className="admin-btn admin-btn-primary" onClick={doLogin}>
          Se connecter
        </button>
      </div>
    </div>
  );
}

function formatDateShort(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: '2-digit' });
  } catch {
    return iso;
  }
}

function StatusBadge({ value }) {
  const cls = value === 'published' || value === 'completed' ? 'published' : value === 'draft' ? 'draft' : 'active';
  const label =
    value === 'published'
      ? 'Publié'
      : value === 'draft'
        ? 'Brouillon'
        : value === 'archived'
          ? 'Archivé'
          : value === 'active'
            ? 'Actif'
            : value === 'completed'
              ? 'Terminée'
              : value === 'processing'
                ? 'En cours'
                : value === 'cancelled'
                  ? 'Annulée'
                  : String(value || '');
  return <span className={`admin-status-badge ${cls}`}>{label}</span>;
}

function Drawer({ title, open, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="admin-drawer-overlay" onClick={(e) => (e.target === e.currentTarget ? onClose() : null)}>
      <div className="admin-drawer" role="dialog" aria-label={title}>
        <div className="admin-drawer-header">
          <div className="admin-drawer-title">{title}</div>
          <button type="button" className="admin-drawer-close" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>
        <div className="admin-drawer-body">{children}</div>
        {footer ? <div className="admin-drawer-footer">{footer}</div> : null}
      </div>
    </div>
  );
}

function setAdminHash(params) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v).trim();
    if (!s) return;
    sp.set(k, s);
  });
  window.location.hash = `#admin?${sp.toString()}`;
}

function AdminProductDetail({ product, onBack, onEdit }) {
  if (!product) {
    return (
      <div className="admin-page-view">
        <div className="admin-detail-header">
          <button type="button" className="admin-btn" onClick={onBack}>
            ← Retour
          </button>
        </div>
        <div className="admin-section">
          <div className="admin-empty">Produit introuvable.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-view">
      <div className="admin-detail-header">
        <button type="button" className="admin-btn" onClick={onBack}>
          ← Retour
        </button>
        <div className="admin-detail-actions">
          <button type="button" className="admin-btn admin-btn-primary" onClick={onEdit}>
            <Pencil size={16} />
            Modifier
          </button>
        </div>
      </div>

      <div className="admin-detail-grid">
        <div className="admin-detail-card">
          <div className="admin-detail-hero">
            <img src={product.image || product.images?.[0] || ''} alt={product.name} />
          </div>
          <div className="admin-detail-title">{product.name}</div>
          <div className="admin-detail-sub">Référence : {product.sku}</div>
          <div className="admin-detail-meta">
            <div>
              <div className="admin-detail-label">Catégorie</div>
              <div className="admin-detail-value">{product.category || '—'}</div>
            </div>
            <div>
              <div className="admin-detail-label">Prix</div>
              <div className="admin-detail-value">{formatPriceEUR(product.priceCents || 0)}</div>
            </div>
            <div>
              <div className="admin-detail-label">Stock</div>
              <div className="admin-detail-value">{product.stock ?? '—'}</div>
            </div>
            <div>
              <div className="admin-detail-label">Statut</div>
              <div className="admin-detail-value"><StatusBadge value={product.status || 'active'} /></div>
            </div>
          </div>
        </div>

        <div className="admin-detail-card">
          <div className="admin-detail-label">Description</div>
          <div className="admin-detail-long">{product.description || '—'}</div>
          <div className="admin-detail-label" style={{ marginTop: 16 }}>Image URL</div>
          <div className="admin-detail-mono">{product.image || '—'}</div>
        </div>
      </div>
    </div>
  );
}

function AdminPostDetail({ post, onBack, onEdit }) {
  if (!post) {
    return (
      <div className="admin-page-view">
        <div className="admin-detail-header">
          <button type="button" className="admin-btn" onClick={onBack}>
            ← Retour
          </button>
        </div>
        <div className="admin-section">
          <div className="admin-empty">Article introuvable.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-view">
      <div className="admin-detail-header">
        <button type="button" className="admin-btn" onClick={onBack}>
          ← Retour
        </button>
        <div className="admin-detail-actions">
          <button type="button" className="admin-btn admin-btn-primary" onClick={onEdit}>
            <Pencil size={16} />
            Modifier
          </button>
        </div>
      </div>

      <div className="admin-detail-grid">
        <div className="admin-detail-card">
          <div className="admin-detail-hero">
            <img src={post.image || ''} alt={post.title} />
          </div>
          <div className="admin-detail-title">{post.title}</div>
          <div className="admin-detail-sub">{post.author || 'Mey Beauty'} · {formatDateShort(post.date || '')}</div>
          <div className="admin-detail-meta">
            <div>
              <div className="admin-detail-label">Catégorie</div>
              <div className="admin-detail-value">{post.category || '—'}</div>
            </div>
            <div>
              <div className="admin-detail-label">Statut</div>
              <div className="admin-detail-value"><StatusBadge value={post.status || 'draft'} /></div>
            </div>
          </div>
          <div className="admin-detail-label" style={{ marginTop: 16 }}>Extrait</div>
          <div className="admin-detail-long">{post.excerpt || '—'}</div>
        </div>

        <div className="admin-detail-card">
          <div className="admin-detail-label">Contenu HTML</div>
          <div className="admin-detail-code">{post.contentHtml || '—'}</div>
        </div>
      </div>
    </div>
  );
}

function AdminProducts({ products, setProducts, onOpenDetail, editIdFromNav, clearEditIdFromNav }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [imageBusy, setImageBusy] = useState(false);
  const productFileRef = useRef(null);

  const editing = useMemo(() => products.find((p) => p.id === editingId) || null, [products, editingId]);

  const [form, setForm] = useState({
    brand: '',
    name: '',
    sku: '',
    category: '',
    priceEuros: '',
    stock: 0,
    status: 'active',
    image: '',
    description: '',
    netQuantitiesText: '',
    skinTypesText: '',
    specsText: '',
  });

  useEffect(() => {
    if (!modalOpen) return;
    if (editing) {
      setForm({
        brand: editing.brand || '',
        name: editing.name || '',
        sku: editing.sku || '',
        category: editing.category || '',
        priceEuros: ((Number(editing.priceCents) || 0) / 100).toFixed(2),
        stock: editing.stock || 0,
        status: editing.status || 'active',
        image: editing.image || '',
        description: editing.description || '',
        netQuantitiesText: Array.isArray(editing.netQuantities) ? editing.netQuantities.join(', ') : '',
        skinTypesText: Array.isArray(editing.skinTypes) ? editing.skinTypes.join(', ') : '',
        specsText: Array.isArray(editing.specs) ? editing.specs.map((s) => `${s?.label || ''}:${s?.value || ''}`).join('\n') : '',
      });
    } else {
      setForm({
        brand: '',
        name: '',
        sku: '',
        category: '',
        priceEuros: '',
        stock: 0,
        status: 'active',
        image: '',
        description: '',
        netQuantitiesText: '',
        skinTypesText: '',
        specsText: '',
      });
    }
  }, [modalOpen, editing]);

  useEffect(() => {
    const id = String(editIdFromNav || '').trim();
    if (!id) return;
    openEdit(id);
    if (typeof clearEditIdFromNav === 'function') clearEditIdFromNav();
  }, [editIdFromNav]);

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const hay = [p.name, p.sku, p.category, p.status].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [products, query]);

  useEffect(() => {
    setPage(1);
  }, [query, products.length]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  const openCreate = () => {
    setEditingId('');
    setModalOpen(true);
  };

  const openEdit = (id) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const openDetail = (id) => {
    if (typeof onOpenDetail === 'function') onOpenDetail(id);
  };

  const save = () => {
    const parseEurosToCents = (v) => {
      const raw = String(v ?? '').trim().replace(',', '.');
      const n = Number(raw);
      if (!Number.isFinite(n)) return 0;
      return Math.max(0, Math.round(n * 100));
    };

    const splitList = (s) =>
      String(s || '')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean);

    const parseSpecs = (s) => {
      const lines = String(s || '')
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean);
      return lines
        .map((line) => {
          const idx = line.indexOf(':');
          if (idx < 0) return null;
          const label = line.slice(0, idx).trim();
          const value = line.slice(idx + 1).trim();
          if (!label || !value) return null;
          return { label, value };
        })
        .filter(Boolean);
    };

    const payload = {
      id: editingId || uid('prod'),
      brand: form.brand.trim() || 'Mey Beauty',
      name: form.name.trim() || 'Produit',
      sku: form.sku.trim() || (editingId || uid('SKU')),
      category: form.category.trim() || '—',
      priceCents: parseEurosToCents(form.priceEuros),
      stock: Math.max(0, Number(form.stock) || 0),
      status: form.status,
      image: form.image.trim(),
      images: form.image.trim() ? [form.image.trim()] : [],
      description: form.description,
      netQuantities: splitList(form.netQuantitiesText),
      skinTypes: splitList(form.skinTypesText),
      specs: parseSpecs(form.specsText),
    };

    setProducts((prev) => {
      const exists = prev.some((p) => p.id === payload.id);
      if (exists) return prev.map((p) => (p.id === payload.id ? payload : p));
      return [payload, ...prev];
    });

    upsertProduct(payload).catch(() => {
      // ignore
    });

    setModalOpen(false);
  };

  const remove = (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    deleteProduct(id).catch(() => {
      // ignore
    });
  };

  return (
    <div className="admin-page-view">
      <div className="admin-section">
        <div className="admin-section-header">
          <div className="admin-section-title">Produits</div>
          <div className="admin-section-actions">
            <div className="admin-search">
              <Search size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher…" />
            </div>
            <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
              <Plus size={16} />
              Ajouter
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id}>
                  <td>
                    <button type="button" className="admin-row-link" onClick={() => openDetail(p.id)}>
                      <div className="admin-product-cell">
                        <img className="admin-product-img" src={p.image || p.images?.[0] || '/produits/produit (1).webp'} alt={p.name} />
                        <div>
                          <div className="admin-product-name">{p.name}</div>
                          <div className="admin-product-sku">Réf : {p.sku}</div>
                        </div>
                      </div>
                    </button>
                  </td>
                  <td>{p.category}</td>
                  <td>{formatPriceEUR(p.priceCents)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <StatusBadge value={p.status} />
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" className="admin-action-btn" title="Voir" onClick={() => openDetail(p.id)}>
                        <Eye size={14} />
                      </button>
                      <button type="button" className="admin-action-btn" title="Modifier" onClick={() => openEdit(p.id)}>
                        <Pencil size={14} />
                      </button>
                      <button type="button" className="admin-action-btn" title="Supprimer" onClick={() => remove(p.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 ? (
            <div className="admin-empty">Aucun résultat.</div>
          ) : null}

          {filtered.length > pageSize ? (
            <div className="admin-pagination">
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage(1)} disabled={safePage === 1}>
                «
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>
                ‹
              </button>
              <div className="admin-page-indicator">
                Page {safePage} / {totalPages}
              </div>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
                ›
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage(totalPages)} disabled={safePage === totalPages}>
                »
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <Drawer
        title={editing ? 'Modifier le produit' : 'Ajouter un produit'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>
              Annuler
            </button>
            <button type="button" className="admin-btn admin-btn-primary" onClick={save}>
              Enregistrer
            </button>
          </>
        }
      >
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>Marque</label>
            <input value={form.brand} onChange={(e) => setForm((s) => ({ ...s, brand: e.target.value }))} />
          </div>
          <div className="admin-form-group admin-form-full">
            <label>Nom</label>
            <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Référence (SKU)</label>
            <input value={form.sku} onChange={(e) => setForm((s) => ({ ...s, sku: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Catégorie</label>
            <input value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Prix (€)</label>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              value={form.priceEuros}
              onChange={(e) => setForm((s) => ({ ...s, priceEuros: e.target.value }))}
            />
          </div>
          <div className="admin-form-group">
            <label>Stock</label>
            <input type="number" value={form.stock} onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Statut</label>
            <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}>
              <option value="active">Actif</option>
              <option value="draft">Brouillon</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
          <div className="admin-form-group admin-form-full">
            <label>Image (URL)</label>
            <input value={form.image} onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))} />
          </div>
          <div className="admin-form-group admin-form-full">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => (productFileRef.current ? productFileRef.current.click() : null)}
              disabled={imageBusy}
            >
              {imageBusy ? 'Upload…' : 'Uploader une image'}
            </button>
            <input
              ref={productFileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e?.target?.files?.[0];
                if (!file) return;
                try {
                  setImageBusy(true);
                  const url = await uploadImageToCloudinary(file);
                  setForm((s) => ({ ...s, image: url }));
                } catch {
                  // ignore
                } finally {
                  setImageBusy(false);
                  if (productFileRef.current) productFileRef.current.value = '';
                }
              }}
            />
          </div>
          <div className="admin-form-group admin-form-full">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} rows={4} />
          </div>

          <div className="admin-form-group admin-form-full">
            <label>Quantité nette (options, séparées par des virgules)</label>
            <input
              value={form.netQuantitiesText}
              onChange={(e) => setForm((s) => ({ ...s, netQuantitiesText: e.target.value }))}
              placeholder="ex: 50ml, 100ml, 150ml"
            />
          </div>

          <div className="admin-form-group admin-form-full">
            <label>Type de peau (options, séparées par des virgules)</label>
            <input
              value={form.skinTypesText}
              onChange={(e) => setForm((s) => ({ ...s, skinTypesText: e.target.value }))}
              placeholder="ex: Grasse, Sèche, Normale, Tous types"
            />
          </div>

          <div className="admin-form-group admin-form-full">
            <label>Spécifications (1 par ligne: label: valeur)</label>
            <textarea
              value={form.specsText}
              onChange={(e) => setForm((s) => ({ ...s, specsText: e.target.value }))}
              rows={5}
              placeholder={'Marque: Botan\nCatégorie: Autobronzants & solaires'}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
}

function AdminBlog({ posts, setPosts, onOpenDetail }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.trim().toLowerCase();
    return posts.filter((p) => [p.title, p.author, p.category, p.status].join(' ').toLowerCase().includes(q));
  }, [posts, query]);

  useEffect(() => {
    setPage(1);
  }, [query, posts.length]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  const openCreate = () => {
    window.location.hash = '#admin?view=post-edit&id=new';
  };

  const openEdit = (id) => {
    window.location.hash = `#admin?view=post-edit&id=${encodeURIComponent(id)}`;
  };

  const openDetail = (id) => {
    if (typeof onOpenDetail === 'function') onOpenDetail(id);
  };

  const remove = (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    deletePost(id).catch(() => {
      // ignore
    });
  };

  return (
    <div className="admin-page-view">
      <div className="admin-section">
        <div className="admin-section-header">
          <div className="admin-section-title">Articles</div>
          <div className="admin-section-actions">
            <div className="admin-search">
              <Search size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher…" />
            </div>
            <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
              <Plus size={16} />
              Nouveau
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Auteur</th>
                <th>Catégorie</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id}>
                  <td>
                    <button type="button" className="admin-row-link" onClick={() => openDetail(p.id)}>
                      <div className="admin-post-title">{p.title}</div>
                      <div className="admin-post-excerpt">{p.excerpt}</div>
                    </button>
                  </td>
                  <td>{p.author}</td>
                  <td>{p.category}</td>
                  <td>{formatDateShort(p.date)}</td>
                  <td>
                    <StatusBadge value={p.status} />
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" className="admin-action-btn" title="Voir" onClick={() => openDetail(p.id)}>
                        <Eye size={14} />
                      </button>
                      <button type="button" className="admin-action-btn" title="Modifier" onClick={() => openEdit(p.id)}>
                        <Pencil size={14} />
                      </button>
                      <button type="button" className="admin-action-btn" title="Supprimer" onClick={() => remove(p.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length > pageSize ? (
            <div className="admin-pagination">
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage(1)} disabled={safePage === 1}>
                «
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>
                ‹
              </button>
              <div className="admin-page-indicator">
                Page {safePage} / {totalPages}
              </div>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
                ›
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage(totalPages)} disabled={safePage === totalPages}>
                »
              </button>
            </div>
          ) : null}
        </div>
      </div>

    </div>
  );
}

function AdminPostEditor({ userEmail, posts, setPosts, postId, onBack }) {
  const existing = useMemo(() => posts.find((p) => p.id === postId) || null, [posts, postId]);
  const isNew = postId === 'new' || !postId;

  const [saving, setSaving] = useState(false);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [form, setForm] = useState(() => ({
    title: existing?.title || '',
    author: existing?.author || 'Mey Beauty',
    category: existing?.category || 'Wellness',
    status: existing?.status || 'draft',
    excerpt: existing?.excerpt || '',
    image: existing?.image || '',
    contentHtml: existing?.contentHtml || '',
  }));

  const fileInputRef = useRef(null);
  const coverFileRef = useRef(null);
  const quillRef = useRef(null);
  const draftIdRef = useRef(isNew ? uid('post') : postId);

  const insertImageIntoEditor = (url) => {
    try {
      const editor = quillRef.current?.getEditor?.();
      if (!editor) return;
      const range = editor.getSelection(true);
      const index = typeof range?.index === 'number' ? range.index : editor.getLength();
      editor.insertEmbed(index, 'image', url, 'user');
      editor.setSelection(index + 1);
    } catch {
      // ignore
    }
  };

  const insertHtmlIntoEditor = (html) => {
    try {
      const editor = quillRef.current?.getEditor?.();
      if (!editor) return;
      const range = editor.getSelection(true);
      const index = typeof range?.index === 'number' ? range.index : editor.getLength();
      editor.clipboard.dangerouslyPasteHTML(index, html);
      editor.setSelection(index + 1);
    } catch {
      // ignore
    }
  };

  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: () => {
            const mode = window.prompt('Image: 1 = URL, 2 = Upload fichier', '1');
            if (mode === '2') {
              if (fileInputRef.current) fileInputRef.current.click();
              return;
            }
            const url = window.prompt('URL de l\'image (https://...)');
            if (!url) return;
            insertImageIntoEditor(String(url).trim());
          },
        },
      },
    }),
    []
  );

  const quillFormats = useMemo(
    () => ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link', 'image'],
    []
  );

  useEffect(() => {
    setForm({
      title: existing?.title || '',
      author: existing?.author || 'Mey Beauty',
      category: existing?.category || 'Wellness',
      status: existing?.status || 'draft',
      excerpt: existing?.excerpt || '',
      image: existing?.image || '',
      contentHtml: existing?.contentHtml || '',
    });
  }, [existing?.id]);

  const onPickMediaFile = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    try {
      setMediaBusy(true);
      const url = await uploadImageToCloudinary(file);
      setForm((p) => ({
        ...p,
        image: p.image || url,
      }));
      insertImageIntoEditor(String(url).trim());
    } catch {
      // ignore
    } finally {
      setMediaBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onPickCoverFile = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    try {
      setMediaBusy(true);
      const url = await uploadImageToCloudinary(file);
      setForm((p) => ({
        ...p,
        image: String(url || '').trim(),
      }));
    } catch {
      // ignore
    } finally {
      setMediaBusy(false);
      if (coverFileRef.current) coverFileRef.current.value = '';
    }
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const title = (form.title || '').trim() || 'Article';
      const slug = generateSlug(title);
      const payload = {
        id: isNew ? draftIdRef.current : postId,
        title,
        slug,
        author: (form.author || '').trim() || 'Mey Beauty',
        category: (form.category || '').trim() || 'Wellness',
        status: form.status || 'draft',
        date: existing?.date || new Date().toISOString(),
        excerpt: form.excerpt || '',
        image: (form.image || '').trim(),
        contentHtml: form.contentHtml || '',
      };

      setPosts((prev) => {
        const exists = prev.some((p) => p.id === payload.id);
        if (exists) return prev.map((p) => (p.id === payload.id ? payload : p));
        return [payload, ...prev];
      });
      await upsertPost(payload);
      if (typeof onBack === 'function') onBack(payload.id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-section admin-editor">
      <div className="admin-editor-top">
        <div>
          <div className="admin-section-title">{isNew ? 'Créer un article' : "Modifier l'article"}</div>
          <div className="admin-editor-sub">Melanie · Blog</div>
        </div>
        <div className="admin-editor-top-actions">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => (typeof onBack === 'function' ? onBack() : null)}>
            Retour
          </button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="admin-editor-grid">
        <div className="admin-editor-main">
          <div className="admin-editor-box">
            <input
              className="admin-editor-title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Titre de l’article"
            />
          </div>

          <div className="admin-editor-box">
            <div className="admin-editor-toolbar">
              <button
                type="button"
                className="admin-editor-tool"
                aria-label="Médias"
                onClick={() => (fileInputRef.current ? fileInputRef.current.click() : null)}
                disabled={mediaBusy}
              >
                {mediaBusy ? 'Upload…' : '+Image'}
              </button>
              <div className="admin-editor-toolbar-blocks">
                <button type="button" className="admin-editor-tool" onClick={() => insertHtmlIntoEditor('<h2 class="blog-article-h2">Titre de section</h2>')}>
                  +H2
                </button>
                <button type="button" className="admin-editor-tool" onClick={() => insertHtmlIntoEditor('<p class="blog-article-p">Votre paragraphe…</p>')}>
                  +P
                </button>
                <button
                  type="button"
                  className="admin-editor-tool"
                  onClick={() =>
                    insertHtmlIntoEditor(
                      '<div class="blog-article-quote"><p>Votre citation inspirante…</p><cite>— Mey Beauty</cite></div>'
                    )
                  }
                >
                  +Citation
                </button>
                <button
                  type="button"
                  className="admin-editor-tool"
                  onClick={() =>
                    insertHtmlIntoEditor(
                      '<ul class="blog-article-list">' +
                        '<li>Point 1</li><li>Point 2</li><li>Point 3</li><li>Point 4</li>' +
                      '</ul>'
                    )
                  }
                >
                  +Liste
                </button>
                <button
                  type="button"
                  className="admin-editor-tool"
                  onClick={() =>
                    insertHtmlIntoEditor(
                      '<div class="blog-article-img-row">' +
                        '<img src="" alt="" />' +
                        '<img src="" alt="" />' +
                      '</div>'
                    )
                  }
                  
                >
                  +2 img
                </button>
              </div>
              <div className="admin-editor-toolbar-right">
                <span className="admin-editor-pill">Visuel</span>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPickMediaFile} />
            <div className="admin-quill">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={form.contentHtml}
                onChange={(val) => setForm((p) => ({ ...p, contentHtml: val }))}
                placeholder="Rédige ton article ici…"
                modules={quillModules}
                formats={quillFormats}
              />
            </div>
          </div>
        </div>

        <aside className="admin-editor-side">
          <div className="admin-editor-card">
            <div className="admin-editor-card-title">Publication</div>
            <div className="admin-form-grid">
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Statut</label>
                <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Catégorie</label>
                <input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
              </div>
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Auteur</label>
                <input value={form.author} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} />
              </div>
            </div>
          </div>

          <div className="admin-editor-card">
            <div className="admin-editor-card-title">Image</div>
            <div className="admin-form-group">
              <label>URL</label>
              <input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} placeholder="/image.jpg" />
            </div>
            <div className="admin-form-group">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => (coverFileRef.current ? coverFileRef.current.click() : null)}
                disabled={mediaBusy}
              >
                {mediaBusy ? 'Upload…' : "Remplacer l'image"}
              </button>
              <input ref={coverFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPickCoverFile} />
            </div>
            {form.image ? (
              <div className="admin-cover-preview">
                <img src={form.image} alt="Aperçu" />
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setForm((p) => ({ ...p, image: '' }))}
                >
                  Supprimer
                </button>
              </div>
            ) : null}
          </div>

          <div className="admin-editor-card">
            <div className="admin-editor-card-title">Extrait</div>
            <div className="admin-form-group">
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                rows={5}
                placeholder="Résumé…"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function AdminDashboard({ products, posts, orders, userEmail, onGoProducts, onGoBlog }) {
  const stats = useMemo(() => {
    const totalRevenueCents = (orders || []).reduce((sum, o) => sum + (o.totalCents || 0), 0);
    const totalOrders = (orders || []).length;
    const activeProducts = products.length;
    const publishedPosts = posts.filter((p) => p.status === 'published').length;
    return {
      revenue: formatPriceEUR(totalRevenueCents),
      orders: totalOrders.toLocaleString('fr-FR'),
      products: activeProducts.toLocaleString('fr-FR'),
      posts: publishedPosts.toLocaleString('fr-FR'),
    };
  }, [products, posts, orders]);

  return (
    <div className="admin-page-view">
      <div className="admin-welcome-banner">
        <div className="admin-welcome-content">
          <div className="admin-welcome-title">Bienvenue, Melanie </div>
          <div className="admin-welcome-subtitle">
            Voici un aperçu de vos performances aujourd’hui.
          </div>
          <div className="admin-welcome-actions">
            <button type="button" className="admin-btn admin-btn-primary" onClick={onGoProducts}>
              <Plus size={16} />
              Nouveau Produit
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={onGoBlog}>
              <FileText size={16} />
              Nouvel Article
            </button>
          </div>
        </div>
        <div
          className="admin-welcome-illustration"
          aria-hidden="true"
        />
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Chiffre d’affaires</div>
          <div className="admin-stat-value">{stats.revenue}</div>
          <div className="admin-stat-sub">Ce mois‑ci</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Commandes</div>
          <div className="admin-stat-value">{stats.orders}</div>
          <div className="admin-stat-sub">Ce mois‑ci</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Produits</div>
          <div className="admin-stat-value">{stats.products}</div>
          <div className="admin-stat-sub">Catalogue actif</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Articles publiés</div>
          <div className="admin-stat-value">{stats.posts}</div>
          <div className="admin-stat-sub">Blog</div>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <div className="admin-section-title">Raccourcis</div>
        </div>
        <div className="admin-cards-row">
          <a
            className="admin-mini-card admin-mini-card-media"
            href="#admin?view=products"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80')",
            }}
          >
            <ShoppingBag size={18} />
            <div>
              <div className="admin-mini-card-title">Gérer les produits</div>
              <div className="admin-mini-card-sub">Ajouter / modifier</div>
            </div>
          </a>
          <a
            className="admin-mini-card admin-mini-card-media"
            href="#admin?view=orders"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80')",
            }}
          >
            <ReceiptText size={18} />
            <div>
              <div className="admin-mini-card-title">Voir les commandes</div>
              <div className="admin-mini-card-sub">Suivi & statut</div>
            </div>
          </a>
          <a
            className="admin-mini-card admin-mini-card-media"
            href="#admin?view=blog"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80')",
            }}
          >
            <FileText size={18} />
            <div>
              <div className="admin-mini-card-title">Blog</div>
              <div className="admin-mini-card-sub">Publier des articles</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

function parseAdminState(hash) {
  const idx = hash.indexOf('?');
  const query = idx >= 0 ? hash.slice(idx + 1) : '';
  const params = new URLSearchParams(query);
  return {
    view: params.get('view') || 'dashboard',
    id: params.get('id') || '',
    edit: params.get('edit') || '',
  };
}

export default function AdminPage() {
  const [state, setState] = useState(() => parseAdminState(window.location.hash || ''));
  const [products, setProducts] = usePersistentState(LS_PRODUCTS, seedAdminProducts);
  const [posts, setPosts] = usePersistentState(LS_POSTS, seedAdminPosts);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = String(window.localStorage.getItem(LS_THEME) || '').trim().toLowerCase();
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const onHash = () => setState(parseAdminState(window.location.hash || ''));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [state.view, state.id]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LS_THEME, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    if (!user) return;

    const unsubProducts = listenProducts(
      (list) => {
        if (Array.isArray(list)) setProducts(list);
      },
      () => {
        // ignore
      }
    );

    const unsubPosts = listenPosts(
      (list) => {
        if (Array.isArray(list)) setPosts(list);
      },
      () => {
        // ignore
      }
    );

    const unsubOrders = listenOrders(
      (list) => {
        if (Array.isArray(list)) setOrders(list);
      },
      () => {
        // ignore
      }
    );

    return () => {
      unsubProducts();
      unsubPosts();
      unsubOrders();
    };
  }, [user, setProducts, setPosts]);

  const view = state.view;
  const selectedId = state.id;
  const editIdFromNav = state.edit;
  const title =
    view === 'products'
      ? 'Produits'
      : view === 'product'
        ? 'Produit'
        : view === 'orders'
          ? 'Commandes'
          : view === 'blog'
            ? 'Blog'
            : view === 'post-edit'
              ? 'Éditeur'
            : view === 'post'
              ? 'Article'
              : 'Dashboard';

  const selectedProduct = useMemo(() => products.find((p) => p.id === selectedId) || null, [products, selectedId]);
  const selectedPost = useMemo(() => posts.find((p) => p.id === selectedId) || null, [posts, selectedId]);

  const [seedBusy, setSeedBusy] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  const [topbarQuery, setTopbarQuery] = useState('');

  const effectiveTopbarQuery = String(topbarQuery || '').trim();

  const runSeedIfEmpty = async () => {
    if (seedBusy) return;
    setSeedMsg('');
    setSeedBusy(true);
    try {
      const seedProducts = (catalogProducts || []).map((p) => ({
        id: p.id,
        brand: p.brand || 'Mey Beauty',
        category: p.category || '—',
        name: p.name,
        description: p.description || '',
        priceCents: p.priceCents || 0,
        currency: p.currency || 'EUR',
        images: Array.isArray(p.images) ? p.images : [],
        image: p.images?.[0] || '',
        status: 'active',
      }));
      const seedPosts = seedAdminPosts().map((p) => ({
        id: p.id,
        title: p.title,
        author: p.author || 'Mey Beauty',
        category: p.category || 'Wellness',
        status: p.status || 'published',
        date: p.date || new Date().toISOString(),
        excerpt: p.excerpt || '',
        image: p.image || '',
        contentHtml: p.contentHtml || '<p>Votre contenu ici…</p>',
      }));

      const [prodRes, postRes] = await Promise.all([
        seedProductsIfEmpty(seedProducts),
        seedPostsIfEmpty(seedPosts),
      ]);
      setSeedMsg(
        `Seed terminé. Produits: ${prodRes.seeded ? prodRes.count : 0} | Articles: ${postRes.seeded ? postRes.count : 0}`
      );
    } catch (e) {
      setSeedMsg(e?.message || 'Seed impossible');
    } finally {
      setSeedBusy(false);
      setTimeout(() => setSeedMsg(''), 4000);
    }
  };

  const runSyncPosts = async () => {
    if (seedBusy) return;
    setSeedMsg('');
    setSeedBusy(true);
    try {
      const seedPosts = seedAdminPosts().map((p) => ({
        id: p.id,
        title: p.title,
        author: p.author || 'Mey Beauty',
        category: p.category || 'Wellness',
        status: p.status || 'published',
        date: p.date || new Date().toISOString(),
        excerpt: p.excerpt || '',
        image: p.image || '',
        contentHtml: p.contentHtml || '<p>Votre contenu ici…</p>',
      }));

      const res = await seedPostsMerge(seedPosts);
      setSeedMsg(`Synchronisation articles: ${res.count}`);
    } catch (e) {
      setSeedMsg(e?.message || 'Sync impossible');
    } finally {
      setSeedBusy(false);
      setTimeout(() => setSeedMsg(''), 4000);
    }
  };

  const runForceSyncProducts = async () => {
    if (seedBusy) return;
    setSeedMsg('');
    setSeedBusy(true);
    try {
      const seedProducts = catalogProducts.map((p) => ({
        id: p.id,
        brand: p.brand || 'LPG',
        category: p.category || '—',
        name: p.name,
        description: p.description || '',
        priceCents: p.priceCents || 0,
        currency: p.currency || 'EUR',
        images: Array.isArray(p.images) ? p.images : [],
        image: p.images?.[0] || '',
        status: 'active',
      }));

      const res = await syncAllProducts(seedProducts);
      setSeedMsg(`Synchronisation produits: ${res.count} produits`);
    } catch (e) {
      setSeedMsg(e?.message || 'Sync impossible');
    } finally {
      setSeedBusy(false);
      setTimeout(() => setSeedMsg(''), 4000);
    }
  };

  const navItems = [
    { key: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="admin-nav-icon" /> },
    { key: 'products', label: 'Produits', icon: <ShoppingBag className="admin-nav-icon" /> },
    { key: 'promotions', label: 'Promotions', icon: <Tag className="admin-nav-icon" /> },
    { key: 'orders', label: 'Commandes', icon: <ReceiptText className="admin-nav-icon" /> },
    { key: 'blog', label: 'Blog', icon: <FileText className="admin-nav-icon" /> },
  ];

  return (
    <main className="admin-page" data-theme={theme}>
      <AdminAuth onReady={setUser} />
      {!user ? null : (
        <div className="admin-container">
          <div
            className={`admin-mobile-overlay${mobileNavOpen ? ' open' : ''}`}
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <aside className={`admin-sidebar${mobileNavOpen ? ' open' : ''}`}>
            <div className="admin-sidebar-header">
              <div className="admin-logo">
                {theme === 'dark' ? (
                  <span className="admin-logo-text">Mey Beauty</span>
                ) : (
                  <img className="admin-logo-img" src="/mey-beauty.png" alt="Mey Beauty" loading="lazy" />
                )}
                <span className="admin-badge">ADMIN</span>
              </div>
            </div>

            <nav className="admin-sidebar-nav">
              <div className="admin-nav-section-title">E‑Commerce</div>
              {navItems.map((it) => (
                <a
                  key={it.key}
                  className={`admin-nav-link${view === it.key ? ' active' : ''}${it.disabled ? ' disabled' : ''}`}
                  href={it.disabled ? undefined : `#admin?view=${encodeURIComponent(it.key)}`}
                  onClick={(e) => {
                    if (it.disabled) {
                      e.preventDefault();
                      return;
                    }
                    e.preventDefault();
                    setMobileNavOpen(false);
                    setAdminHash({ view: it.key });
                  }}
                >
                  {it.icon}
                  <span>{it.label}</span>
                  {it.key === 'products' ? <span className="admin-nav-pill">{products.length}</span> : null}
                </a>
              ))}

              <div className="admin-nav-section-title">Site</div>
              <a
                className="admin-nav-link"
                href="#home"
                onClick={() => setMobileNavOpen(false)}
              >
                Retour au site
              </a>
            </nav>

            <div className="admin-sidebar-footer">
              <div className="admin-user-card">
                <button type="button" className="admin-user-logout" onClick={() => signOut(auth)}>
                  Déconnexion
                </button>
                <div className="admin-user-row">
                  <img
                    className="admin-user-avatar-img"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                    alt="Admin"
                    loading="lazy"
                  />
                  <div className="admin-user-info">
                    <div className="admin-user-name">Melanie</div>
                    <div className="admin-user-role">Administrateur</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="admin-main">
            <div className="admin-topbar">
              <div className="admin-topbar-left">
                <button
                  type="button"
                  className="admin-icon-btn admin-mobile-menu-btn"
                  aria-label="Ouvrir le menu"
                  onClick={() => setMobileNavOpen(true)}
                >
                  <Menu size={18} />
                </button>
                <div className="admin-topbar-title">{title}</div>
                <div className="admin-topbar-breadcrumb">Accueil › <span>{title}</span></div>
              </div>
              <div className="admin-topbar-actions">
                <div className="admin-topbar-search">
                  <Search size={18} />
                  <input
                    placeholder="Rechercher..."
                    value={topbarQuery}
                    onChange={(e) => setTopbarQuery(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label={theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}
                  onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <ProfileMenu userEmail={user?.email || ''} onLogout={() => signOut(auth)} />
              </div>
            </div>

          <div className="admin-content">
            {view === 'products' ? (
              <AdminProducts
                products={
                  effectiveTopbarQuery
                    ? products.filter((p) => {
                        const hay = [p.name, p.sku, p.category, p.status].filter(Boolean).join(' ').toLowerCase();
                        return hay.includes(effectiveTopbarQuery.toLowerCase());
                      })
                    : products
                }
                setProducts={setProducts}
                onOpenDetail={(id) => setAdminHash({ view: 'product', id })}
                editIdFromNav={editIdFromNav}
                clearEditIdFromNav={() => setAdminHash({ view: 'products' })}
              />
            ) : view === 'promotions' ? (
              <AdminPromotions products={products} externalQuery={effectiveTopbarQuery} />
            ) : view === 'product' ? (
              <AdminProductDetail
                product={selectedProduct}
                onBack={() => setAdminHash({ view: 'products' })}
                onEdit={() => setAdminHash({ view: 'products', edit: selectedId })}
              />
            ) : view === 'orders' ? (
              <AdminOrders />
            ) : view === 'blog' ? (
              <AdminBlog
                posts={
                  effectiveTopbarQuery
                    ? posts.filter((p) =>
                        [p.title, p.author, p.category, p.status]
                          .filter(Boolean)
                          .join(' ')
                          .toLowerCase()
                          .includes(effectiveTopbarQuery.toLowerCase())
                      )
                    : posts
                }
                setPosts={setPosts}
                onOpenDetail={(id) => setAdminHash({ view: 'post', id })}
              />
            ) : view === 'post-edit' ? (
              <AdminPostEditor
                userEmail={user?.email || ''}
                posts={posts}
                setPosts={setPosts}
                postId={selectedId}
                onBack={() => setAdminHash({ view: 'blog' })}
              />
            ) : view === 'post' ? (
              <AdminPostDetail
                post={selectedPost}
                onBack={() => setAdminHash({ view: 'blog' })}
                onEdit={() => setAdminHash({ view: 'post-edit', id: selectedId })}
              />
            ) : (
              <AdminDashboard
                products={products}
                posts={posts}
                orders={orders}
                userEmail={user?.email || ''}
                onGoProducts={() => setAdminHash({ view: 'products' })}
                onGoBlog={() => setAdminHash({ view: 'blog' })}
              />
            )}
          </div>
        </section>
      </div>
      )}
    </main>
  );
}

function ProfileMenu({ userEmail, onLogout }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      const root = document.querySelector('[data-profile-menu-root="1"]');
      if (root && !root.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => (e.key === 'Escape' ? setOpen(false) : null);
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <div className="admin-profile-menu" data-profile-menu-root="1">
      <button type="button" className="admin-icon-btn" aria-label="Profil" onClick={() => setOpen((v) => !v)}>
        <User size={18} />
      </button>
      {open ? (
        <div className="admin-profile-dropdown" role="menu">
              <div className="admin-profile-head">
                <div className="admin-profile-title">Admin</div>
                <div className="admin-profile-email">Melanie</div>
              </div>
          <button type="button" className="admin-profile-item" onClick={() => (typeof onLogout === 'function' ? onLogout() : null)}>
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      ) : null}
    </div>
  );
}
