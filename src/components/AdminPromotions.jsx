import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, X, Eye, Pencil, Trash2, Tag, Percent, Calendar, Package, TagIcon, Sparkles } from 'lucide-react';
import { listenPromotions, upsertPromotion, deletePromotion } from '../firebase/collections.js';
import { uploadImageToCloudinary } from '../cloudinary.js';
import { formatPriceEUR } from '../data/products.js';

const PROMO_TYPES = [
  { value: 'percentage', label: 'Pourcentage (%)' },
  { value: 'fixed', label: 'Montant fixe (€)' },
];

const PROMO_STATUSES = [
  { value: 'active', label: 'Actif', color: '#10b981' },
  { value: 'scheduled', label: 'Programmé', color: '#3b82f6' },
  { value: 'expired', label: 'Expiré', color: '#6b7280' },
  { value: 'draft', label: 'Brouillon', color: '#f59e0b' },
];

const BADGE_COLORS = [
  { value: '#ef4444', label: 'Rouge' },
  { value: '#f59e0b', label: 'Orange' },
  { value: '#10b981', label: 'Vert' },
  { value: '#3b82f6', label: 'Bleu' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#ec4899', label: 'Rose' },
  { value: '#1f2937', label: 'Noir' },
];

function uid() {
  return `promo_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

function getStatusLabel(status) {
  return PROMO_STATUSES.find((s) => s.value === status)?.label || status;
}

function getStatusColor(status) {
  return PROMO_STATUSES.find((s) => s.value === status)?.color || '#6b7280';
}

export default function AdminPromotions({ products, externalQuery }) {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageBusy, setImageBusy] = useState(false);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    discountType: 'percentage',
    discountValue: '',
    originalPrice: '',
    badgeText: 'PROMO',
    badgeColor: '#ef4444',
    startDate: '',
    endDate: '',
    status: 'draft',
    productIds: [],
    applyToAll: false,
    stockLimit: '',
    priority: 0,
  });

  useEffect(() => {
    setLoading(true);
    const unsubscribe = listenPromotions(
      (data) => {
        setPromotions(data || []);
        setLoading(false);
      },
      (err) => {
        console.error('Promotions error:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe?.();
  }, []);

  const filtered = useMemo(() => {
    const q = (externalQuery || query).toLowerCase().trim();
    if (!q) return promotions;
    return promotions.filter((p) =>
      [p.title, p.description, p.badgeText, p.status].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [promotions, query, externalQuery]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      image: '',
      discountType: 'percentage',
      discountValue: '',
      originalPrice: '',
      badgeText: 'PROMO',
      badgeColor: '#ef4444',
      startDate: '',
      endDate: '',
      status: 'draft',
      productIds: [],
      applyToAll: false,
      stockLimit: '',
      priority: 0,
    });
    setModalOpen(true);
  };

  const openEdit = (promo) => {
    setEditingId(promo.id);
    setForm({
      title: promo.title || '',
      description: promo.description || '',
      image: promo.image || '',
      discountType: promo.discountType || 'percentage',
      discountValue: promo.discountValue || '',
      originalPrice: promo.originalPrice || '',
      badgeText: promo.badgeText || 'PROMO',
      badgeColor: promo.badgeColor || '#ef4444',
      startDate: promo.startDate ? promo.startDate.slice(0, 16) : '',
      endDate: promo.endDate ? promo.endDate.slice(0, 16) : '',
      status: promo.status || 'draft',
      productIds: promo.productIds || [],
      applyToAll: promo.applyToAll || false,
      stockLimit: promo.stockLimit || '',
      priority: promo.priority || 0,
    });
    setModalOpen(true);
  };

  const save = async () => {
    try {
      const id = editingId || uid();
      const discountValue = Number(form.discountValue) || 0;
      const originalPrice = Number(form.originalPrice) || 0;
      
      let finalPrice = originalPrice;
      if (form.discountType === 'percentage') {
        finalPrice = Math.max(0, originalPrice - Math.floor(originalPrice * (discountValue / 100)));
      } else {
        finalPrice = Math.max(0, originalPrice - discountValue * 100);
      }

      await upsertPromotion({
        id,
        title: form.title,
        description: form.description,
        image: form.image,
        discountType: form.discountType,
        discountValue,
        originalPrice,
        finalPrice,
        badgeText: form.badgeText,
        badgeColor: form.badgeColor,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
        status: form.status,
        productIds: form.applyToAll ? [] : form.productIds,
        applyToAll: form.applyToAll,
        stockLimit: form.stockLimit ? Number(form.stockLimit) : null,
        priority: Number(form.priority) || 0,
        createdAt: new Date().toISOString(),
      });
      setModalOpen(false);
    } catch (e) {
      alert('Erreur lors de la sauvegarde: ' + e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Supprimer cette promotion ?')) return;
    try {
      await deletePromotion(id);
    } catch (e) {
      alert('Erreur lors de la suppression: ' + e.message);
    }
  };

  const toggleProductSelection = (productId) => {
    setForm((f) => {
      const ids = f.productIds || [];
      if (ids.includes(productId)) {
        return { ...f, productIds: ids.filter((id) => id !== productId) };
      }
      return { ...f, productIds: [...ids, productId] };
    });
  };

  const calculatePreview = () => {
    const original = Number(form.originalPrice) || 0;
    const discount = Number(form.discountValue) || 0;
    if (form.discountType === 'percentage') {
      const savings = Math.floor(original * (discount / 100));
      return { final: original - savings, savings, percentage: discount };
    }
    return { final: Math.max(0, original - discount * 100), savings: discount * 100, percentage: 0 };
  };

  const preview = calculatePreview();

  return (
    <div className="admin-page-view">
      <div className="admin-section">
        <div className="admin-section-header">
          <div className="admin-section-title">Promotions</div>
          <div className="admin-section-actions">
            <div className="admin-search">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher..."
              />
            </div>
            <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
              <Plus size={16} />
              Nouvelle promotion
            </button>
          </div>
        </div>

        {loading ? (
          <div className="admin-empty">Chargement...</div>
        ) : promotions.length === 0 ? (
          <div className="admin-promo-empty">
            <div className="admin-promo-empty-icon">
              <TagIcon size={48} strokeWidth={1.5} />
            </div>
            <h3 className="admin-promo-empty-title">Aucune promotion en cours</h3>
            <p className="admin-promo-empty-text">
              Créez votre première promotion pour mettre en avant vos produits et booster vos ventes.
            </p>
            <div className="admin-promo-empty-features">
              <div className="admin-promo-empty-feature">
                <Sparkles size={16} />
                <span>Réductions par pourcentage ou montant fixe</span>
              </div>
              <div className="admin-promo-empty-feature">
                <Calendar size={16} />
                <span>Programmation automatique</span>
              </div>
              <div className="admin-promo-empty-feature">
                <Package size={16} />
                <span>Application par produit ou globale</span>
              </div>
            </div>
            <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
              <Plus size={16} />
              Créer une promotion
            </button>
          </div>
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Promotion</th>
                    <th>Type</th>
                    <th>Réduction</th>
                    <th>Statut</th>
                    <th>Dates</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="admin-promo-cell">
                          {p.image && <img className="admin-promo-img" src={p.image} alt="" />}
                          <div>
                            <div className="admin-promo-name">{p.title}</div>
                            <div className="admin-promo-desc">{p.description?.slice(0, 60)}...</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="admin-promo-badge"
                          style={{ background: p.badgeColor || '#ef4444' }}
                        >
                          {p.badgeText || 'PROMO'}
                        </span>
                      </td>
                      <td>
                        {p.discountType === 'percentage' ? (
                          <span>-{p.discountValue}%</span>
                        ) : (
                          <span>-{formatPriceEUR(p.discountValue * 100)}</span>
                        )}
                        <div className="admin-promo-price">
                          {formatPriceEUR(p.originalPrice)} → {formatPriceEUR(p.finalPrice)}
                        </div>
                      </td>
                      <td>
                        <span
                          className="admin-status-badge"
                          style={{ background: getStatusColor(p.status) }}
                        >
                          {getStatusLabel(p.status)}
                        </span>
                      </td>
                      <td>
                        <div className="admin-promo-dates">
                          {p.startDate && <div>Début: {new Date(p.startDate).toLocaleDateString()}</div>}
                          {p.endDate && <div>Fin: {new Date(p.endDate).toLocaleDateString()}</div>}
                        </div>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button type="button" className="admin-action-btn" onClick={() => openEdit(p)}>
                            <Pencil size={14} />
                          </button>
                          <button type="button" className="admin-action-btn" onClick={() => remove(p.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length > pageSize && (
              <div className="admin-pagination">
                <button className="admin-btn" onClick={() => setPage(1)} disabled={safePage === 1}>
                  «
                </button>
                <button className="admin-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>
                  ‹
                </button>
                <div className="admin-page-indicator">
                  Page {safePage} / {totalPages}
                </div>
                <button className="admin-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
                  ›
                </button>
                <button className="admin-btn" onClick={() => setPage(totalPages)} disabled={safePage === totalPages}>
                  »
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {modalOpen && (
        <div className="admin-drawer-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="admin-drawer">
            <div className="admin-drawer-header">
              <div className="admin-drawer-title">
                {editingId ? 'Modifier la promotion' : 'Nouvelle promotion'}
              </div>
              <button type="button" className="admin-drawer-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="admin-drawer-body">
              <div className="admin-form-grid">
                <div className="admin-form-group admin-form-full">
                  <label>Titre de la promotion *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="ex: Vente Flash, Black Friday, Soldes..."
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label>Description courte</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={2}
                    placeholder="Description visible sur le site..."
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label>Bannière / Image</label>
                  <div className="admin-image-field">
                    <input
                      value={form.image}
                      onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                      placeholder="URL de l'image"
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      onClick={() => fileRef.current?.click()}
                      disabled={imageBusy}
                    >
                      {imageBusy ? 'Upload...' : 'Upload'}
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setImageBusy(true);
                        try {
                          const url = await uploadImageToCloudinary(file);
                          setForm((f) => ({ ...f, image: url }));
                        } catch (err) {
                          alert('Erreur upload: ' + err.message);
                        } finally {
                          setImageBusy(false);
                        }
                      }}
                    />
                  </div>
                  {form.image && <img src={form.image} alt="" className="admin-image-preview" />}
                </div>

                <div className="admin-form-group">
                  <label>Type de réduction *</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value }))}
                  >
                    {PROMO_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Valeur de réduction *</label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                    placeholder={form.discountType === 'percentage' ? 'ex: 20' : 'ex: 15'}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Prix avant promotion (centimes)</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
                    placeholder="ex: 4990"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Prix après promotion</label>
                  <div className="admin-form-static">
                    {form.originalPrice && form.discountValue
                      ? formatPriceEUR(preview.final)
                      : '-'}
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Texte du badge</label>
                  <input
                    value={form.badgeText}
                    onChange={(e) => setForm((f) => ({ ...f, badgeText: e.target.value }))}
                    placeholder="PROMO"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Couleur du badge</label>
                  <div className="admin-color-picker">
                    {BADGE_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        className={`admin-color-swatch ${form.badgeColor === c.value ? 'active' : ''}`}
                        style={{ background: c.value }}
                        onClick={() => setForm((f) => ({ ...f, badgeColor: c.value }))}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Date de début</label>
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Date de fin</label>
                  <input
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Statut</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  >
                    {PROMO_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Limite de stock promo</label>
                  <input
                    type="number"
                    value={form.stockLimit}
                    onChange={(e) => setForm((f) => ({ ...f, stockLimit: e.target.value }))}
                    placeholder="Illimité"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Priorité d'affichage</label>
                  <input
                    type="number"
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                    placeholder="0"
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.applyToAll}
                      onChange={(e) => setForm((f) => ({ ...f, applyToAll: e.target.checked }))}
                    />
                    Appliquer à tous les produits
                  </label>
                </div>

                {!form.applyToAll && (
                  <div className="admin-form-group admin-form-full">
                    <label>Produits concernés</label>
                    <div className="admin-product-selector">
                      {products?.map((product) => (
                        <label key={product.id} className="admin-product-checkbox">
                          <input
                            type="checkbox"
                            checked={form.productIds?.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                          />
                          <img src={product.image || product.images?.[0]} alt="" />
                          <span>{product.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="admin-form-group admin-form-full">
                  <div className="admin-promo-preview">
                    <h4>Aperçu</h4>
                    <div className="admin-promo-preview-card">
                      <span className="admin-promo-preview-badge" style={{ background: form.badgeColor }}>
                        {form.badgeText || 'PROMO'}
                      </span>
                      <div className="admin-promo-preview-price">
                        {form.originalPrice && (
                          <>
                            <span className="original">{formatPriceEUR(Number(form.originalPrice))}</span>
                            <span className="final">
                              {formatPriceEUR(preview.final)}
                            </span>
                          </>
                        )}
                      </div>
                      {form.discountType === 'percentage' && form.discountValue && (
                        <div className="admin-promo-preview-savings">
                          Économisez {form.discountValue}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-drawer-footer">
              <button type="button" className="admin-btn" onClick={() => setModalOpen(false)}>
                Annuler
              </button>
              <button type="button" className="admin-btn admin-btn-primary" onClick={save}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
