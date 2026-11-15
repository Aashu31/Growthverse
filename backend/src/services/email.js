/**
 * Email delivery abstraction.
 *
 * EMAIL_PROVIDER:
 *   console (default, development) - does not deliver email. Tokens are never
 *           logged. Callers may return a development-only preview URL.
 *   smtp    - delivers with nodemailer using SMTP_* settings.
 *   none    - explicitly disabled.
 */

import config from "../config/env.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function isEmailDeliveryConfigured() {
  return (
    config.emailProvider === "smtp" &&
    Boolean(config.smtp.host) &&
    Boolean(config.smtp.user) &&
    Boolean(config.smtp.pass)
  );
}

export function getEmailProviderStatus() {
  return {
    provider: config.emailProvider,
    configured: isEmailDeliveryConfigured(),
    from: config.emailFrom,
  };
}

async function deliverWithSmtp({ to, subject, text, html }) {
  const { default: nodemailer } = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
  });
  await transporter.sendMail({ from: config.emailFrom, to, subject, text, html });
  return { delivered: true, provider: "smtp" };
}

/**
 * @returns {Promise<{delivered:boolean, provider:string, reason?:string}>}
 */
export async function sendEmail({ to, subject, text, html }) {
  if (!to) return { delivered: false, provider: config.emailProvider, reason: "missing recipient" };

  if (config.emailProvider === "smtp") {
    if (!isEmailDeliveryConfigured()) {
      return { delivered: false, provider: "smtp", reason: "SMTP credentials are incomplete" };
    }
    try {
      return await deliverWithSmtp({ to, subject, text, html });
    } catch (error) {
      // Never log the message body or tokens.
      console.error("Email delivery failed:", error.code || error.message);
      return { delivered: false, provider: "smtp", reason: "delivery failed" };
    }
  }

  if (config.emailProvider === "console") {
    // Intentionally only log metadata. Never log tokens or links.
    console.info(`[email:console] Would send "${subject}" to ${to}`);
    return { delivered: false, provider: "console", reason: "console provider does not deliver" };
  }

  return { delivered: false, provider: config.emailProvider, reason: "email provider disabled" };
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const displayName = escapeHtml(name || "there");
  return sendEmail({
    to,
    subject: "Reset your GrowthVerse password",
    text: `Hello ${name || "there"},\n\nUse this link to reset your GrowthVerse password. It expires shortly and can be used once:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>Hello ${displayName},</p><p>Use the link below to reset your GrowthVerse password. It expires shortly and can be used once.</p><p><a href="${escapeHtml(resetUrl)}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
  });
}

export async function sendVerificationEmail({ to, name, verifyUrl }) {
  const displayName = escapeHtml(name || "there");
  return sendEmail({
    to,
    subject: "Verify your GrowthVerse email",
    text: `Hello ${name || "there"},\n\nVerify your email address by opening this link:\n${verifyUrl}\n\nIf you did not create this account, you can ignore this email.`,
    html: `<p>Hello ${displayName},</p><p>Verify your email address by opening the link below.</p><p><a href="${escapeHtml(verifyUrl)}">Verify email</a></p><p>If you did not create this account, you can ignore this email.</p>`,
  });
}

export function buildPasswordResetUrl(token) {
  return `${config.frontendOrigin}/reset-password?token=${encodeURIComponent(token)}`;
}

export function buildVerificationUrl(token) {
  return `${config.frontendOrigin}/verify-email?token=${encodeURIComponent(token)}`;
}
