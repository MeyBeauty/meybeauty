import nodemailer from 'nodemailer';
import { buildOrderEmail, getEmailLogo } from './order-email-template.js';
import { getStoredOrder, hasOrderStore } from './order-store.js';

const ALLOWED_TYPES = ['order_confirmation', 'shipping_tracking', 'admin_order_notification'];

const normalizeRecipients = (recipientEmail) => Array.isArray(recipientEmail)
  ? recipientEmail.map((email) => String(email).trim()).filter(Boolean)
  : String(recipientEmail || '').split(',').map((email) => email.trim()).filter(Boolean);

export async function sendOrderEmail({
  type,
  order,
  recipientEmail,
  recipientName,
  trackingNumber,
  trackingUrl,
  carrier,
  env = process.env,
}) {
  if (!ALLOWED_TYPES.includes(type) || !order) {
    return { ok: false, status: 400, body: { error: 'Type ou commande invalide' } };
  }

  if (type === 'shipping_tracking' && !trackingNumber && !trackingUrl) {
    return { ok: false, status: 400, body: { error: 'trackingNumber ou trackingUrl requis' } };
  }

  const isHostedEnvironment = Boolean(env.VERCEL || env.NETLIFY || env.NODE_ENV === 'production');
  if (isHostedEnvironment && !hasOrderStore(env)) {
    return { ok: false, status: 503, body: { error: 'FIREBASE_SERVICE_ACCOUNT_KEY requis pour vérifier la commande' } };
  }

  let orderData = order;
  if (hasOrderStore(env)) {
    if (!order.id) {
      return { ok: false, status: 400, body: { error: 'order.id requis' } };
    }
    const storedOrder = await getStoredOrder(order.id, env);
    if (!storedOrder) {
      return { ok: false, status: 404, body: { error: 'Commande introuvable' } };
    }
    orderData = { ...storedOrder, shipping: order.shipping || storedOrder.shipping };
  }

  const requestedRecipients = normalizeRecipients(recipientEmail);
  const adminRecipients = normalizeRecipients(env.ADMIN_ORDER_EMAILS || env.ADMIN_EMAIL || 'contact@meybeauty.fr,junelamelon92@gmail.com');
  const customerRecipients = normalizeRecipients(orderData.customer?.email || requestedRecipients[0]);
  const recipients = type === 'admin_order_notification' ? adminRecipients : customerRecipients;

  if (!recipients.length) {
    return { ok: false, status: 400, body: { error: 'Destinataire requis' } };
  }

  const logo = getEmailLogo(env);
  const email = buildOrderEmail({
    type,
    order: orderData,
    recipientName,
    trackingNumber,
    trackingUrl,
    carrier,
    env,
    logoSrc: logo.src,
  });

  const smtpUser = env.SMTP_USER;
  const smtpPass = env.SMTP_PASS;
  if (!smtpUser || !smtpPass) {
    console.log(`[Email Mock/Dev] ${type} -> ${recipients.join(', ')} : "${email.subject}"`);
    return {
      ok: true,
      status: 200,
      body: { success: true, provider: 'logged', subject: email.subject, recipients },
    };
  }

  const smtpHost = env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(env.SMTP_PORT) || 465;
  const smtpSecure = env.SMTP_SECURE === 'true' || smtpPort === 465;
  const fromName = env.SMTP_FROM_NAME || 'Mey Beauty';
  const fromEmail = env.SMTP_FROM_EMAIL || smtpUser || 'contact@meybeauty.fr';

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: recipients.join(', '),
      subject: email.subject,
      html: email.html,
      text: email.text,
      attachments: logo.attachments,
    });

    console.log('[Email SMTP] Sent:', info.messageId, 'to:', recipients.join(', '));
    return {
      ok: true,
      status: 200,
      body: { success: true, provider: 'smtp', messageId: info.messageId, subject: email.subject, recipients },
    };
  } catch (err) {
    console.error('[Email SMTP] Error:', err.message);
    return { ok: false, status: 502, body: { error: `SMTP: ${err.message}` } };
  }
}
