import fs from 'fs';
import path from 'path';

const BRAND = {
  name: 'Mey Beauty',
  subtitle: 'Institut & Cosmétiques',
  primary: '#6C534E',
  primaryDark: '#523A36',
  cream: '#F7F2ED',
  creamDark: '#EAE0D8',
  text: '#2B211D',
  muted: '#8A7770',
  border: '#E8DDD5',
  success: '#2F6B4F',
};

export const EMAIL_LOGO_CID = 'mey-beauty-logo';

const esc = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const money = (cents) => `${((Number(cents) || 0) / 100).toFixed(2)} €`;

const shortOrderRef = (order) => {
  const raw = String(order?.orderNumber || order?.id || 'encours')
    .replace(/[^a-z0-9]/gi, '')
    .toUpperCase();
  return `MEY-${raw.slice(-6) || 'ENCRS'}`;
};

const fullName = (customer) => `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || 'Cliente Mey Beauty';

const paymentLabel = (method) => method === 'stripe'
  ? 'Carte bancaire'
  : method === 'paypal'
    ? 'PayPal'
    : method || 'Paiement en ligne';

const orderDate = (order) => {
  const value = order?.createdAt?.toDate ? order.createdAt.toDate() : order?.createdAt;
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';
};

const deliveryMode = (order) => {
  if (order?.shipping?.pickupLocation) return 'Retrait en institut';
  if (order?.shipping?.servicePoint) return 'Point relais / consigne';
  return 'Livraison à domicile';
};

const addressLine = (customer) => [
  fullName(customer),
  customer?.address,
  customer?.addressComplement,
  `${customer?.postalCode || ''} ${customer?.city || ''}`.trim(),
].filter(Boolean).map(esc).join('<br>');

const itemRows = (items = []) => {
  if (!items.length) {
    return `<tr><td colspan="2" style="padding:14px;color:${BRAND.muted};font-size:14px;text-align:center;">Aucun produit dans cette commande.</td></tr>`;
  }

  return items.map((item) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid ${BRAND.border};font-size:14px;color:${BRAND.text};">
        <strong>${esc(item.name || 'Produit')}</strong>
        <div style="font-size:12px;color:${BRAND.muted};margin-top:3px;">Quantité : ${esc(item.quantity || 1)}</div>
      </td>
      <td style="padding:14px 0;border-bottom:1px solid ${BRAND.border};font-size:14px;color:${BRAND.text};text-align:right;white-space:nowrap;">
        ${money(item.totalCents ?? (item.priceCents || 0) * (item.quantity || 1))}
      </td>
    </tr>
  `).join('');
};

const totalsRows = (order) => `
  <tr>
    <td style="padding:10px 0;color:${BRAND.muted};font-size:14px;">Sous-total</td>
    <td style="padding:10px 0;text-align:right;font-size:14px;">${money(order?.subtotalCents)}</td>
  </tr>
  <tr>
    <td style="padding:10px 0;color:${BRAND.muted};font-size:14px;">${esc(order?.shipping?.name || 'Livraison')}</td>
    <td style="padding:10px 0;text-align:right;font-size:14px;">${order?.shippingCents > 0 ? money(order.shippingCents) : 'Offerte'}</td>
  </tr>
  <tr>
    <td style="padding:14px 0 0;border-top:2px solid ${BRAND.primary};font-size:16px;font-weight:700;color:${BRAND.primary};">Total</td>
    <td style="padding:14px 0 0;border-top:2px solid ${BRAND.primary};text-align:right;font-size:18px;font-weight:700;color:${BRAND.primary};">${money(order?.totalAmountCents)}</td>
  </tr>
`;

const button = (url, label, secondary = false) => `
  <a href="${esc(url)}" target="_blank" style="display:inline-block;background:${secondary ? '#FFFFFF' : BRAND.primary};color:${secondary ? BRAND.primary : '#FFFFFF'};border:1px solid ${BRAND.primary};border-radius:999px;padding:13px 26px;font-size:14px;font-weight:700;text-decoration:none;">
    ${esc(label)}
  </a>
`;

const badge = (label, color = BRAND.primary) => `
  <span style="display:inline-block;background:${color};color:#fff;border-radius:999px;padding:6px 12px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">${esc(label)}</span>
`;

