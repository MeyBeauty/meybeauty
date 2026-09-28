import { useEffect, useMemo, useRef, useState } from 'react';
import { listenOrders, updateOrderStatus, updateOrderShipping, deleteOrder } from '../firebase/collections.js';
import { formatPriceEUR } from '../data/products.js';
import { useToast } from '../context/ToastContext.jsx';
import { Package, Search, X, Eye, Trash2, Calendar, CreditCard, User, ShoppingBag, Download, CheckCircle, Clock, Truck, FileText, ExternalLink } from 'lucide-react';

export default function AdminOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const unsubscribeRef = useRef(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    orderId: null,
    orderEmail: '',
    message: ''
  });
  const [labelLoading, setLabelLoading] = useState(false);

  const handleGenerateLabel = async (order, testMode = false) => {
    if (!order.shipping?.shippingOptionCode) {
      showToast('Aucune option de livraison sur cette commande', 'error');
      return;
    }
    
    // Validate required fields
    const postalCode = (order.customer?.postalCode || '').replace(/\s+/g, '');
    if (!postalCode || postalCode.length < 4) {
      showToast('Code postal client manquant ou invalide', 'error');
      return;
    }
    if (!order.customer?.address || !order.customer?.city) {
      showToast('Adresse client incomplète', 'error');
      return;
    }
    
    setLabelLoading(true);
    try {
      const resp = await fetch('/api/sendcloud-create-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingOptionCode: order.shipping.shippingOptionCode,
          testMode,
          recipient: {
            firstName: order.customer?.firstName || '',
            lastName: order.customer?.lastName || '',
            address: order.customer?.address || '',
            postalCode: postalCode,
            city: order.customer?.city || '',
            countryCode: 'FR',
            phone: order.customer?.phone || '',
            email: order.customer?.email || '',
          },
          parcel: {
            weightKg: Math.max(0.5, ((order.items || []).reduce((s, i) => s + (i.quantity || 1), 0) * 0.5).toFixed(1)),
            lengthCm: 20,
            widthCm: 15,
            heightCm: 10,
          },
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        console.error('[Admin] Sendcloud shipment error:', data);
        const errorDetail = data.details?.[0]?.detail || data.error || 'Erreur génération étiquette';
        throw new Error(errorDetail);
      }

      // Filter out undefined values (Firebase doesn't accept them)
      const shippingUpdate = {
        ...order.shipping,
        status: 'label_created',
        testMode: data.testMode || false,
      };
      if (data.shipmentId) shippingUpdate.sendcloudShipmentId = data.shipmentId;
      if (data.labelUrl) shippingUpdate.labelUrl = data.labelUrl;
      if (data.trackingNumber) shippingUpdate.trackingNumber = data.trackingNumber;
      if (data.trackingUrl) shippingUpdate.trackingUrl = data.trackingUrl;

      await updateOrderShipping(order.id, shippingUpdate);

      showToast(testMode ? 'Étiquette de test générée' : 'Étiquette générée avec succès', 'success');
      setSelectedOrder((prev) => prev ? { ...prev, shipping: { ...prev.shipping, sendcloudShipmentId: data.shipmentId, labelUrl: data.labelUrl, trackingNumber: data.trackingNumber, trackingUrl: data.trackingUrl, status: 'label_created', testMode: data.testMode } } : prev);
    } catch (err) {
      console.error('[Label] error:', err);
      showToast('Erreur: ' + err.message, 'error');
    } finally {
      setLabelLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      unsubscribeRef.current = listenOrders(
        (data) => {
          setOrders(data || []);
          setLoading(false);
        },
        (err) => {
          console.error('[Orders] Listen error:', err);
          // Show empty state instead of error for missing collection
          setOrders([]);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('[Orders] Setup error:', err);
      setOrders([]);
      setLoading(false);
    }
    return () => {
      if (unsubscribeRef.current) {
        try {
          unsubscribeRef.current();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        order.id?.toLowerCase().includes(search) ||
        order.customer?.email?.toLowerCase().includes(search) ||
        order.customer?.lastName?.toLowerCase().includes(search) ||
        order.customer?.firstName?.toLowerCase().includes(search);

      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      const matchesPayment = filterPayment === 'all' || order.paymentMethod === filterPayment;

      let matchesDate = true;
      if (dateFrom || dateTo) {
        const orderDate = order.createdAt?.toDate?.() || new Date(order.createdAt);
        if (dateFrom && orderDate < new Date(dateFrom)) matchesDate = false;
        if (dateTo && orderDate > new Date(dateTo + 'T23:59:59')) matchesDate = false;
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  }, [orders, searchTerm, filterStatus, filterPayment, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (o.totalAmountCents || 0), 0);
  }, [filteredOrders]);

  const exportToExcel = () => {
    const rows = filteredOrders.map((order) => ({
      'ID Commande': order.id,
      'Date': order.createdAt?.toDate?.().toLocaleString('fr-FR') || new Date(order.createdAt).toLocaleString('fr-FR'),
      'Nom': `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim(),
      'Email': order.customer?.email || '',
      'Téléphone': order.customer?.phone || '',
      'Adresse': order.customer?.address || '',
      'Ville': order.customer?.city || '',
      'Code postal': order.customer?.postalCode || '',
      'Produits': order.items?.map(i => `${i.name} (x${i.quantity})`).join(', ') || '',
      'Montant total': formatPriceEUR(order.totalAmountCents || 0),
      'Méthode de paiement': order.paymentMethod === 'stripe' ? 'Carte (Stripe)' : order.paymentMethod === 'paypal' ? 'PayPal' : order.paymentMethod,
      'Statut': order.status === 'paid' ? 'Payée' : order.status === 'pending' ? 'En attente' : order.status === 'cancelled' ? 'Annulée' : order.status,
    }));

    const csvContent = [
      Object.keys(rows[0] || {}).join(';'),
      ...rows.map((r) => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(';'))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `commandes-mey-beauty-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`${filteredOrders.length} commandes exportées avec succès`, 'success');
  };

  const handleDelete = async (id, email = '') => {
    setConfirmDialog({
      isOpen: true,
      orderId: id,
      orderEmail: email,
      message: email
        ? `Confirmer la suppression de la commande du client ${email} ?`
        : 'Confirmer la suppression de cette commande ?'
    });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.orderId) return;
    try {
      await deleteOrder(confirmDialog.orderId);
      showToast('Commande supprimée avec succès', 'success');
      if (selectedOrder?.id === confirmDialog.orderId) setSelectedOrder(null);
    } catch (err) {
      showToast('Erreur lors de la suppression : ' + err.message, 'error');
    } finally {
      setConfirmDialog({ isOpen: false, orderId: null, orderEmail: '', message: '' });
    }
  };

  const cancelDelete = () => {
    setConfirmDialog({ isOpen: false, orderId: null, orderEmail: '', message: '' });
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      showToast('Statut mis à jour avec succès', 'success');
    } catch (err) {
      showToast('Erreur lors de la mise à jour : ' + err.message, 'error');
    }
  };

  if (loading) return <div className="admin-orders-loading">Chargement des commandes...</div>;

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <h2><Package size={22} /> Commandes</h2>
        <div className="admin-orders-stats">
          <div className="stat-box">
            <span className="stat-value">{filteredOrders.length}</span>
            <span className="stat-label">Commandes</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{formatPriceEUR(totalRevenue)}</span>
            <span className="stat-label">Chiffre d'affaires</span>
          </div>
        </div>
      </div>

      <div className="admin-orders-filters">
        <div className="filter-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Rechercher (ID, email, nom...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="paid">Payée</option>
          <option value="pending">En attente</option>
          <option value="cancelled">Annulée</option>
        </select>
        <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
          <option value="all">Tous les paiements</option>
          <option value="stripe">Carte (Stripe)</option>
          <option value="paypal">PayPal</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          placeholder="Date début"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          placeholder="Date fin"
        />
        <button className="export-btn" onClick={exportToExcel}>
          <Download size={16} /> Exporter CSV
        </button>
      </div>

      <div className="admin-orders-table-wrap">
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Client</th>
              <th>Produits</th>
              <th>Total</th>
              <th>Paiement</th>
              <th>Statut</th>
              <th>Livraison</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id} onClick={() => setSelectedOrder(order)} className="order-row">
                <td className="order-id">{order.id}</td>
                <td>
                  {order.createdAt?.toDate?.().toLocaleDateString('fr-FR') ||
                    new Date(order.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td>
                  <div className="customer-info">
                    <User size={14} />
                    <span>{order.customer?.firstName} {order.customer?.lastName}</span>
                    <small>{order.customer?.email}</small>
                  </div>
                </td>
                <td>
                  <span className="products-count">
                    <ShoppingBag size={14} />
                    {order.items?.length || 0} article(s)
                  </span>
                </td>
                <td className="order-total">{formatPriceEUR(order.totalAmountCents || 0)}</td>
                <td>
                  <span className={`payment-method ${order.paymentMethod}`}>
                    <CreditCard size={14} />
                    {order.paymentMethod === 'stripe' ? 'Carte' : order.paymentMethod === 'paypal' ? 'PayPal' : order.paymentMethod}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${order.status}`}>
                    {order.status === 'paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                    {order.status === 'paid' ? 'Payée' : order.status === 'pending' ? 'En attente' : order.status === 'cancelled' ? 'Annulée' : order.status}
                  </span>
                </td>
                <td>
                  {order.shipping?.labelUrl ? (
                    <span className="shipping-badge label-ready">
                      <Truck size={14} />
                      Étiquette prête
                    </span>
                  ) : order.shipping?.shippingOptionCode ? (
                    <span className="shipping-badge pending">
                      <Package size={14} />
                      Générer
                    </span>
                  ) : (
                    <span className="shipping-badge none">—</span>
                  )}
                </td>
                <td>
                  <div className="row-actions">
                    <button className="action-btn view" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}>
                      <Eye size={16} />
                    </button>
                    <button className="action-btn delete" onClick={(e) => { e.stopPropagation(); handleDelete(order.id, order.customer?.email); }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="admin-orders-pagination">
          <button
            className="page-btn"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            ←
          </button>
          <span className="page-info">Page {currentPage} / {totalPages}</span>
          <button
            className="page-btn"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            →
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="confirm-dialog-overlay" onClick={cancelDelete}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h4>Confirmation</h4>
            <p>{confirmDialog.message}</p>
            <div className="confirm-dialog-actions">
              <button className="btn-cancel" onClick={cancelDelete}>Annuler</button>
              <button className="btn-confirm" onClick={confirmDelete}>Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="order-detail-modal" onClick={() => setSelectedOrder(null)}>
          <div className="order-detail-content" onClick={(e) => e.stopPropagation()}>
            <div className="order-detail-header">
              <h3>Détail commande {selectedOrder.id}</h3>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="order-detail-body">
              <div className="detail-section">
                <h4><Calendar size={16} /> Informations</h4>
                <p><strong>Date:</strong> {selectedOrder.createdAt?.toDate?.().toLocaleString('fr-FR') || new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}</p>
                <p><strong>Statut:</strong> <span className={`status-badge ${selectedOrder.status}`}>{selectedOrder.status}</span></p>
                <p><strong>Paiement:</strong> {selectedOrder.paymentMethod === 'stripe' ? 'Carte bancaire (Stripe)' : selectedOrder.paymentMethod === 'paypal' ? 'PayPal' : selectedOrder.paymentMethod}</p>
              </div>
              <div className="detail-section">
                <h4><User size={16} /> Client</h4>
                <p><strong>Nom:</strong> {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                <p><strong>Téléphone:</strong> {selectedOrder.customer?.phone || '-'}</p>
                <p><strong>Adresse:</strong> {[selectedOrder.customer?.address, selectedOrder.customer?.postalCode, selectedOrder.customer?.city].filter(Boolean).join(', ') || '-'}</p>
              </div>
              <div className="detail-section">
                <h4><ShoppingBag size={16} /> Articles</h4>
                {(!selectedOrder.items || selectedOrder.items.length === 0) ? (
                  <p style={{ color: 'rgba(26,20,16,0.5)', fontStyle: 'italic', margin: '8px 0' }}>
                    Cette commande ne contient aucun article.
                  </p>
                ) : (
                  <ul className="order-items-list">
                    {selectedOrder.items.map((item, idx) => (
                      <li key={idx}>
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">x{item.quantity}</span>
                        <span className="item-price">{formatPriceEUR(item.totalCents || item.priceCents * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {selectedOrder.shippingCents > 0 && (
                  <div className="order-shipping-line">
                    <strong>Livraison ({selectedOrder.shipping?.name || 'Transporteur'}):</strong>
                    <span>{formatPriceEUR(selectedOrder.shippingCents)}</span>
                  </div>
                )}
                <div className="order-total-line">
                  <strong>Total:</strong> <span>{formatPriceEUR(selectedOrder.totalAmountCents || 0)}</span>
                </div>
              </div>

              {selectedOrder.shipping && (
                <div className="detail-section">
                  <h4><Truck size={16} /> Livraison & Expédition</h4>
                  <p><strong>Mode:</strong> {selectedOrder.shipping.name || selectedOrder.shipping.shippingOptionCode || '-'}</p>
                  {selectedOrder.shipping.carrier && <p><strong>Transporteur:</strong> {selectedOrder.shipping.carrier}</p>}
                  <p><strong>Statut expédition:</strong>
                    <span className={`shipping-status-badge ${selectedOrder.shipping.status || 'pending'}`}>
                      {selectedOrder.shipping.status === 'label_created' ? 'Étiquette créée' :
                       selectedOrder.shipping.status === 'shipped' ? 'Expédiée' :
                       selectedOrder.shipping.status === 'delivered' ? 'Livrée' : 'En attente'}
                    </span>
                  </p>
                  {selectedOrder.shipping.trackingNumber && (
                    <p><strong>Numéro de suivi:</strong> {selectedOrder.shipping.trackingNumber}</p>
                  )}
                  {selectedOrder.shipping.trackingUrl && (
                    <p>
                      <a href={selectedOrder.shipping.trackingUrl} target="_blank" rel="noreferrer" className="admin-tracking-link">
                        Suivre le colis <ExternalLink size={12} />
                      </a>
                    </p>
                  )}
                  {selectedOrder.shipping.labelUrl && (
                    <div className="admin-label-section">
                      <div className="admin-label-actions-row">
                        <a href={selectedOrder.shipping.labelUrl} target="_blank" rel="noreferrer" className="admin-label-btn">
                          <Download size={14} /> Télécharger le PDF
                        </a>
                        <a href={selectedOrder.shipping.labelUrl} target="_blank" rel="noreferrer" className="admin-label-btn secondary">
                          <ExternalLink size={14} /> Ouvrir dans un nouvel onglet
                        </a>
                      </div>
                      <div className="admin-pdf-viewer">
                        <iframe
                          src={selectedOrder.shipping.labelUrl}
                          title="Étiquette de livraison"
                          className="pdf-iframe"
                        />
                      </div>
                    </div>
                  )}
                  {selectedOrder.shipping.testMode && (
                    <p className="admin-test-mode-note">Mode test — étiquette non facturée</p>
                  )}
                  {!selectedOrder.shipping.labelUrl && (
                    <div className="admin-label-actions">
                      <button
                        className="admin-generate-label-btn"
                        onClick={() => handleGenerateLabel(selectedOrder, false)}
                        disabled={labelLoading}
                      >
                        <Package size={14} /> {labelLoading ? 'Génération…' : 'Générer l\'étiquette'}
                      </button>
                      <button
                        className="admin-generate-label-btn test"
                        onClick={() => handleGenerateLabel(selectedOrder, true)}
                        disabled={labelLoading}
                        title="Génère une étiquette de test (non facturée)"
                      >
                        <Package size={14} /> {labelLoading ? '…' : 'Tester'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="detail-actions">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                >
                  <option value="paid">Payée</option>
                  <option value="pending">En attente</option>
                  <option value="shipped">Expédiée</option>
                  <option value="cancelled">Annulée</option>
                </select>
                <button className="delete-order-btn" onClick={() => handleDelete(selectedOrder.id, selectedOrder.customer?.email)}>
                  <Trash2 size={16} /> Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
