/**
 * Email Infrastructure
 * Uses Nodemailer + Handlebars templates
 * Configured via SMTP environment variables
 */

import nodemailer, { type Transporter } from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { env } from '../../config/env';
import { logger } from '../../config/logger';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmailOptions {
  to: string | string[];
  subject: string;
  template: EmailTemplate;
  data: Record<string, unknown>;
  attachments?: Array<{ filename: string; path: string; contentType?: string }>;
}

export enum EmailTemplate {
  WELCOME = 'welcome',
  VERIFY_EMAIL = 'verify-email',
  PASSWORD_RESET = 'password-reset',
  ORDER_CONFIRMATION = 'order-confirmation',
  ORDER_SHIPPED = 'order-shipped',
  ORDER_DELIVERED = 'order-delivered',
  APPOINTMENT_CONFIRMED = 'appointment-confirmed',
  APPOINTMENT_REMINDER = 'appointment-reminder',
  INVOICE = 'invoice',
  LOW_STOCK_ALERT = 'low-stock-alert',
  MEMBERSHIP_EXPIRING = 'membership-expiring',
  PROMOTIONAL = 'promotional',
}

// ─── Handlebars Helpers ───────────────────────────────────────────────────────

Handlebars.registerHelper('formatCurrency', (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
});

Handlebars.registerHelper('formatDate', (date: string) => {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
});

Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b);

// ─── Template Loader ──────────────────────────────────────────────────────────

const templateCache = new Map<string, HandlebarsTemplateDelegate>();

const loadTemplate = (templateName: string): HandlebarsTemplateDelegate => {
  const cached = templateCache.get(templateName);
  if (cached) {
    return cached;
  }

  const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);

  if (!fs.existsSync(templatePath)) {
    logger.warn(`Email template not found: ${templateName}. Using fallback.`);
    const fallback = Handlebars.compile('<p>{{message}}</p>');
    templateCache.set(templateName, fallback);
    return fallback;
  }

  const source = fs.readFileSync(templatePath, 'utf-8');
  const compiled = Handlebars.compile(source);
  templateCache.set(templateName, compiled);
  return compiled;
};

// ─── Transporter ──────────────────────────────────────────────────────────────

let transporter: Transporter | null = null;

const getTransporter = (): Transporter => {
  if (transporter) return transporter;

  if (!env.SMTP_USER || !env.SMTP_PASSWORD) {
    logger.warn('SMTP not configured. Emails will be logged to console only.');
    // Use Ethereal (fake SMTP) for development
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: 'ethereal_test', pass: 'ethereal_test' },
    });
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });

  return transporter;
};

// ─── Base HTML Template ───────────────────────────────────────────────────────