const card = (inner, extra = '') => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BRAND.border};border-radius:14px;margin:18px 0;">
    <tr><td style="padding:18px 20px;${extra}">${inner}</td></tr>
  </table>
`;

const deliveryCard = (order) => {
  const shipping = order?.shipping || {};
  const customer = order?.customer || {};
  let content = `<strong style="color:${BRAND.primary};font-size:15px;">${esc(deliveryMode(order))}</strong>`;

  if (shipping.pickupLocation) {
    content += `<div style="margin-top:8px;font-size:14px;color:${BRAND.text};"><strong>${esc(shipping.pickupLocation)}</strong></div>`;
  } else if (shipping.servicePoint) {
    content += `
      <div style="margin-top:8px;font-size:14px;color:${BRAND.text};">
        <strong>${esc(shipping.servicePoint.name || 'Point relais')}</strong><br>
        ${esc(shipping.servicePoint.address || '')}${shipping.servicePoint.address ? '<br>' : ''}
        ${esc(`${shipping.servicePoint.postalCode || ''} ${shipping.servicePoint.city || ''}`.trim())}
      </div>`;
  } else {
    content += `<div style="margin-top:8px;font-size:14px;color:${BRAND.text};">${addressLine(customer)}</div>`;
  }

  if (shipping.name || shipping.carrier) {
    content += `<div style="margin-top:10px;padding-top:10px;border-top:1px dashed ${BRAND.border};font-size:13px;color:${BRAND.muted};">Transport : ${esc(shipping.name || shipping.carrier)}${shipping.carrier && shipping.name ? ` · ${esc(shipping.carrier)}` : ''}</div>`;
  }

  if (customer.deliveryNotes) {
    content += `<div style="margin-top:10px;font-size:13px;color:${BRAND.muted};"><strong>Note client :</strong> ${esc(customer.deliveryNotes)}</div>`;
  }

  return card(content);
};

const footer = (siteUrl) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;border-top:1px solid ${BRAND.border};">
    <tr>
      <td align="center" style="padding-top:18px;color:${BRAND.muted};font-size:12px;line-height:1.7;">
        <strong style="color:${BRAND.primary};">Mey Beauty</strong><br>
        6 Place des Martyrs de Châteaubriand, 91170 Viry-Châtillon<br>
        <a href="mailto:contact@meybeauty.fr" style="color:${BRAND.primary};text-decoration:none;">contact@meybeauty.fr</a> · 07 49 22 68 01<br>
        <a href="${esc(siteUrl)}" style="color:${BRAND.muted};text-decoration:none;">meybeauty.fr</a>
      </td>
    </tr>
  </table>
`;

