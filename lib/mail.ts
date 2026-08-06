import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!resendApiKey) return null;
  if (!resend) resend = new Resend(resendApiKey);
  return resend;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resendApiKey) {
    console.log('[Mock Email] To:', to, '| Subject:', subject, '| Html:', html);
    return { success: true, mocked: true };
  }

  try {
    const client = getResend();
    if (!client) return { success: true, mocked: true };

    const data = await client.emails.send({
      from: process.env.EMAIL_FROM || 'cs2bd <noreply@cs2bd.com>',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