const BASE_EMAIL_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F5F0E8; color: #1A1A1A; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { background: #0A0A0A; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .header-logo { color: #C9A84C; font-size: 24px; font-weight: 700; letter-spacing: 2px; }
    .content { background: #FFFFFF; padding: 40px; border-radius: 0 0 12px 12px; }
    .btn { display: inline-block; background: #0A0A0A; color: #FFFFFF !important; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 20px 0; }
    .btn-gold { background: #C9A84C; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 13px; }
    .divider { border: none; border-top: 1px solid #E5E0D8; margin: 24px 0; }
    h1 { font-size: 28px; margin-bottom: 16px; }
    h2 { font-size: 20px; margin-bottom: 12px; }
    p { line-height: 1.7; margin-bottom: 16px; color: #3C3C3C; }
    .highlight { color: #C9A84C; font-weight: 600; }
    .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .order-table th { background: #F5F0E8; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .order-table td { padding: 12px 10px; border-bottom: 1px solid #E5E0D8; }
    .total-row td { font-weight: 700; font-size: 16px; background: #F5F0E8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-logo">XYZ EYEWEAR</div>
    </div>
    <div class="content">
      {{{body}}}
    </div>
    <div class="footer">
      <p>© 2024 XYZ Eyewear. All rights reserved.</p>
      <p>123 Vision Street, Mumbai, Maharashtra 400001</p>
      <p><a href="{{unsubscribeUrl}}" style="color: #888;">Unsubscribe</a> · <a href="https://xyzeyewear.com/privacy" style="color: #888;">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
`;

// ─── Built-in Templates (Inline — Phase 4 will move to .hbs files) ────────────

const INLINE_TEMPLATES: Partial<Record<EmailTemplate, string>> = {
  [EmailTemplate.WELCOME]: `
    <h1>Welcome to XYZ Eyewear, {{firstName}}! 👋</h1>
    <p>We're thrilled to have you as part of our community of discerning eyewear enthusiasts.</p>
    <p>Your account is all set. Start exploring our curated collection of premium frames.</p>
    <a href="{{shopUrl}}" class="btn btn-gold">Explore Collection</a>
    <hr class="divider">
    <p>As a new member, enjoy <span class="highlight">₹200 off</span> your first order with code: <strong>WELCOME200</strong></p>
  `,
  [EmailTemplate.VERIFY_EMAIL]: `
    <h1>Verify Your Email</h1>
    <p>Hi {{firstName}}, please verify your email address to activate your XYZ Eyewear account.</p>
    <a href="{{verifyUrl}}" class="btn">Verify Email Address</a>
    <p style="color: #888; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
  `,
  [EmailTemplate.PASSWORD_RESET]: `
    <h1>Reset Your Password</h1>
    <p>Hi {{firstName}}, we received a request to reset your password.</p>
    <a href="{{resetUrl}}" class="btn">Reset Password</a>
    <p style="color: #888; font-size: 13px;">This link expires in 1 hour. If you didn't request this, ignore this email and your password will remain unchanged.</p>
  `,
  [EmailTemplate.ORDER_CONFIRMATION]: `
    <h1>Order Confirmed! 🎉</h1>
    <p>Hi {{firstName}}, your order <span class="highlight">#{{orderNumber}}</span> has been confirmed and is being processed.</p>
    <table class="order-table">
      <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
      <tbody>
        {{#each items}}
        <tr><td>{{this.name}}</td><td>{{this.quantity}}</td><td>{{formatCurrency this.price}}</td></tr>
        {{/each}}
      </tbody>
      <tfoot>
        <tr class="total-row"><td colspan="2">Total</td><td>{{formatCurrency total}}</td></tr>
      </tfoot>
    </table>
    <a href="{{trackUrl}}" class="btn">Track Order</a>
  `,
  [EmailTemplate.ORDER_SHIPPED]: `
    <h1>Your Order is on Its Way! 📦</h1>
    <p>Hi {{firstName}}, your order <span class="highlight">#{{orderNumber}}</span> has been shipped.</p>
    <p><strong>Tracking Number:</strong> {{trackingNumber}}</p>
    <p><strong>Expected Delivery:</strong> {{expectedDelivery}}</p>
    <a href="{{trackUrl}}" class="btn">Track Package</a>
  `,
};

// ─── Send Email Function ───────────────────────────────────────────────────────

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const inlineTemplate = INLINE_TEMPLATES[options.template];
    let bodyHtml: string;

    if (inlineTemplate) {
      const bodyCompile = Handlebars.compile(inlineTemplate);
      bodyHtml = bodyCompile(options.data);
    } else {
      const templateFn = loadTemplate(options.template);
      bodyHtml = templateFn(options.data);
    }

    const baseCompile = Handlebars.compile(BASE_EMAIL_HTML);
    const html = baseCompile({
      subject: options.subject,
      body: bodyHtml,
      unsubscribeUrl: 'https://xyzeyewear.com/unsubscribe',
      ...options.data,
    });

    const mailOptions = {
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html,
      attachments: options.attachments,
    };

    if (!env.SMTP_USER) {
      // Log to console in dev if no SMTP configured
      logger.debug(`📧 Email (no SMTP): To=${mailOptions.to} Subject="${options.subject}"`);
      return;
    }

    const result = await getTransporter().sendMail(mailOptions);
    logger.debug(`📧 Email sent: ${result.messageId} to ${mailOptions.to}`);
  } catch (error) {
    // Never throw — email failures should not break the main flow
    logger.error('Failed to send email:', error);
  }
};

export default sendEmail;