const shell = ({ title, preheader, badgeLabel, intro, content, logoSrc, siteUrl }) => `
<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background:${BRAND.cream};color:${BRAND.text};font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#fff;border-radius:18px;overflow:hidden;border:1px solid ${BRAND.border};">
            <tr>
              <td align="center" style="background:#fff;padding:30px 24px 18px;">
                <a href="${esc(siteUrl)}" target="_blank" style="text-decoration:none;">
                  <img src="${esc(logoSrc)}" alt="Mey Beauty" width="170" style="display:block;width:170px;max-width:70%;height:auto;border:0;">
                </a>
                <div style="margin-top:8px;color:${BRAND.muted};font-size:11px;letter-spacing:2px;text-transform:uppercase;">${BRAND.subtitle}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 34px 30px;">
                <div style="text-align:center;margin-bottom:16px;">${badge(badgeLabel)}</div>
                <h1 style="margin:0 0 12px;text-align:center;color:${BRAND.primaryDark};font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;font-weight:500;">${esc(title)}</h1>
                <p style="margin:0 auto 20px;max-width:500px;text-align:center;color:${BRAND.muted};font-size:15px;line-height:1.7;">${intro}</p>
                ${content}
                ${footer(siteUrl)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const confirmationContent = ({ order, recipientName, siteUrl }) => `
  ${card(`
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <div style="font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:1px;">Référence</div>
          <div style="font-size:18px;font-weight:700;color:${BRAND.primary};margin-top:4px;">${shortOrderRef(order)}</div>
        </td>
        <td align="right">
          <div style="font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:1px;">Date</div>
          <div style="font-size:14px;color:${BRAND.text};margin-top:4px;">${esc(orderDate(order) || 'Aujourd’hui')}</div>
        </td>
      </tr>
    </table>
  `)}
  <h2 style="font-size:17px;color:${BRAND.primaryDark};margin:24px 0 8px;">Votre sélection</h2>
  ${card(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemRows(order?.items)}${totalsRows(order)}</table>`)}
  <h2 style="font-size:17px;color:${BRAND.primaryDark};margin:24px 0 8px;">Livraison</h2>
  ${deliveryCard(order)}
  <div style="background:${BRAND.cream};border-radius:12px;padding:14px 16px;color:${BRAND.muted};font-size:13px;line-height:1.6;margin:18px 0;">
    Votre commande est maintenant préparée par notre équipe. Le lien de suivi vous sera envoyé automatiquement dès que l’étiquette transporteur sera générée.
  </div>
  <div style="text-align:center;margin-top:24px;">${button(`${siteUrl}/#shop`, 'Découvrir la boutique')}</div>
`;

const adminContent = ({ order, adminUrl }) => `
  ${card(`
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <div style="font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:1px;">Commande</div>
          <div style="font-size:20px;font-weight:700;color:${BRAND.primary};margin-top:4px;">${shortOrderRef(order)}</div>
        </td>
        <td align="right">
          <div style="font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:1px;">Montant</div>
          <div style="font-size:20px;font-weight:700;color:${BRAND.success};margin-top:4px;">${money(order?.totalAmountCents)}</div>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding-top:12px;color:${BRAND.muted};font-size:13px;">
          ${esc(paymentLabel(order?.paymentMethod))} · ${esc(orderDate(order) || 'Aujourd’hui')} · ${esc(deliveryMode(order))}
        </td>
      </tr>
    </table>
  `)}
  <h2 style="font-size:17px;color:${BRAND.primaryDark};margin:24px 0 8px;">Cliente</h2>
  ${card(`
    <div style="font-size:15px;color:${BRAND.text};font-weight:700;">${esc(fullName(order?.customer))}</div>
    <div style="margin-top:8px;font-size:14px;color:${BRAND.muted};">
      <a href="mailto:${esc(order?.customer?.email || '')}" style="color:${BRAND.primary};">${esc(order?.customer?.email || 'Email non renseigné')}</a><br>
      <a href="tel:${esc(order?.customer?.phone || '')}" style="color:${BRAND.primary};">${esc(order?.customer?.phone || 'Téléphone non renseigné')}</a>
    </div>
    ${order?.customer?.address ? `<div style="margin-top:12px;padding-top:12px;border-top:1px dashed ${BRAND.border};font-size:14px;color:${BRAND.text};">${addressLine(order.customer)}</div>` : ''}
  `)}
  <h2 style="font-size:17px;color:${BRAND.primaryDark};margin:24px 0 8px;">Livraison</h2>
  ${deliveryCard(order)}
  <h2 style="font-size:17px;color:${BRAND.primaryDark};margin:24px 0 8px;">Produits à préparer</h2>
  ${card(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemRows(order?.items)}${totalsRows(order)}</table>`)}
  <div style="text-align:center;margin-top:24px;">${button(adminUrl, 'Ouvrir l’administration')}</div>
`;

const trackingContent = ({ order, trackingNumber, trackingUrl, carrier }) => `
  ${card(`
    <div style="text-align:center;">
      <div style="font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:1px;">Référence</div>
      <div style="font-size:20px;font-weight:700;color:${BRAND.primary};margin-top:4px;">${shortOrderRef(order)}</div>
      <div style="margin-top:16px;font-size:14px;color:${BRAND.muted};">Transporteur</div>
      <div style="font-size:16px;font-weight:700;color:${BRAND.text};margin-top:3px;">${esc(carrier || order?.shipping?.carrier || 'Transporteur')}</div>
      ${trackingNumber ? `
        <div style="margin:18px auto 0;display:inline-block;border:1px dashed ${BRAND.primary};border-radius:10px;padding:12px 20px;background:${BRAND.cream};">
          <div style="font-size:11px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:1px;">Numéro de suivi</div>
          <div style="font-size:17px;font-weight:700;color:${BRAND.primary};letter-spacing:.7px;margin-top:3px;">${esc(trackingNumber)}</div>
        </div>` : ''}
    </div>
  `)}
  ${deliveryCard(order)}
  ${trackingUrl ? `
    <div style="text-align:center;margin:26px 0;">${button(trackingUrl, 'Suivre ma livraison')}</div>
    <p style="text-align:center;color:${BRAND.muted};font-size:13px;line-height:1.6;margin:0;">Vous pouvez suivre l’acheminement de votre colis en temps réel via le lien ci-dessus.</p>
  ` : `
    <div style="background:${BRAND.cream};border-radius:12px;padding:14px 16px;color:${BRAND.muted};font-size:13px;line-height:1.6;text-align:center;">
      Le lien de suivi transporteur sera disponible très prochainement. Conservez votre numéro de suivi indiqué ci-dessus.
    </div>
  `}
`;

export function getEmailLogo(env = process.env) {
  if (env.EMAIL_LOGO_URL) {
    return { src: env.EMAIL_LOGO_URL, attachments: [] };
  }

  const localLogo = path.resolve(process.cwd(), 'public/mey-beauty.png');
  if (fs.existsSync(localLogo)) {
    return {
      src: `cid:${EMAIL_LOGO_CID}`,
      attachments: [{
        filename: 'mey-beauty.png',
        path: localLogo,
        cid: EMAIL_LOGO_CID,
        contentDisposition: 'inline',
      }],
    };
  }

  const siteUrl = (env.PUBLIC_SITE_URL || env.SITE_URL || 'https://meybeauty.fr').replace(/\/$/, '');
  return { src: `${siteUrl}/mey-beauty.png`, attachments: [] };
}

export function buildOrderEmail({ type, order = {}, recipientName = '', trackingNumber = '', trackingUrl = '', carrier = '', env = process.env, logoSrc }) {
  const siteUrl = (env.PUBLIC_SITE_URL || env.SITE_URL || 'https://meybeauty.fr').replace(/\/$/, '');
  const adminUrl = env.ADMIN_URL || `${siteUrl}/#admin`;
  const customerName = recipientName || fullName(order.customer);
  const ref = shortOrderRef(order);

  const variants = {
    order_confirmation: {
      subject: `Commande ${ref} confirmée — Mey Beauty`,
      title: `Merci ${customerName.split(' ')[0] || ''}`.trim() || 'Merci pour votre commande',
      badgeLabel: 'Commande confirmée',
      preheader: `Votre commande ${ref} est confirmée et en préparation.`,
      intro: 'Votre paiement a bien été accepté. Nous préparons votre commande avec le plus grand soin.',
      content: confirmationContent({ order, recipientName: customerName, siteUrl }),
      text: `Merci ${customerName}. Votre commande ${ref} est confirmée. Total : ${money(order.totalAmountCents)}.`,
    },
    shipping_tracking: {
      subject: `Votre commande ${ref} est en route`,
      title: 'Votre colis est en route',
      badgeLabel: 'Expédition en cours',
      preheader: `Suivez votre commande ${ref} chez ${carrier || order?.shipping?.carrier || 'le transporteur'}.`,
      intro: 'Votre commande a quitté notre institut. Retrouvez ci-dessous vos informations de suivi.',
      content: trackingContent({ order, trackingNumber, trackingUrl, carrier }),
      text: `Votre commande ${ref} est expédiée. Suivi : ${trackingNumber || 'bientôt disponible'} ${trackingUrl || ''}`.trim(),
    },
    admin_order_notification: {
      subject: `Nouvelle commande ${ref} — ${money(order.totalAmountCents)}`,
      title: 'Nouvelle commande à préparer',
      badgeLabel: 'Notification admin',
      preheader: `${fullName(order.customer)} vient de passer une commande de ${money(order.totalAmountCents)}.`,
      intro: 'Une nouvelle commande payée vient d’arriver. Voici les informations utiles pour la préparer.',
      content: adminContent({ order, adminUrl }),
      text: `Nouvelle commande ${ref}. Cliente : ${fullName(order.customer)}. Total : ${money(order.totalAmountCents)}. Admin : ${adminUrl}`,
    },
  };

  const variant = variants[type] || variants.order_confirmation;
  return {
    subject: variant.subject,
    html: shell({
      title: variant.title,
      preheader: variant.preheader,
      badgeLabel: variant.badgeLabel,
      intro: variant.intro,
      content: variant.content,
      logoSrc,
      siteUrl,
    }),
    text: variant.text,
  };
}
