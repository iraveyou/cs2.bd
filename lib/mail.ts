import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!resendApiKey) return null;
  if (!resend) resend = new Resend(resendApiKey);
  return resend;
}

const baseUrl = process.env.NEXTAUTH_URL || 'https://cs2-bd.vercel.app';

function emailShell(title: string, content: string, userName?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <!-- Logo -->
          <tr>
            <td style="padding-bottom:24px;text-align:center;">
              <span style="font-size:28px;font-weight:900;background:linear-gradient(135deg,#22c55e,#16a34a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">CS2BD</span>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:#0d0d12;border-radius:16px;border:1px solid #1c1c26;padding:32px 28px;">
              ${userName ? `<p style="margin:0 0 16px 0;color:#a1a1aa;font-size:14px;">Hello <strong style="color:#e4e4e7;">${userName}</strong>,</p>` : ''}
              ${content}
              <hr style="border:none;border-top:1px solid #1c1c26;margin:24px 0 16px 0;" />
              <p style="margin:0;font-size:12px;color:#52525b;text-align:center;">
                CS2BD — Bangladesh CS2 Skins Marketplace<br/>
                <a href="${baseUrl}" style="color:#22c55e;text-decoration:none;">cs2bd.com</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top:16px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#3f3f46;">
                This is an automated email from CS2BD. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

interface SendEmailParams {
  to: string;
  subject: string;
  category?: string;
  title: string;
  message: string;
  link?: string;
  userName?: string;
  html?: string;
}

export async function sendEmail(params: SendEmailParams) {
  if (!resendApiKey) {
    console.log('[Mock Email] To:', params.to, '| Subject:', params.subject);
    return { success: true, mocked: true };
  }

  const html = params.html || emailShell(
    params.title,
    `<h2 style="margin:0 0 12px 0;color:#e4e4e7;font-size:18px;font-weight:700;">${params.title}</h2>
     <p style="margin:0 0 20px 0;color:#a1a1aa;font-size:14px;line-height:1.6;">${params.message}</p>
     ${params.link ? `<a href="${baseUrl}${params.link}" style="display:inline-block;background:#22c55e;color:#09090b;padding:10px 22px;border-radius:10px;font-size:13px;font-weight:700;text-decoration:none;">View Details →</a>` : ''}`,
    params.userName
  );

  try {
    const client = getResend();
    if (!client) return { success: true, mocked: true };

    const data = await client.emails.send({
      from: process.env.EMAIL_FROM || 'CS2BD <noreply@cs2bd.com>',
      to: params.to,
      subject: params.subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export function sendWelcomeEmail(to: string, userName: string, isSeller: boolean) {
  return sendEmail({
    to,
    subject: isSeller ? 'Welcome to CS2BD — Seller Account Ready' : 'Welcome to CS2BD!',
    title: isSeller ? 'Welcome, Seller!' : 'Welcome to CS2BD!',
    message: isSeller
      ? 'Your account is ready. You can now apply for seller verification to start listing your CS2 skins on the marketplace.'
      : 'Your account is ready. Start browsing thousands of CS2 skins from verified Bangladeshi sellers.',
    link: isSeller ? '/seller/apply' : '/marketplace',
    userName,
    category: 'system',
  });
}

export function sendPaymentVerifiedEmail(to: string, userName: string, itemName: string, orderId: string) {
  return sendEmail({
    to,
    subject: `Payment Verified — ${itemName}`,
    title: 'Payment Verified',
    message: `Your payment for <strong>${itemName}</strong> has been verified. The seller will now deliver the skin to your Steam account.`,
    link: `/buyer/dashboard`,
    userName,
    category: 'payment',
  });
}

export function sendPaymentRejectedEmail(to: string, userName: string, itemName: string, reason?: string) {
  return sendEmail({
    to,
    subject: `Payment Not Verified — ${itemName}`,
    title: 'Payment Not Verified',
    message: reason
      ? `Your payment for <strong>${itemName}</strong> could not be verified. Reason: ${reason}`
      : `Your payment for <strong>${itemName}</strong> could not be verified. Please contact support.`,
    link: `/buyer/dashboard`,
    userName,
    category: 'payment',
  });
}

export function sendOrderDeliveredEmail(to: string, userName: string, itemName: string) {
  return sendEmail({
    to,
    subject: `Skin Delivered — ${itemName}`,
    title: 'Skin Delivered!',
    message: `<strong>${itemName}</strong> has been delivered to your Steam account. Please confirm receipt to release payment to the seller.`,
    link: `/buyer/inventory`,
    userName,
    category: 'delivery',
  });
}

export function sendSellerApprovedEmail(to: string, userName: string) {
  return sendEmail({
    to,
    subject: 'Seller Application Approved!',
    title: 'You\'re Verified!',
    message: 'Congratulations! Your seller application has been approved. You can now list your CS2 skins on the marketplace and start selling.',
    link: `/seller/dashboard`,
    userName,
    category: 'seller',
  });
}

export function sendSellerRejectedEmail(to: string, userName: string, reason?: string) {
  return sendEmail({
    to,
    subject: 'Seller Application Update',
    title: 'Application Not Approved',
    message: reason
      ? `Unfortunately, your seller application was not approved. Reason: ${reason}`
      : 'Unfortunately, your seller application could not be approved at this time. You may reapply.',
    link: `/seller/apply`,
    userName,
    category: 'seller',
  });
}
